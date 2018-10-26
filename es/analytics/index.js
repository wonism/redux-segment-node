import 'setimmediate';
import base64 from 'base-64';
import { WEB, ANDROID, IOS, SIGN_OUT, LOG_OUT } from '../constants';
import assert from '../utils/assert';
import validate from '../utils/validate';
import setId from '../utils/setId';
import oneOf from '../utils/oneOf';
import fetchRetry from '../utils/fetchRetry';
import parseResponse from '../utils/parseResponse';
import uid from '../utils/uid';
import { version } from '../../package.json';

const noop = () => {};

export default class Analytics {
  static DEFAULT_PLATFORM = '';
  static DEFAULT_HOST = 'https://api.segment.io';
  static DEFAULT_FLUSH_AT = 20;
  static DEFAULT_FLUSH_AFTER = 10000;
  static DEFAULT_UID = uid(32);

  /**
   * Initialize a new `Analytics` with your Segment project's `writeKey` and an
   * optional dictionary of `options`.
   *
   * @param {String} writeKey
   * @param {Object} options (optional)
   *   @property {String} platform (default: '', one of ['', 'android', 'ios'])
   *   @property {String} host (default: 'https://api.segment.io')
   *   @property {Number} flushAt (default: 20)
   *   @property {Number} flushAfter (default: 10000)
   */
  constructor(
    writeKey,
    {
      platform = Analytics.DEFAULT_PLATFORM,
      host = Analytics.DEFAULT_HOST,
      flushAt = Analytics.DEFAULT_FLUSH_AT,
      flushAfter = Analytics.DEFAULT_FLUSH_AFTER,
      uid = Analytics.DEFAULT_UID,
    } = {}
  ) {
    assert(writeKey, "You must pass your Segment project's write key.");
    assert(
      oneOf({ val: platform, rules: [WEB, ANDROID, IOS] }),
      'Platform should be one of [`android`, `ios`] or `undefined`'
    );

    this.queue = [];
    this.writeKey = writeKey;
    this.platform = platform;
    this.host = host;
    this.flushAt = Math.max(flushAt, 1);
    this.flushAfter = flushAfter;
    this.userId = null;
    this.anonymousId = uid;
  }

  /**
   * Send an identify `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  identify(msg, fn) {
    if (msg.userId) {
      this.userId = msg.userId;
    }

    const message = setId(msg, this);
    validate(message);

    this.enqueue('identify', message, fn);

    return this;
  }

  /**
   * Send a group `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  group(msg, fn) {
    const message = setId(msg, this);
    validate(message);

    assert(message.groupId, 'You must pass a `groupId`.');

    this.enqueue('group', message, fn);

    return this;
  }

  /**
   * Send a track `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  track(msg, fn) {
    const message = setId(msg, this);
    validate(message);

    assert(message.event, 'You must pass an `event`.');

    this.enqueue('track', message, fn);

    if (
      oneOf({ val: message.event.toLowerCase().replace(/(-|_)/g, ''), rules: [SIGN_OUT, LOG_OUT] })
    ) {
      this.userId = null;
    }

    return this;
  }

  /**
   * Send a page `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  page(msg, fn) {
    const message = setId(msg, this);
    validate(message);

    this.enqueue('page', message, fn);

    return this;
  }

  /**
   * Send a screen `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  screen(msg, fn) {
    const message = setId(msg, this);
    validate(message);

    this.enqueue('screen', message, fn);

    return this;
  }

  /**
   * Send an alias `message`.
   *
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  alias(msg, fn) {
    const message = setId(msg, this, true);
    validate(message);

    assert(message.userId, 'You must pass a `userId` for new `id`.');

    this.enqueue('alias', message, fn);

    return this;
  }

  /**
   * Flush the current queue and callback `fn(err, batch)`.
   *
   * @param {Function} fn (optional)
   * @return {Analytics}
   */
  flush(callback = noop) {
    if (!this.queue.length) {
      return setImmediate(callback);
    }

    const items = this.queue.splice(0, this.flushAt);

    const fns = items.map(item => item.callback);
    fns.push(callback);

    const batch = items.map(item => item.message);

    const data = {
      batch,
      timestamp: new Date(),
      sentAt: new Date(),
    };

    fetchRetry(`${this.host}/v1/batch`, {
      body: JSON.stringify(data),
      method: 'post',
      headers: {
        Authorization: `Basic ${base64.encode(this.writeKey)}`,
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      retries: 5,
    })
      .then(parseResponse)
      .then(() => {
        fns.forEach((fn) => {
          fn(undefined, data);
        });
      })
      .catch((error) => {
        fns.forEach((fn) => {
          fn(error);
        });
      });

    return true;
  }

  /**
   * Add a `message` of type `type` to the queue and check whether it should be
   * flushed.
   *
   * @param {String} messageType
   * @param {Object} msg
   * @param {Function} fn (optional)
   * @api private
   */
  enqueue(messageType, msg, fn = noop) {
    const message = { ...msg };
    const libraryName = this.platform ? `analytics-${this.platform}` : 'analytics-web';

    message.type = messageType;
    message.context = message.context ? { ...message.context } : {};
    message.context.library = {
      name: libraryName,
      version,
    };

    if (!message.timestamp) {
      message.timestamp = new Date();
    }

    if (!message.messageId) {
      message.messageId = this.platform ? `${this.platform}-${uid(32)}` : `web-${uid(32)}`;
    }

    this.queue.push({
      message,
      callback: fn,
    });

    if (this.queue.length >= this.flushAt) {
      this.flush();
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (this.flushAfter) {
      this.timer = setTimeout(() => this.flush(), this.flushAfter);
    }
  }
}

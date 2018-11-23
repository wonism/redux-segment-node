import typeOf from 'type-of';
import Analytics from './analytics';
import oneOf from './utils/oneOf';
import {
  /** Platforms */
  WEB,
  ANDROID,
  IOS,
  /** Some actions */
  SIGN_OUT,
  LOG_OUT,
  /** Event types */
  EVENT_TYPE_IDENTIFY,
  EVENT_TYPE_GROUP,
  EVENT_TYPE_TRACK,
  EVENT_TYPE_PAGE,
  EVENT_TYPE_SCREEN,
  EVENT_TYPE_ALIAS,
} from './constants';

export default function createSegmentTracker(options = {}) {
  const { key, ...otherProps } = options;

  const analytics = new Analytics(key, otherProps);

  return () => next => (action) => {
    if (
      typeOf(action.analytics) === 'object' &&
      typeOf(action.analytics.eventType) === 'string' &&
      oneOf({
        val: action.analytics.eventType.toLowerCase(),
        rules: [
          EVENT_TYPE_IDENTIFY,
          EVENT_TYPE_GROUP,
          EVENT_TYPE_TRACK,
          EVENT_TYPE_PAGE,
          EVENT_TYPE_SCREEN,
          EVENT_TYPE_ALIAS,
        ],
      }) &&
      typeOf(action.analytics.eventPayload) === 'object'
    ) {
      analytics[action.analytics.eventType.toLowerCase()](action.analytics.eventPayload);
    }

    return next(action);
  };
}

export {
  WEB,
  ANDROID,
  IOS,
  SIGN_OUT,
  LOG_OUT,
  EVENT_TYPE_IDENTIFY,
  EVENT_TYPE_GROUP,
  EVENT_TYPE_TRACK,
  EVENT_TYPE_PAGE,
  EVENT_TYPE_SCREEN,
  EVENT_TYPE_ALIAS,
};

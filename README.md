# Redux Segment Platform
> Redux middleware for [segment](https://segment.com/). This library was
> created with reference to
> [analytics-react-native](https://github.com/neiker/analytics-react-native).

## Installation
```
$ npm i -S redux-segment-platform
```

## Demo
```
# replace the `key` with your `Segment API key` in `config.json`
$ npm run dev
# and visit localhost:7777
```

## Usage
```js
// import { applyMiddleware, createStore } from 'redux';
import createSegmentTracker from 'redux-segment-platform';

const segmentMiddleware = createSegmentTracker({
  key: 'API_KEY',
  flushAfter: 1000,
});

const middleware = applyMiddleware(segmentMiddleware);

// const store = createStore(/* ... */);

// identify (recommended: pass `userId` in `eventPayload`)
store.dispatch({
  type: 'SIGN_IN',
  analytics: {
    eventType: 'identify',
    eventPayload: {
      userId: 'UUID',
    },
  },
});

// track (required: pass `event` in `eventPayload`)
store.dispatch({
  type: 'CLICK_CTA_BUTTON',
  analytics: {
    eventType: 'track',
    eventPayload: {
      event: 'Click CTA Button',
    },
  },
});

// page (recommended: pass `name` in `eventPayload`)
// screen (similar with `page`)
store.dispatch({
  type: 'VIEW_PAGE',
  analytics: {
    eventType: 'page', // or 'screen'
    eventPayload: {
      name: 'LANDING_PAGE',
    },
  },
});

// group (required: pass `groupId` in `eventPayload`)
store.dispatch({
  type: 'GROUP',
  analytics: {
    eventType: 'group',
    eventPayload: {
      groupId: 'UUID',
    },
  },
});

// alias (required: pass `userId` in `eventPayload`)
store.dispatch({
  type: 'ALIAS_USER',
  analytics: {
    eventType: 'alias',
    eventPayload: {
      userId: 'NEW_UUID',
    },
  },
});
```

## Configuration
> createSegmentTracker arguments

| property   | type             | remark |
|:-----------|:-----------------|:-------|
| key        | string(required) |        |
| platform   | string(optional) | one of [`android`, `ios`] or `undefined` |
| host       | string(optional) | Host where reports will be sent. Useful for debug. |
| flushAt    | number(optional) | The number of messages to enqueue before flushing. |
| flushAfter | number(optional) | The number of milliseconds to wait before flushing the queue automatically. |

## Event Types (Segment API Specification)
- [`identify`](https://segment.com/docs/spec/identify/): Can tie an user to their action and record traits about them.
- [`track`](https://segment.com/docs/spec/track/): Can track any actions that users perform.
- [`page`](https://segment.com/docs/spec/page/): Can record the page that users are stay in.
- [`screen`](https://segment.com/docs/spec/screen/): Can record the screen that users are stay in. (for the mobile application)
- [`group`](https://segment.com/docs/spec/group/): Can associate the individual users with a group.
- [`alias`](https://segment.com/docs/spec/alias/): Can merge two user identities.

## Documentation for Segment
https://segment.com/libraries/node

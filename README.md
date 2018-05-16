# Redux Segment Platform
> Redux middleware for [segment](https://segment.com/). This library was
> created with reference to
> [analytics-react-native](https://github.com/neiker/analytics-react-native).

## Installation
```
$ npm i -S redux-segment-platform
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

store.dispatch({
  type: 'SIGN_IN',
  analytics: {
    eventType: 'identify',
    eventPayload: {
      userId: 'UUID',
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

## Demo
```
$ npm run dev
# and visit localhost:7777
```

## Documentation for segment
https://segment.com/libraries/node

import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSegmentTracker from '../src';
import uid from '../src/utils/uid';
import config from '../config.json';

const isProduction = process.env.NODE_ENV === 'production';

const segmentMiddleware = createSegmentTracker({
  key: config.key,
  flushAfter: 1000,
});

const middleware = applyMiddleware(segmentMiddleware);
const composeEnhancers = !isProduction ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeWithDevTools : compose;
const store = createStore(state => state, {}, composeEnhancers(middleware));

store.dispatch({
  type: 'SIGN_IN',
  analytics: {
    eventType: 'identify',
    eventPayload: {
      userId: uid(32),
    },
  },
});

store.dispatch({
  type: 'VIEW_LANDING_PAGE',
  analytics: {
    eventType: 'page',
    eventPayload: {
      name: 'Landing page',
    },
  },
});

const sampleEvent = {
  event: 'Sample event',
};

global.document.querySelector('button').addEventListener('click', () => {
  store.dispatch({
    type: 'CLICK_EVENT',
    analytics: {
      eventType: 'track',
      eventPayload: sampleEvent,
    },
  });
});

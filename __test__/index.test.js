import createSegmentTracker from '../es';

describe('Redux Segment Node', () => {
  it('Output of Middleware without API Key.', () => {
    expect(() => createSegmentTracker()).toThrow('You must pass your Segment project\'s write key.');
  });

  it('Output of Middleware with API Key.', () => {
    const middleware = createSegmentTracker({ key: 'API_KEY' });

    expect(typeof middleware).toBe('function');

    const nextHandler = middleware({});

    expect(typeof nextHandler).toBe('function');
    expect(nextHandler.length).toBe(1);

    const actionHandler = nextHandler();

    expect(typeof actionHandler).toBe('function');
    expect(actionHandler.length).toBe(1);
  });
});

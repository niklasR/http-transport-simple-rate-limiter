'use strict';
const assert = require('assert');
const sinon = require('sinon');

const RequestLimiter = require('../index');

const context = {
  plugins: [],
  req: {
    _queries: {},
    _headers: {
      'User-Agent': 'http-transport/1.0.0'
    },
    _method: 'GET',
    _url: 'https://jsonplaceholder.typicode.com/posts/1'
  },
  res: {
    elapsedTime: 0,
    headers: {}
  }
};

const makeNext = (spy) => {
  return () => {
    return new Promise((resolve) => {
      spy();
      resolve();
    });
  };
};

describe('Simple Rate Limiter', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('returns a promise', (done) => {
    const requestLimiter = RequestLimiter(10, 100);
    const next1 = makeNext(() => {});

    requestLimiter(context, next1).then(() => {
      done();
    });

    clock.tick(1);
  });

  it('limits requests', (done) => {
    const requestLimiter = RequestLimiter(1, 10000);

    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    requestLimiter(context, makeNext(spy1));
    requestLimiter(context, makeNext(spy2));

    clock.tick(1);
    assert.ok(spy1.called);
    assert.ok(!spy2.called);

    clock.tick(9998);
    assert.ok(!spy2.called);

    clock.tick(1);
    assert.ok(spy2.called);
    done();
  });
});

# http-transport-simple-rate-limiter
A global plugin for http-transport to utilise the simple-rate-limiter that was in use in Flashheart

[![Build Status](https://travis-ci.org/niklasR/http-transport-simple-rate-limiter.svg?branch=master)](https://travis-ci.org/niklasR/http-transport-simple-rate-limiter)

## Usage

Configure the plugin as shown below. You can then use it as a global plugin for http-transport.
```js
const simpleRateLimiterPlugin = require('http-transport-simple-rate-limiter')(count, duration);
```

The plugin takes two arguments:
- `count`: The amount of calls that are allowed per time window
- `duration`: The length of the time window to restrict calls within. In milliseconds.

### Example

```js
'use strict';
const url = 'http://example.com/';
const simpleRateLimiterPlugin = require('http-transport-simple-rate-limiter');

const client = require('http-transport').createClient()
  .useGlobal(simpleRateLimiterPlugin(2, 1000));

client
  .get(url)
  .asResponse()
  .then((res) => {
    if (res.statusCode === 200) {
      console.log(res.body);
    }
  });
```

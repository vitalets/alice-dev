/**
 * Entry point.
 */

const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://a2f9dd5d423c433ab15c8ca9e9aad1f0@sentry.io/1812312' });

const Server = require('./server');
const logger = require('loggee').create('index');

new Server()
  .start({
    port: process.env.PORT || 3000
  })
  .catch(e => {
    logger.error(e);
    process.exit(1);
  });


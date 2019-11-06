/**
 * Entry point.
 */

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


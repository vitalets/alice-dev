const chai = require('chai');
const getPort = require('get-port');
const User = require('alice-tester');
const Logger = require('loggee');
const Server = require('../src/back/server');
const skillServer = require('./helpers/skill-server');
const staticServer = require('./helpers/static-server');
const Browser = require('./helpers/browser');

chai.config.truncateThreshold = 0;
Logger.setLogLevel(process.env.LOGGEE_LEVEL || 'none');

(async () => {
  const server = new Server();
  const browser = new Browser();

  Object.assign(global, {
    assert: chai.assert,
    User,
    browser,
  });

  before(async () => {
    await Promise.all([
      server.start({
        port: await getPort(),
      }),
      skillServer.listen(await getPort()),
      staticServer.setOptions({public: 'dist'}).listen(await getPort()),
    ]);
    User.config.webhookUrl = `http://localhost:${server.port}`;
    await browser.open(`http://localhost:${staticServer.address().port}`);
  });

  after(async () => {
    const results = await Promise.all([
      server.stop(),
      skillServer.close(),
      staticServer.close(),
      browser.close(),
    ].map(p => p.catch(e => e)));
    handleCleanupErrors(results);
  });

  function handleCleanupErrors(results) {
    const errors = results.filter(r => r instanceof Error);
    errors.forEach(e => console.error(e));
    if (errors.length) {
      process.exit(1);
    }
  }
})();

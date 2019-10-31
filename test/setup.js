const chai = require('chai');
const getPort = require('get-port');
const User = require('alice-tester');
const Logger = require('loggee');
const WebSocket = require('websocket').w3cwebsocket;
const {URL} = require('url');
const Server = require('../src/back/server');
const skillServer = require('./helpers/skill-server');
const staticServer = require('./helpers/static-server');
const BrowserHelper = require('./helpers/browser');
const PO = require('./helpers/po');
const {buildUrl} = require('../src/shared/utils');

// emulate browser context
Object.assign(global, {
  URL,
  WebSocket,
});

chai.config.truncateThreshold = 0;

const debugMode = process.env.DEBUG_MODE;
Logger.setLogLevel(debugMode ? 'debug' : 'none');

(async () => {
  const server = new Server();
  const browserHelper = new BrowserHelper({ debugMode });

  before(async () => {
    await Promise.all([
      server.start({
        port: await getPort(),
      }),
      skillServer.listen(await getPort()),
      staticServer.setOptions({public: 'dist'}).listen(await getPort()),
    ]);
    User.config.webhookUrl = `http://localhost:${server.port}`;
    const pageUrl = buildUrl(`http://localhost:${staticServer.address().port}`, {
      wsUrl: `ws://localhost:${server.port}`,
    });
    await browserHelper.prepare(pageUrl);

    Object.assign(global, {
      assert: chai.assert,
      PO,
      User,
      browserHelper,
      page: browserHelper.page,
    });
  });

  after(async () => {
    const results = await Promise.all([
      browserHelper.close(),
      server.close(),
      skillServer.close(),
      staticServer.close(),
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

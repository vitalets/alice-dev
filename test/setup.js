const chai = require('chai');
const getPort = require('get-port');
const User = require('alice-tester');
const Logger = require('loggee');
const Server = require('../src/backend/server');
const skillServer = require('./helpers/skill-server');
const staticServer = require('./helpers/static-server');
const BrowserHelper = require('./helpers/browser');
const PageHelper = require('./helpers/page');
const PO = require('./helpers/po');
const {buildUrl} = require('../src/shared/utils');

chai.config.truncateThreshold = 0;
User.config.responseTimeout = 3000;

const debugMode = process.env.DEBUG_MODE;
const headless = process.env.PUPPETEER_HEADLESS !== 'false';
Logger.setLogLevel(debugMode ? 'debug' : 'none');

(async () => {
  const webhookServer = new Server();
  const browserHelper = new BrowserHelper({ debugMode, headless });

  before(async () => {
    await Promise.all([
      webhookServer.start({ port: await getPort() }),
      skillServer.listen(await getPort()),
      staticServer.setOptions({public: 'dist'}).listen(await getPort()),
      browserHelper.init(),
    ]);
    User.config.webhookUrl = `http://localhost:${webhookServer.port}`;
    const pageUrl = buildUrl(`http://localhost:${staticServer.address().port}`, {
      wsUrl: `ws://localhost:${webhookServer.port}`,
    });

    const page = browserHelper.page;
    const pageHelper = new PageHelper(page);
    // сразу делаем первый переход, чтобы быть на нужном origin и иметь возможность менять localStorage
    await page.goto(pageUrl);

    Object.assign(global, {
      assert: chai.assert,
      PO,
      User,
      page,
      pageHelper,
      webhookServer,
      skillServer,
    });
  });

  after(async () => {
    const results = await Promise.all([
      browserHelper.close(),
      webhookServer.close(),
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

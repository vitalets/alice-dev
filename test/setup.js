const path = require('path');
const fs = require('fs-extra');
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

const staticPath = process.env.NODE_ENV === 'production' ? 'dist/prod' : 'dist/dev';
console.log(`TESTING PATH: ${staticPath}`);

const screenshotsDir = 'screenshots';

(async () => {
  const webhookServer = new Server();
  const browserHelper = new BrowserHelper({ debugMode, headless });

  before(async () => {
    fs.emptyDirSync(screenshotsDir);
    await Promise.all([
      webhookServer.start({ port: await getPort() }),
      skillServer.listen(await getPort()),
      staticServer.setOptions({public: staticPath}).listen(await getPort()),
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

  // нужно использовать function чтобы получить контекст this
  afterEach(async function () {
    if (this.currentTest.state !== 'passed') {
      const screenshotPath = getScreenshotPath(this);
      fs.ensureDirSync(path.dirname(screenshotPath));
      await page.screenshot({
        path: screenshotPath
      });
      this.currentTest.err.stack = [
        this.currentTest.err.stack,
        `Screenshot: file://${path.resolve(screenshotPath)}`,
      ].join('\n');
    }
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

})();

function getScreenshotPath(testContext) {
  const suiteTitle = testContext.test.parent.title.replace(/[\s()]/g, '_');
  const isTestFailed = Boolean(typeof testContext.currentTest !== 'undefined');
  const testTitle = isTestFailed ? testContext.currentTest.title : testContext.test.title;
  const testFolderName = testTitle.replace(/[\s()]/g, '_');
  return path.join(screenshotsDir, suiteTitle, testFolderName, 'testFailed.png');
}

function handleCleanupErrors(results) {
  const errors = results.filter(r => r instanceof Error);
  errors.forEach(e => console.error(e));
  if (errors.length) {
    process.exit(1);
  }
}

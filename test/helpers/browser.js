/**
 * Wrapper over puppeteer.
 */
const puppeteer = require('puppeteer');

module.exports = class BrowserHelper {
  constructor({ debugMode, headless }) {
    this.browser = null;
    this.page = null;
    this.debugMode = Boolean(debugMode);
    this.headless = headless;
  }

  async init() {
    await this._launchBrowser();
    await this._preparePage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async _launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: this.headless,
      slowMo: this.headless ? 0 : 100
    });
  }

  async _preparePage() {
    this.page = (await this.browser.pages())[0];
    await this.page.setCacheEnabled(false);
    this.page.setDefaultTimeout(1000);
    this.page.setDefaultNavigationTimeout(3000);
    this.page.on('pageerror', error => console.log('PAGE ERROR:', error));
    if (this.debugMode) {
      await this._applyDebugMode();
    }
  }

  async _applyDebugMode() {
    this.page.on('console', async msg => {
      const args = msg.args();
      const strings = [];
      for (let i = 0; i < args.length; ++i) {
        const jsonValue = await args[i].jsonValue();
        strings.push(typeof jsonValue === 'object' ? JSON.stringify(jsonValue) : jsonValue);
      }
      console.log('PAGE LOG:', strings.join(' '));
    });
  }
};

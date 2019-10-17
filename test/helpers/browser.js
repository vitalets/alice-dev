/**
 * Wrapper over puppeteer.
 */
const puppeteer = require('puppeteer');

module.exports = class Browser {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async open(url) {
    if (!this.browser) {
      await this._launchBrowser();
    }
    await this.page.goto(url);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async _launchBrowser() {
    this.browser = await puppeteer.launch({headless: false});
    this.page = await this.browser.newPage();
    await this.page.setCacheEnabled(false);
  }
};

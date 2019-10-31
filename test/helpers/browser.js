/**
 * Wrapper over puppeteer.
 */
const puppeteer = require('puppeteer');

class Browser {
  constructor({debugMode} = {}) {
    this.browser = null;
    this.page = null;
    this.debugMode = Boolean(debugMode);
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
    const options = this.debugMode
      ? { headless: false, slowMo: 100 }
      : { headless: true };
    this.browser = await puppeteer.launch(options);
    this.page = (await this.browser.pages())[0];
    await this.page.setCacheEnabled(false);
    await this.page.evaluateOnNewDocument(() => localStorage.removeItem('state'));
    if (this.debugMode) {
      this.page.on('pageerror', message => console.log('PAGE ERROR:', message));
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
  }
}

module.exports = Browser;

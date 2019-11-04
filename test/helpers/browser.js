/**
 * Wrapper over puppeteer.
 */
const puppeteer = require('puppeteer');
const PO = require('./po');

class BrowserHelper {
  constructor({ debugMode }) {
    this.browser = null;
    this.page = null;
    this.debugMode = Boolean(debugMode);
  }

  async prepare(pageUrl) {
    await this._launchBrowser();
    await this._preparePage(pageUrl);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async reloadPage(appState = null) {
    await this._setAppState(appState);
    await this.page.reload();
    await this.page.waitForSelector(PO.connectionBar);
  }

  async reloadPageForUserId(userId) {
    const appState = {
      devices: [{userId, deviceName: 'My Device'}]
    };
    await this.reloadPage(appState);
  }

  async getChatMessages() {
    return this.page.$$eval(PO.chat.messages, elems => elems.map(el => el.textContent));
  }

  async _launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: true
    });
  }

  async _preparePage(pageUrl) {
    this.page = (await this.browser.pages())[0];
    await this.page.setCacheEnabled(false);
    // сразу делаем первый переход, чтобы быть на нужном origin и иметь возможность менять localStorage
    await this.page.goto(pageUrl);
    if (this.debugMode) {
      await this._applyDebugMode();
    }
  }

  async _setAppState(appState) {
    await this.page.evaluate(appState => {
      if (appState) {
        localStorage.setItem('state', JSON.stringify(appState));
      } else {
        localStorage.removeItem('state');
      }
    }, appState);
  }

  async _applyDebugMode() {
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

module.exports = BrowserHelper;

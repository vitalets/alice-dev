/**
 * Helper over puppeteer page.
 */

const PO = require('./po');

module.exports = class PageHelper {
  constructor(page) {
    this.page = page;
  }

  async reloadPage(appState = null) {
    await this.setAppState(appState);
    await this.page.reload();
    await this.waitConnectionBarText('Подключено');
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

  async setAppState(appState) {
    await this.page.evaluate(appState => {
      if (appState) {
        localStorage.setItem('state', JSON.stringify(appState));
      } else {
        localStorage.removeItem('state');
      }
    }, appState);
  }

  async getConnectionBarText() {
    return this.page.$eval(PO.connectionBar, el => el.textContent);
  }

  async getElementText(selector) {
    return this.page.$eval(selector, el => el.textContent);
  }

  async waitConnectionBarText(text) {
    const jsHandle = await this.page.waitForFunction((sel, text) => {
      const el = document.querySelector(sel);
      if (el && el.textContent.includes(text)) {
        return el.textContent;
      }
    }, {}, PO.connectionBar, text);
    return jsHandle.jsonValue();
  }

  async waitChatMessagesCount(count) {
    return this.page.waitForFunction((selector, count) => {
      return document.querySelectorAll(selector).length >= count;
    }, {}, PO.chat.messages, count);
  }

  async setInputValue(selector, value) {
    await this.page.click(selector, { clickCount: 3 });
    await this.page.type(selector, value);
  }

  async getInputValue(selector) {
    return this.page.$eval(selector, el => el.value);
  }

  async waitForSelectorContainText(selector, text) {
    const jsHandle = await this.page.waitForFunction((selector, text) => {
      const el = document.querySelector(selector);
      if (el && el.textContent.includes(text)) {
        return el.textContent;
      }
    }, {}, selector, text);
    return jsHandle.jsonValue();
  }
};

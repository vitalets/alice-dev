/**
 * Page objects.
 */

exports.connectionBar = '#connection-bar';
exports.testButton = '#test-button';
exports.connectButton = '#connect-button';
exports.proxyUrl = {
  radio: 'input[name="radio-proxy-url"]',
  input: 'input[name="proxy-url"]',
};
exports.fixedResponse = {
  radio: 'input[name="radio-fixed-response"]',
  text: 'textarea[name="text"]',
  tts: 'textarea[name="tts"]',
};

exports.chat = {
  messages: '.chat > .message',
  lastAliceMessage: '.chat > .alice-message:last-child',
  lastAliceMessageMenuButton: '.chat > .alice-message:last-child button',
  messageMenu: {
    firstItem: 'ul[role="menu"] li:first-child',
  },
};

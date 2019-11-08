/**
 * Page objects.
 * todo: create pageobject helper
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
  lastMessage: '.chat > .message:last-child',
  lastMessageMenuButton: '.chat > .message:last-child button',
  messageMenu: {
    firstChild: 'ul[role="menu"] li:first-child',
    secondChild: 'ul[role="menu"] li:nth-child(2)',
  },
};

exports.jsonPopup = {
  title: '#json-popup h2',
  value: '', // todo
};

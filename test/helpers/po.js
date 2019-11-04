/**
 * Page objects.
 */

exports.connectionBar = '#client-snackbar';
exports.testButton = '#test-button';
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
  messageMenu: {
    button: '.chat > .message button',
    firstItem: 'ul[role="menu"] li:first-child',
  },
};

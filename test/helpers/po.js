/**
 * Page objects.
 */

const po = require('./pageobject');

const connectionBar = exports.connectionBar = po`#connection-bar`;
connectionBar.connectButton = po`#connect-button`;

const proxyUrl = exports.proxyUrl = po``;
proxyUrl.radio = po`input[name="radio-proxy-url"]`;
proxyUrl.input = po`input[name="proxy-url"]`;
proxyUrl.testButton = po`#test-button`;

const fixedResponse = exports.fixedResponse = po``;
fixedResponse.radio = po`input[name="radio-fixed-response"]`;
fixedResponse.text = po`textarea[name="text"]`;
fixedResponse.tts = po`textarea[name="tts"]`;

const chat = exports.chat = po`.chat`;
chat.messages = po`> .message`;
chat.messages.menuButton = po`button`;

const chatMenu = exports.chatMenu = po`ul[role="menu"]`;
chatMenu.item = po`li`;

const jsonPopup = exports.jsonPopup = po`#json-popup`;
jsonPopup.title = po`h2`;
jsonPopup.content = po`.jsoneditor`;


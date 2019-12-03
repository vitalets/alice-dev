/**
 * Page objects.
 * See: https://github.com/vitalets/page-object
 */

const po = require('@vitalets/page-object');

const connectionBar = exports.connectionBar = po`#connection-bar`;
connectionBar.connectButton = po`#connect-button`;
connectionBar.changeDeviceButton = po`#change-device-button`;

exports.validationCheckbox = po`#validation-checkbox`;
exports.testButton = po`#test-button`;

const proxyUrl = exports.proxyUrl = po``;
proxyUrl.radio = po`input[name="radio-proxy-url"]`;
proxyUrl.input = po`input[name="proxy-url"]`;

const fixedResponse = exports.fixedResponse = po``;
fixedResponse.radio = po`input[name="radio-fixed-response"]`;
fixedResponse.text = po`textarea[name="text"]`;
fixedResponse.tts = po`textarea[name="tts"]`;
fixedResponse.switchMode = po`input[name="fixed-response-mode-json"]`;
//fixedResponse.switchMode = po`label.switch-to-json`;
fixedResponse.editor = po`#fixed-response-editor .jsoneditor`;
fixedResponse.editor.textarea = fixedResponse.editor` textarea`;

const chat = exports.chat = po`.chat`;
chat.messages = chat` .message`;
chat.lastMessage = chat.messages`:last-child`;
chat.lastMessage.menuButton = chat.lastMessage` button`;
chat.preLastMessage = chat.messages`:nth-last-child(2)`;
chat.preLastMessage.menuButton = chat.preLastMessage` button`;

const chatMenu = exports.chatMenu = po`ul[role="menu"]`;
chatMenu.item = chatMenu` li`;

const jsonPopup = exports.jsonPopup = po`#json-popup`;
jsonPopup.title = jsonPopup` h2`;
jsonPopup.title.closeButton = jsonPopup.title` button`;
jsonPopup.content = jsonPopup` .jsoneditor`;


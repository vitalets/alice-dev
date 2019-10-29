import {CONNECTION_STATE, MODE} from './const';

export default {
  connectionState: CONNECTION_STATE.DISCONNECTED,
  mode: MODE.FIXED_RESPONSE,
  proxyUrl: 'http://localhost:3000',
  fixedResponse: {
    text: 'Здорово! Как дела?',
    tts: 'Здор+ово! Как дела?',
  },
  devices: [],
  userMessages: [],
  aliceMessages: [],
};

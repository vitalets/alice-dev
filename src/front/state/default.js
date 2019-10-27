import {CONNECTION_STATE, MODE} from './const';

export default {
  connectionState: CONNECTION_STATE.DISCONNECTED,
  fixedResponse: {
    text: 'Привет',
    tts: 'Привет!',
  },
  proxyUrl: 'http://localhost:3000',
  mode: MODE.FIXED_RESPONSE,
  devices: [],
  aliceRequests: [],
  aliceResponses: [],
};

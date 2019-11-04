import {CONNECTION_STATE, MODE} from './const';

export default {
  connectionState: CONNECTION_STATE.DISCONNECTED,
  mode: MODE.FIXED_RESPONSE,
  proxyUrl: 'http://localhost:3000',
  fixedResponse: {
    text: 'Добро пожаловать в навык!',
    tts: 'Добро пожаловать в н+авык!',
  },
  devices: [], // {userId, deviceName}
  chatMessages: [], // {id, requestBody, responseBody, error?}
};

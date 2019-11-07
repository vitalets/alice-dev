import {CONNECTION_STATE, MODE} from './const';

export default {
  connectionState: CONNECTION_STATE.DISCONNECTED,
  authCode: '',
  mode: MODE.FIXED_RESPONSE,
  proxyUrl: 'http://localhost:3000',
  fixedResponse: {
    text: 'Ответ со страницы alice-dev',
    tts: 'Ответ со страницы элис-дев',
  },
  devices: [], // {userId, deviceName}
  chatMessages: [], // {id, requestBody, responseBody}
};

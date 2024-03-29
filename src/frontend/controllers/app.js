/**
 * App controller.
 */
import config from '../config';
import WSClient from './ws-client';
import ProxyToUrl from './proxy';
import {
  TestButtonClicked,
  ConnectButtonClicked,
  ChangeDeviceButtonClicked,
} from '../store/channels';
import getTestRequest from './get-test-request';
import { validateResponseBody } from './response-validator';

import {
  MODE,
  dispatch,
  getState,
  addUserMessage,
  addAliceMessage,
} from '../store';

const logger = Logger.create('app');

export default class AppController {
  constructor() {
    TestButtonClicked.addListener(() => this._sendTestRequest());
    this._createWsClient();
    ConnectButtonClicked.addListener(() => this._wsClient.connect());
    ChangeDeviceButtonClicked.addListener(() => this._wsClient.clearDevices());
  }

  run() {
    logger.debug('app started');
    this._wsClient.connect();
  }

  _createWsClient() {
    this._wsClient = new WSClient(config.wsUrl);
    this._wsClient.onAliceRequest.addListener(async (id, requestBody) => {
      const responseBody = await this._handleAliceRequest(id, requestBody);
      this._wsClient.sendAliceResponse(id, responseBody);
    });
  }

  async _handleAliceRequest(id, requestBody) {
    dispatch(addUserMessage({id, requestBody}));
    const originalResponseBody = await this._getAliceResponse(requestBody);
    const validationError = getState().validateResponse && validateResponseBody(originalResponseBody);
    const responseBody = validationError
      ? this._getErrorResponse(validationError, requestBody)
      : originalResponseBody;
    dispatch(addAliceMessage({id, responseBody}));
    return responseBody;
  }

  async _getAliceResponse(requestBody) {
    try {
      return getState().mode === MODE.PROXY_URL
        ? await new ProxyToUrl(requestBody).proxy()
        : this._getFixedResponse();
    } catch (e) {
      logger.error(e);
      return this._getErrorResponse(e);
    }
  }

  _getFixedResponse() {
    return {
      response: getState().fixedResponse,
      version: '1.0',
    };
  }

  _getErrorResponse(error) {
    return {
      response: {
        text: `Ошибка: ${error.message || String(error)}`,
        tts: 'Ошибка',
        end_session: false,
      },
      version: '1.0',
    };
  }

  _sendTestRequest() {
    const isNewSession = getState().chatMessages.length === 0;
    const request = getTestRequest(isNewSession);
    void this._handleAliceRequest(Date.now(), request);
  }
}

/**
 * App controller.
 */
import config from '../config';
import WSClient from './ws-client';
import ProxyToUrl from './proxy';
import { TestButtonClicked, ConnectButtonClicked } from '../store/channels';
import testRequest from './test-request';

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
    TestButtonClicked.addListener(() => this._handleAliceRequest(Date.now(), testRequest));
    this._createWsClient();
    ConnectButtonClicked.addListener(() => this._wsClient.connect());
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
    const responseBody = await this._getAliceResponse(requestBody);
    dispatch(addAliceMessage({id, responseBody}));
    return responseBody;
  }

  async _getAliceResponse(requestBody) {
    try {
      return getState().mode === MODE.PROXY_URL
        ? await new ProxyToUrl(requestBody).proxy()
        : this._getFixedResponse(requestBody);
    } catch (e) {
      logger.error(e);
      return this._getErrorResponse(e, requestBody);
    }
  }

  _getFixedResponse(requestBody) {
    const {session, version} = requestBody;
    return {
      response: getState().fixedResponse,
      session,
      version,
    };
  }

  _getErrorResponse(error, requestBody) {
    const {session, version} = requestBody;
    return {
      response: {
        text: `Error: ${error.message}`,
        tts: 'Ошибка'
      },
      session,
      version,
    };
  }
}

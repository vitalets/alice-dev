/**
 * App controller.
 */
import config from '../config';
import WSClient from './ws-client';
import { buildUrl } from '../../shared/utils';
import { getProxiedResponse } from './proxy';
import { TestButtonClicked } from '../store/channels';
import testRequest from './test-request';

import {
  store,
  CONNECTION_STATE,
  MODE,
  setConnectionState,
  addUserMessage,
  addAliceMessage
} from '../store';

const {getState, dispatch} = store;

const logger = Logger.create('app');

export default class AppController {
  constructor() {
    TestButtonClicked.addListener(() => this._handleAliceRequest(Date.now(), testRequest));
    this._createWsClient();

  }

  run() {
    logger.debug('app started');
    this._wsClient.connect();
  }

  _createWsClient() {
    this._wsClient = new WSClient(this._buildWsUrl());
    this._wsClient.wsp.onOpen.addListener(() => dispatch(setConnectionState(CONNECTION_STATE.CONNECTED)));
    this._wsClient.wsp.onClose.addListener(() => dispatch(setConnectionState(CONNECTION_STATE.DISCONNECTED)));
    this._wsClient.onAliceRequest.addListener(async (id, requestBody) => {
      const responseBody = await this._handleAliceRequest(id, requestBody);
      this._wsClient.sendAliceResponse(id, responseBody);
    });
  }

  _buildWsUrl() {
    const firstDevice = getState().devices[0];
    const userId = firstDevice && firstDevice.userId;
    return buildUrl(config.wsUrl, {userId});
  }

  async _handleAliceRequest(id, requestBody) {
    logger.log('REQUEST:', requestBody);
    dispatch(addUserMessage({id, requestBody}));
    const responseBody = await this._getAliceResponse(requestBody);
    logger.log('RESPONSE:', responseBody);
    dispatch(addAliceMessage({id, responseBody}));
    return responseBody;
  }

  async _getAliceResponse(requestBody) {
    try {
      return getState().mode === MODE.PROXY_URL
        ? await getProxiedResponse(requestBody)
        : this._getFixedResponse(requestBody);
    } catch (e) {
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
        text: error.stack || `Error: ${error.message}`,
        tts: 'Ошибка'
      },
      session,
      version,
    };
  }
}

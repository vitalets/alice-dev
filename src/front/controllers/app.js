/**
 * App controller.
 */
import Logger from 'loggee';
import * as config from '../config';
import WSClient from './ws-client';
import { buildUrl } from '../../shared/utils';

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
    this._createWsClient();
  }

  _createWsClient() {
    this._wsClient = new WSClient(this._buildWsUrl());
    this._wsClient.wsp.onOpen.addListener(() => dispatch(setConnectionState(CONNECTION_STATE.CONNECTED)));
    this._wsClient.wsp.onClose.addListener(() => dispatch(setConnectionState(CONNECTION_STATE.DISCONNECTED)));
    this._wsClient.onAliceRequest.addListener((id, requestBody) => this._handleAliceRequest(id, requestBody));
  }

  _buildWsUrl() {
    const query = new URL(location.href).searchParams;
    const wsUrl = query.get('ws') || config.wsUrl;
    const firstDevice = getState().devices[0];
    const userId = firstDevice && firstDevice.userId;
    return buildUrl(wsUrl, {userId});
  }

  async _handleAliceRequest(id, requestBody) {
    logger.log('REQUEST:', requestBody);
    dispatch(addUserMessage(requestBody));
    const responseBody = await this._getAliceResponse(requestBody);
    logger.log('RESPONSE:', responseBody);
    dispatch(addAliceMessage(responseBody));
    this._wsClient.sendAliceResponse(id, responseBody);
  }

  async _getAliceResponse(requestBody) {
    return getState().mode === MODE.PROXY_URL
      ? await this._fetchProxiedResponse(requestBody)
      : this._buildFixedResponse(requestBody);
  }

  _buildFixedResponse(requestBody) {
    const {session, version} = requestBody;
    return {
      response: getState().fixedResponse,
      session,
      version,
    };
  }

  async _fetchProxiedResponse(requestBody) {
    const response = await fetch(getState().proxyUrl, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    // todo: handle error
    return response.ok ? response.json() : {};
  }
}

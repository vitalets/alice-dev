/**
 * App controller.
 */
import Logger from 'loggee';
import * as config from '../config';
import WsClient from './ws-client';
import Devices from './devices';
import {buildUrl} from '../../shared/utils';

const logger = Logger.create('app');

export default class AppController {
  constructor() {
    logger.log('App created');
    this._devices = new Devices();
    this._wsClient = new WsClient(this._buildWsUrl());
    this._setListeners();
  }

  _buildWsUrl() {
     const query = new URL(location.href).searchParams;
     const wsUrl = query.get('ws') || config.wsUrl;
     const firstDevice = this._devices.getAll()[0];
     const userId = firstDevice && firstDevice.userId;
     return buildUrl(wsUrl, {userId});
  }

  _setListeners() {
    WsClient.onModeChanged.addListener(mode => this._wsClient.mode = mode);
    WsClient.onFixedAnswerChanged.addListener(({text, tts}) => this._wsClient.aliceResponse = {text, tts});
    WsClient.onProxyUrlChanged.addListener(url => this._wsClient.proxyUrl = url);
  }
}

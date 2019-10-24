/**
 * App controller.
 */
import Logger from 'loggee';
import * as config from '../config';
import WsClient from './ws-client';
import * as storage from './storage';
import {buildUrl} from '../../shared/utils';

const logger = Logger.create('app');

export default class App {
  constructor() {
    this._auth = storage.loadAuth();
    this._createWsClient();
  }

  run() {
    logger.log('App started');
  }

  _createWsClient() {
    const wsUrl = this._buildWsUrl();
    this._wsClient = new WsClient(wsUrl);
  }

  _buildWsUrl() {
     const query = new URL(location.href).searchParams;
     const wsUrl = query.get('ws') || config.wsUrl;
     const {userId} = this._auth;
     return buildUrl(wsUrl, {userId});
  }
}

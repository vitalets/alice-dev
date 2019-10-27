/**
 * App controller.
 */
import Logger from 'loggee';
import * as config from '../config';
import WSClient from './ws-client';
import Devices from './devices';
import { buildUrl } from '../../shared/utils';

const logger = Logger.create('app');

export default class AppController {
  constructor() {
    logger.log('App created');
    this._devices = new Devices();
    this._createWsClient();
    this._createAliceLogger();
  }

  _createWsClient() {
    this._wsClient = new WSClient(this._buildWsUrl());
    this._wsClient.wsp.onOpen.addListener(() => {
      globalState.mode = CONNECTION_STATE.CONNECTED;
      // const [, setMode] = useGlobalState()
    });
    this._wsClient.wsp.onClose.addListener(() => {
     // globalState.mode = CONNECTION_STATE.DISCONNECTED;
      // const [, setMode] = useGlobalState()
    });
    this._wsClient.onAliceRequest.addListener(r => {
     // globalState.aliceRequests.push(r);
    });
    this._wsClient.onAliceResponse.addListener(r => {
      //globalState.aliceResponses.push(r);
    });
    //onConnectionRequest.addListener(() => this._wsClient.connect())
    // onModeChanged.addListener(({ isFixedResponse }) => {
    //   this._wsClient.mode = isFixedResponse ? WSClient.MODE_FIXED_RESPONSE : WSClient.MODE_PROXY_URL;
    // });
    // onFixedAnswerChanged.addListener(({ text, tts }) => this._wsClient.aliceResponse = { text, tts });
  }

  _createAliceLogger() {
    const aliceConsoleLogger = Logger.create('alice');
    this._wsClient.onAliceRequest.addListener(r => aliceConsoleLogger.log('REQUEST:', r));
    this._wsClient.onAliceResponse.addListener(r => aliceConsoleLogger.log('RESPONSE:', r));
  }

  _buildWsUrl() {
    const query = new URL(location.href).searchParams;
    const wsUrl = query.get('ws') || config.wsUrl;
    const firstDevice = this._devices.getAll()[0];
    const userId = firstDevice && firstDevice.userId;
    return buildUrl(wsUrl, {userId});
  }
}

import { handleActions } from 'redux-actions';
import produce from 'immer';
import defaultState from './default-state';
import persistentState from './persistent-state';
import {
  setConnectionState,
  setAuthCode,
  addDevice,
  clearDevices,
  setMode,
  setProxyUrl,
  setFixedResponse,
  addUserMessage,
  addAliceMessage,
} from './actions';

const MAX_MESSAGES_IN_LOG = 10;

const savedState = persistentState.load();
const initialState = {
  ...defaultState,
  ...savedState,
};

export const rootReducer = handleActions({
  [setConnectionState]: (state, {payload}) => {
    return produce(state, newState => void (newState.connectionState = payload));
  },
  [setMode]: (state, {payload}) => {
    return produce(state, newState => void (newState.mode = payload));
  },
  [setAuthCode]: (state, {payload}) => {
    return produce(state, newState => void (newState.authCode = payload));
  },
  [setProxyUrl]: (state, {payload}) => {
    return produce(state, newState => void (newState.proxyUrl = payload));
  },
  [setFixedResponse]: (state, {payload}) => {
    return produce(state, newState => void Object.assign(newState.fixedResponse, payload));
  },
  [addDevice]: (state, {payload}) => {
    return produce(state, newState => {
      const device = payload;
      newState.devices = newState.devices.filter(d => d.userId !== device.userId);
      newState.devices.unshift(device);
    });
  },
  [clearDevices]: (state) => {
    return produce(state, newState => {
      newState.devices = [];
    });
  },
  [addUserMessage]: (state, {payload}) => {
    return produce(state, newState => {
      const { id, requestBody } = payload;
      newState.chatMessages = newState.chatMessages
        .concat([{ id, requestBody }])
        .slice(-MAX_MESSAGES_IN_LOG);
    });
  },
  [addAliceMessage]: (state, {payload}) => {
    return produce(state, newState => {
      const { id, responseBody, error } = payload;
      const message = newState.chatMessages.find(msg => msg.id === id);
      if (message) {
        Object.assign(message, { responseBody, error });
      }
    });
  }
}, initialState);


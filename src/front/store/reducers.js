import { handleActions } from 'redux-actions';
import produce from 'immer';
import defaultState from './default-state';
import {
  setConnectionState,
  setMode,
  setProxyUrl,
  setFixedResponse,
  addUserMessage,
  addAliceMessage,
} from './actions';

const MAX_MESSAGES_IN_LOG = 10;

export const rootReducer = handleActions({
  [setConnectionState]: (state, {payload}) => {
    return produce(state, newState => void (newState.connectionState = payload));
  },
  [setMode]: (state, {payload}) => {
    return produce(state, newState => void (newState.mode = payload));
  },
  [setProxyUrl]: (state, {payload}) => {
    return produce(state, newState => void (newState.proxyUrl = payload));
  },
  [setFixedResponse]: (state, {payload}) => {
    return produce(state, newState => void Object.assign(newState.fixedResponse, payload));
  },
  [addUserMessage]: (state, {payload}) => {
    return produce(state, newState => newState.userMessages.concat([payload]).slice(-MAX_MESSAGES_IN_LOG));
  },
  [addAliceMessage]: (state, {payload}) => {
    return produce(state, newState => newState.aliceMessages.concat([payload]).slice(-MAX_MESSAGES_IN_LOG));
  },
}, defaultState);


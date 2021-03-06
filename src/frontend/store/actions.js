import { createAction } from 'redux-actions';

export const setConnectionState = createAction('setConnectionState');
export const setMode = createAction('setMode');
export const setFixedResponse = createAction('setFixedResponse');
export const mergeFixedResponse = createAction('mergeFixedResponse');
export const setFixedResponseModeJson = createAction('setFixedResponseModeJson');
export const setProxyUrl = createAction('setProxyUrl');
export const setAuthCode = createAction('setAuthCode');
export const addUserMessage = createAction('addUserMessage');
export const addAliceMessage = createAction('addAliceMessage');
export const addDevice = createAction('addDevice');
export const clearDevices = createAction('clearDevices');
export const setValidateResponse = createAction('setValidateResponse');

import Channel from 'chnl';

export const onModeChanged = new Channel();
export const onFixedAnswerChanged = new Channel();
export const onProxyUrlChanged = new Channel();

export const onConnectionStateChanged = new Channel();
export const onConnectionRequest = new Channel();

export const onAliceRequest = new Channel();
export const onAliceResponse = new Channel();

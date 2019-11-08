/**
 * Just signals that does not touch the store.
 * todo: make it as redux middleware?
 */
import Channel from 'chnl';

export const TestButtonClicked = new Channel();
export const ConnectButtonClicked = new Channel();
export const ShowJSONPopup = new Channel();

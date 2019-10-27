/**
 * Global store for app.
 */
import defaultState from './default';
export * from './const';
export * from './channels';

const state = defaultState;

export const useGlobalState = selector => {

};

export const initState = () => {
  // const savedState = loadState();
  // Object.assign(state, savedState);
};

// function loadState() {
//   const storageData = localStorage.getItem(STORAGE_DEVICES_KEY);
//   return storageData && JSON.parse(storageData) || {};
// }
//
// function saveState() {
//   const storageData = localStorage.getItem(STORAGE_DEVICES_KEY);
//   return storageData && JSON.parse(storageData) || {};
// }

const savedState = {};

const initialState = {
  ...defaultState,
  ...savedState,
};

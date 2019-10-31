/**
 * Persistent state in local storage
 */

import throttle from 'lodash.throttle';
import config from '../config';

const logger = Logger.create('persistent-state');

const STORAGE_KEY = 'state';

// keys to save
const KEYS_TO_SAVE = {
  mode: true,
  proxyUrl: true,
  fixedResponse: true,
  devices: true,
};

export default {
  load,
  handleUpdates,
};

function load() {
  const storageData = localStorage.getItem(STORAGE_KEY);
  logger.debug(`Loaded state`, storageData);
  return storageData && JSON.parse(storageData) || {};
}

function save(store) {
  const state = store.getState();
  const stateToSave = Object.keys(state).reduce((res, key) => {
    if (KEYS_TO_SAVE[key]) {
      res[key] = state[key];
    }
    return res;
  }, {});
  const storageData = JSON.stringify(stateToSave);
  logger.debug(`Saving state`, storageData);
  localStorage.setItem(STORAGE_KEY, storageData);
}

function handleUpdates(store) {
  const delayedSave = throttle(() => save(store), config.saveStateDelay, {leading: false});
  store.subscribe(delayedSave);
}

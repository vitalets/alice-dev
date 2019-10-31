/**
 * Config
 */
const logger = Logger.create('app:config');

/* global WS_URL */

const defaults = {
  wsUrl: WS_URL || 'wss://vitalets.xyz/alice-dev',
  saveStateDelay: 3000,
};

const config = {
  ...defaults,
  ...readFromUrl(),
};

Logger.setLogLevel('debug');
logger.debug('Using config', config);

export default config;

function readFromUrl() {
  const urlObj = new URL(location.href);
  const result = {};
  urlObj.searchParams.forEach((value, key) => {
    if (defaults.hasOwnProperty(key) && value) {
      result[key] = value;
    }
  });
  return result;
}

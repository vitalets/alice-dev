/**
 * Config
 */
const logger = Logger.create('app:config');

const defaults = {
  wsUrl: 'wss://vitalets.xyz/alice-dev',
  saveStateDelay: 5000,
  debug: false,
};

const config = {
  ...defaults,
  ...readFromUrl(),
};

if (config.debug) {
  Logger.setLogLevel('debug');
}

logger.log('Using config', config);

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

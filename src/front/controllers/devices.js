/**
 * Devices manager.
 */
import Logger from 'loggee';

const logger = Logger.create('devices');
const STORAGE_DEVICES_KEY = 'devices';

export default class Devices {
  constructor() {
    this._loadFromStorage();
    logger.log(`Devices loaded: ${JSON.stringify(this._devices, null, 2)}`);
  }

  getAll() {
    return this._devices;
  }

  add({userId, deviceName}) {
    const exists = this._devices.some(device => device.userId === userId);
    if (!exists) {
      this._devices.push({userId, deviceName});
      this._saveToStorage();
      logger.log(`Device added: ${deviceName}`);
    }
  }

  _loadFromStorage() {
    const storageData = localStorage.getItem(STORAGE_DEVICES_KEY);
    this._devices = storageData && JSON.parse(storageData) || [];
  }

  _saveToStorage() {
    const storageData = JSON.stringify(this._devices);
    localStorage.setItem(STORAGE_DEVICES_KEY, storageData);
  }
}

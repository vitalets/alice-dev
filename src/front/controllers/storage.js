/**
 * Local storage wrapper
 */

const KEY = 'auth';

export function saveAuth({userId, deviceName}) {
  localStorage.setItem(KEY, JSON.stringify({userId, deviceName}));
}

export function loadAuth() {
  const strData = localStorage.getItem(KEY);
  return strData && JSON.parse(strData) || {};
}

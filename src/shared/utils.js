/**
 * Utils
 */

/**
 * Builds url with params.
 *
 * @param {string} url
 * @param {object} query
 * @returns {string}
 */
exports.buildUrl = (url, query = {}) => {
  const urlObj = new URL(url);
  Object.keys(query).forEach(key => urlObj.searchParams.set(key, query[key]));
  return urlObj.toString();
};

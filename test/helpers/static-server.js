const {promisify} = require('util');
const micro = require('micro');
const handler = require('serve-handler');

const options = {
  public: '.'
};

const server = micro(async (req, res) => {
  await handler(req, res, options);
});

server.setOptions = opts => {
  Object.assign(options, opts);
  return server;
};
server.listen = promisify(server.listen);
server.close = promisify(server.close);

module.exports = server;

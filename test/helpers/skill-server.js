const {promisify} = require('util');
const micro = require('micro');

const server = micro(async req => {
  const {request, session, version} = await micro.json(req);
  const response = `Reply to: ${request.command}`;
  return {version, session, response};
});

server.listen = promisify(server.listen);
server.close = promisify(server.close);

module.exports = server;

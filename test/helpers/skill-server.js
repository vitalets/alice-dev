const {promisify} = require('util');
const micro = require('micro');

const defaultHandler = req => {
  const { request, session } = req.body;
  const responseText = session.new
    ? `Добро пожаловать`
    : `Навык получил команду: ${request.command}`;
  const response = {
    text: responseText,
    tts: responseText,
    end_session: false,
  };
  return { response, version: '1.0' };
};

let handler = defaultHandler;

const server = micro(async (req, res) => {
  if (req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    req.body = await micro.json(req);
    return handler(req, res);
  } else {
    return 'Running';
  }
});

server.listen = promisify(server.listen);
server.close = promisify(server.close);
server.getUrl = () => `http://localhost:${server.address().port}`;
server.setHandler = newHandler => handler = newHandler;
server.resetHandler = () => handler = defaultHandler;

if (!module.parent) {
  server.listen(process.env.PORT || 3000);
} else {
  module.exports = server;
}

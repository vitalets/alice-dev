const {promisify} = require('util');
const micro = require('micro');

const defaultHandler = (req, res) => {
  const {request, session, version} = req.body;
  const responseText = session.new
    ? `Добро пожаловать`
    : `Навык получил команду: ${request.command}`;
  const response = {
    text: responseText,
    tts: responseText,
    end_session: false,
  };
  res.setHeader('Access-Control-Allow-Origin', '*');
  return {response, session, version};
};

let handler = defaultHandler;

const server = micro(async (req, res) => {
  if (req.method === 'POST') {
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

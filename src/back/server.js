/**
 * HTTP server singleton.
 */
const {promisify} = require('util');
const micro = require('micro');
const WebSocket = require('ws');
const logger = require('loggee').create('server');

module.exports = class Server {
  constructor() {
    this._createHttpServer();
    this._createWsServer();
  }

  get port() {
    return this.http && this.http.address().port;
  }

  async start({port}) {
    await this.http.listen(port);
  }

  async stop() {
    if (this.http) {
      await this.http.close();
    }
  }

  _createHttpServer() {
    const server = micro(async () => 'Running');
    server.listen = promisify(server.listen);
    server.close = promisify(server.close);
    server.on('listening', () => logger.log(`HTTP server started on port: ${this.port}`));
    server.on('close', () => logger.log(`HTTP server closed.`));
    this.http = server;
  }

  _createWsServer() {
    this.ws = new WebSocket.Server({
      server: this.http,
      clientTracking: true,
    });
  }
};


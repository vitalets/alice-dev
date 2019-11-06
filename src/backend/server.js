/**
 * HTTP server singleton.
 */
const {promisify} = require('util');
const micro = require('micro');
const WebSocketServer = require('websocket').server;
const logger = require('loggee').create('server');
const WSClients = require('./ws-clients');
const WebhookHandler = require('./webhook');

module.exports = class Server {
  constructor() {
    this._createHttpServer();
    this._createWsServer();
    this._wsClients = new WSClients();
  }

  get port() {
    return this._http && this._http.address().port;
  }

  get wsClients() {
    return this._wsClients;
  }

  async start({port}) {
    await this._http.listen(port);
  }

  async close() {
    if (this._ws) {
      await this._ws.shutDown();
    }
    if (this._http) {
      await this._http.close();
    }
  }

  _createHttpServer() {
    const server = micro((...args) => this._handleRequest(...args));
    server.listen = promisify(server.listen);
    server.close = promisify(server.close);
    server.on('listening', () => logger.log(`HTTP server started on port: ${this.port}`));
    server.on('close', () => logger.log(`HTTP server closed.`));
    this._http = server;
  }

  _createWsServer() {
    this._ws = new WebSocketServer({
      httpServer: this._http,
    });
    this._ws.on('request', request => this._handleWSConnection(request));
  }

  _handleWSConnection(request) {
    const connection = request.accept(null, request.origin);
    this._wsClients.register(connection);
  }

  async _handleRequest(req) {
    if (req.method === 'POST') {
      return new WebhookHandler(this._wsClients, req).handle();
    }
    return 'Running';
  }
};

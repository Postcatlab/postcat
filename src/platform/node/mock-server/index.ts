import { BrowserView, ipcMain } from 'electron';
import Store from 'electron-store';
import express from 'express';
import type { Response } from 'express';
import portfinder from 'portfinder';

// import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Server } from 'http';
import type { AddressInfo } from 'net';

const store = new Store();

const protocolReg = new RegExp('^/(http|https)://');
// Solve object circular reference problem
const jsonStringify = obj => {
  let cache = [];
  const str = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        // remove
        return;
      }
      // Collect all the values
      cache.push(value);
    }
    return value;
  });
  cache = null; // Empty variables for easy recycling by garbage collection mechanisms
  return str;
};

export class MockServer {
  private app: ReturnType<typeof express>;
  private server: Server;
  private view: BrowserView;
  // private apiProxy: ReturnType<typeof createProxyMiddleware>;
  /** mock server url */
  private mockUrl = '';

  constructor() {
    this.app ??= express();
    this.createProxyServer();
  }

  /**
   * create proxy server
   */
  private createProxyServer() {
    // this.apiProxy = createProxyMiddleware({
    //   target: 'http://www.example.org',
    //   changeOrigin: true,
    //   pathFilter: (path) => {
    //     // console.log('pathFilter path', path, path.match('^/(http|https)://'));
    //     return Boolean(path.match('^/(http|https)://'));
    //   },
    //   pathRewrite: (path, req) => {
    //     // console.log('pathRewrite', path, req.url);
    //     return path.replace(req.url, '');
    //   },
    //   router: (req) => {
    //     console.log('router req', req.url);
    //     return req.url.slice(1);
    //   },
    // });

    // this.app.use(this.apiProxy);

    this.app.all(`/mock-(\d+)/*`, (req, res, next) => {
      this.view.webContents.send('getMockApiList', JSON.parse(jsonStringify(req)));
      ipcMain.once('getMockApiList', (event, message) => {
        const { response = {}, statusCode = 200 } = message?.__zone_symbol__value || message;
        res.statusCode = statusCode;
        if (res.statusCode === 404) {
          this.send404(res);
        } else {
          res.send(response);
        }
      });
    });

    this.app.all('*', (req, res, next) => {
      // if (!protocolReg.test(req.url)) {
      // match request type
      this.view.webContents.send('getMockApiList', JSON.parse(jsonStringify(req)));
      ipcMain.once('getMockApiList', (event, message) => {
        const { response = {}, statusCode = 200 } = message?.__zone_symbol__value || message;
        res.statusCode = statusCode;
        if (res.statusCode === 404) {
          this.send404(res, response);
        } else {
          res.send(response);
        }
        next();
      });
    });
  }

  /**
   * start mock server
   *
   * @param port mock server port
   */
  async start(view: BrowserView, port = store.get('mock_port') || 3040) {
    this.view = view;
    portfinder.basePort = Number(port);
    // Use portfinder for port detection. If the port is found to be occupied, the port will be incremented by 1.
    const _port = await portfinder.getPortPromise();

    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(_port, () => {
          const { port } = this.server.address() as AddressInfo;
          this.mockUrl = `http://127.0.0.1:${port}`;
          store.set('mock_port', port);
          console.log(`mock service is started: ${this.mockUrl}`);
          resolve(this.mockUrl);
        })
        .on('error', error => {
          console.error(`mock is failed to start: ${error}`);
          reject(error);
        });
    });
  }

  /**
   * stop mock server
   */
  stop() {
    process.exit(1);
  }

  /**
   * get mock server url
   *
   * @returns mock server url
   */
  getMockUrl() {
    return this.mockUrl;
  }

  /**
   * response 404
   */
  send404(res: Response, response: any = {}) {
    res.statusCode = 404;
    res.send({
      code: 404,
      message: response.message || '没有该API或缺少mockID',
      tips: '未匹配到文档中的API，请检查请求方式、请求URL或mockID是否正确。'
      // tips: isMatchType
      //   ? '未匹配到文档中的API，请检查请求方式和请求URL是否正确'
      //   : '当前未开启匹配请求方式, 开启后，系统会匹配和 API 文档请求方式（GET、POST...）一致的 Mock',
    });
  }
}

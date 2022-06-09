import express from 'express';
import portfinder from 'portfinder';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BrowserView, ipcMain } from 'electron';
import type { Server } from 'http';
import type { AddressInfo } from 'net';

const reg = new RegExp('^/(http|https)://');

const jsonStringify = (obj) => {
  var cache = [];
  var str = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return;
      }
      // 收集所有的值
      cache.push(value);
    }
    return value;
  });
  cache = null; // 清空变量，便于垃圾回收机制回收
  return str;
};
export class MockServer {
  private app: ReturnType<typeof express>;
  private server: Server;
  view: BrowserView;
  private apiProxy: ReturnType<typeof createProxyMiddleware>;
  /** mock服务地址 */
  private mockUrl = '';

  constructor() {
    this.app = express();
    this.createProxyServer();
  }

  /**
   * 创建代理服务器
   */
  private createProxyServer() {
    this.apiProxy = createProxyMiddleware({
      target: 'http://www.example.org',
      changeOrigin: true,
      // @ts-ignore
      pathFilter: (path, req) => {
        // console.log('pathFilter path', path, path.match('^/(http|https)://'));
        return path.match('^/(http|https)://');
      },
      pathRewrite: (path, req) => {
        // console.log('pathRewrite', path, req.url);
        return path.replace(req.url, '');
      },
      router: (req) => {
        console.log('router req', req.url);
        return req.url.slice(1);
      },
    });

    this.app.all('*', (req, res, next) => {
      if (!reg.test(req.url)) {
        if (req.query.mockID) {
          this.view.webContents.send('getMockApiList', jsonStringify(req));
          ipcMain.once('getMockApiList', function (event, message) {
            console.log('getMockApiList message', message);
          });
        } else {
          res.json('缺少mockID');
        }
      }
      next();
    });

    this.app.use(this.apiProxy);
  }

  /**
   * 启动mock服务
   * @param port mock服务端口号
   */
  async start(view: BrowserView, port = 3040) {
    this.view = view;
    portfinder.basePort = port;
    // 使用 portfinder 做端口检测，若发现端口被占用则端口自增1
    const _port = await portfinder.getPortPromise();

    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(_port, () => {
          const { address, port } = this.server.address() as AddressInfo;
          this.mockUrl = `http://${address}:${port}`;
          console.log(`mock服务已启动：${this.mockUrl}`);
          resolve(this.mockUrl);
        })
        .on('error', (error) => {
          console.error('mock服务启动失败: ' + error);
          reject(error);
        });
    });
  }

  /**
   * 终止mock服务
   */
  stop() {
    process.exit(1);
  }

  /**
   * 获取mock服务地址
   * @returns mock服务地址
   */
  getMockUrl() {
    return this.mockUrl;
  }
}

import express from 'express';
import type { Response } from 'express';
import portfinder from 'portfinder';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { BrowserView, ipcMain } from 'electron';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import { Configuration } from 'eo/platform/node/configuration/lib';

const protocolReg = new RegExp('^/(http|https)://');
// 解决对象循环引用问题
const jsonStringify = (obj) => {
  let cache = [];
  const str = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
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
  private configuration = new Configuration();
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
      pathFilter: (path) => {
        // console.log('pathFilter path', path, path.match('^/(http|https)://'));
        return Boolean(path.match('^/(http|https)://'));
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

    this.app.use(this.apiProxy);

    this.app.all('*', (req, res, next) => {
      if (!protocolReg.test(req.url)) {
        // 匹配请求方式
        const isMatchType = this.configuration.getModuleSettings<boolean>('eoapi-features.mock.matchType');
        if (req.query.mockID || isMatchType) {
          this.view.webContents.send('getMockApiList', JSON.parse(jsonStringify(req)));
          ipcMain.once('getMockApiList', (event, message) => {
            console.log('getMockApiList message', message);
            const { response = {}, statusCode = 200 } = message;
            res.statusCode = statusCode;
            if (res.statusCode === 404) {
              this.send404(res, isMatchType);
            } else {
              res.send(response);
            }
            next();
          });
        } else {
          this.send404(res, isMatchType);
          next();
        }
      } else {
        next();
      }
    });
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
          const { port } = this.server.address() as AddressInfo;
          this.mockUrl = `http://127.0.0.1:${port}`;
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

  /**
   * 响应404
   */
  send404(res: Response, isMatchType = false) {
    res.statusCode = 404;
    res.send({
      code: 404,
      message: '没有该API或缺少mockID',
      tips: isMatchType
        ? '未匹配到文档中的API，请检查请求方式和请求URL是否正确'
        : '当前未开启匹配请求方式, 开启后，系统会匹配和 API 文档请求方式（GET、POST...）一致的 Mock',
    });
  }
}

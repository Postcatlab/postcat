import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import portfinder from 'portfinder';
import mockjs from 'mockjs';

export class MockServer {
  private app: Koa;
  private router: Router;
  /** mock服务地址 */
  private mockUrl = '';

  constructor(prefix = '') {
    this.app = new Koa();
    this.router = new Router({ prefix });

    // 使用ctx.body解析中间件
    this.app.use(bodyParser());
    // 加载路由中间件
    this.app.use(this.router.routes()).use(this.router.allowedMethods());
    // 允许跨域请求
    this.app.use(cors());
    this.initRoutes();
  }

  /**
   * 启动mock服务
   * @param port mock服务端口号
   */
  async start(port = 3040) {
    portfinder.basePort = port;
    // 使用 portfinder 做端口检测，若发现端口被占用则端口自增1
    const _port = await portfinder.getPortPromise();

    return new Promise((resolve, reject) => {
      this.app
        .listen(_port, () => {
          this.mockUrl = `http://localhost:${_port}`;
          console.log(`mock服务已启动: ${this.mockUrl}`);
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
   * 注册路由
   * @param method 请求方法
   * @param path 请求路径
   * @param data 响应的数据
   */
  registerRoute(method: string, path: string, data = {}) {
    this.router[method.toLocaleLowerCase()](path, async (ctx, next) => {
      ctx.body = mockjs.mock(data);
      await next();
    });
  }

  /**
   * 注销路由
   * @param methods 请求方法
   * @param path 请求路径
   */
  unRegisterRoute(methods: string[], path: string) {
    const _methods = methods.map((n) => n.toLocaleUpperCase());
    // 将匹配到的路由注销掉
    this.router.stack = this.router.stack.filter((item) => {
      const isMatch = item.methods.some((n) => _methods.includes(n)) && item.path === path;
      return !isMatch;
    });
  }

  /**
   * 初始化默认路由
   */
  initRoutes() {
    this.router.get('/', async (ctx, next) => {
      const mockPeople = mockjs.mock({
        'peoples|10': [
          {
            'id|+1': 1,
            guid: '@guid',
            name: '@cname',
            age: '@integer(20, 50)',
            birthday: '@date("MM-dd")',
            address: '@county(true)',
            email: '@email',
          },
        ],
      });
      ctx.body = mockPeople;
      await next();
    });

    this.router.get('/test', async (ctx, next) => {
      ctx.body = this.router;
    });
  }
}

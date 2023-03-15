import Koa from 'koa';
import json from 'koa-json';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import vm from 'vm';
import fetch from 'node-fetch';

import config from './config.json' assert { type: 'json' };
import { loadExtension } from './extension-manage.js';
const { appKey, appId, url } = config;

globalThis.fetch = fetch;
globalThis.pc = {};

// * 插件调用这个方法，将会向数据库发起更新数据的请求
const updateAPIData = data =>
  new Promise(resolve => {
    fetch(url + '/api/api/sync/batch-update', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        appId,
        appKey,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        collections: data,
        workSpaceUuid,
        projectUuid
      })
    })
      .then(async res => {
        const result = await res.json();
        return resolve([result, null]);
      })
      .catch(err => resolve([null, err]));
  });

//* 获取当前项目配置,当前贡献点相关的项目配置
const getProjectSettings = () => new Promise(resolve => resolve(target));

const app = new Koa();
const router = new Router();

const responseBody = (code, msg) => ({ code, msg });

// CORS middleware
app.use(cors());
// JSON prettier middleware
app.use(json());
// Bodyparser middleware
app.use(bodyParser());

// app.use(async ctx => ctx.body = {msg: 'hello'})

router.get('/load/:name', async ctx => {
  // * 用于测试
  const { name, version = 'latest' } = ctx.params;
  const [{ extension, packageJson }, err] = await loadExtension({
    name,
    version
  });
  if (err) {
    ctx.body = { ...responseBody(-1, err) };
    return;
  }
  const { action } = packageJson.default.features.pullAPI;
  const func = extension[action];
  console.log('extension', extension, action);
  const result = await func({});
  console.log('result', result);
  ctx.body = {
    ...responseBody(0, 'Success'),
    data: action,
    func: extension[action].toString()
  };
});

router.get('/api/system/status', ctx => {
  console.log('system/status');
  ctx.body = {
    ...responseBody(0, 'Success')
  };
});

router.post('/api/sync', async ctx => {
  const { pluginName, pluginVersion, workSpaceUuid, projectUuid, userId, target } = ctx.request.body;
  // * 根据后端传来的插件信息，安装并加载插件
  const [{ extension, packageJson }, err] = await loadExtension({
    name: pluginName,
    version: pluginVersion
  });
  if (err) {
    ctx.body = { ...responseBody(-1, err) };
    return;
  }

  // * 根据插件的package.json配置信息，读取对应的函数名，继而调用函数并传参
  const { action } = packageJson.default.features.pullAPI;
  const func = extension[action];

  const space = new vm.Script(`
    pc.getProjectSettings = ${getProjectSettings.toString()}
    pc.updateAPIData = ${updateAPIData.toString()}
    func()
  `);
  // * 声明两个上下文函数，供插件内部自行调用
  const contextifiedSandbox = vm.createContext({
    workSpaceUuid,
    projectUuid,
    userId,
    target,
    appId,
    appKey,
    pc: globalThis.pc,
    fetch,
    url, // * ServerUrl
    func
  });
  const [data] = await space.runInContext(contextifiedSandbox);
  ctx.body = { ...responseBody(0, 'Success'), data };
});

// Router middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(5001, () => console.log('Server started...'));

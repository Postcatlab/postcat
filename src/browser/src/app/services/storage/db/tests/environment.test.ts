import { db } from 'pc/browser/src/app/services/storage/db';

const table = db.environment;

const params = { workSpaceUuid: crypto.randomUUID(), projectUuid: crypto.randomUUID() };

const entity = {
  type: 1,
  name: '测试分组一',
  parentId: 0,
  sort: 1,
  ...params
};

// 添加环境
const { data: environment } = await table.create(entity);
if (Object.entries(entity).every(([key, value]) => Object.is(environment[key], value))) {
  pcConsole.success('[添加环境]: 测试通过');
} else {
  pcConsole.error('[添加环境]: 测试不通过');
}

// 单个环境详情获取
const { data: environmentInfo } = await table.read({ ...params, id: environment.id });
if (Object.keys(environmentInfo).length) {
  pcConsole.success('[单个环境详情获取]: 测试通过');
} else {
  pcConsole.error('[单个环境详情获取]: 测试不通过');
}

// 环境列表获取
const { data: groups } = await table.bulkRead(params);
if (groups.length === 1) {
  pcConsole.success('[环境列表获取]: 测试通过');
} else {
  pcConsole.error('[环境列表获取]: 测试不通过');
}

// 更新环境
const name = `${environmentInfo.id}-测试更新环境`;
const { data: newEnv } = await table.update({ ...environmentInfo, name });
if (newEnv.name === name) {
  pcConsole.success('[更新环境]: 测试通过');
} else {
  pcConsole.error('[更新环境]: 测试不通过');
}

// 删除环境
const { data: delGroupCount } = await table.delete(newEnv);
if (delGroupCount === 1) {
  pcConsole.success('[删除环境]: 测试通过');
} else {
  pcConsole.error('[删除环境]: 测试不通过');
}

import { db } from 'pc/browser/src/app/services/storage/db';

const table = db.group;

const params = { workSpaceUuid: crypto.randomUUID(), projectUuid: crypto.randomUUID() };

const entity = {
  type: 1,
  name: '测试分组一',
  parentId: 0,
  sort: 1,
  ...params
};

// 添加分组
const { data: group } = await table.create(entity);
if (Object.entries(entity).every(([key, value]) => Object.is(group[key], value))) {
  pcConsole.success('[添加分组]: 测试通过');
} else {
  pcConsole.error('[添加分组]: 测试不通过');
}

// 获取分组详情
const { data: groupInfo } = await table.read({ ...params, id: group.id });
if (groupInfo.uuid === group.uuid) {
  pcConsole.success('[获取分组详情]: 测试通过');
} else {
  pcConsole.error('[获取分组详情]: 测试不通过');
}

// 获取分组列表
const { data: groups } = await table.bulkRead(params);
if (groups.length === 1) {
  pcConsole.success('[获取分组列表]: 测试通过');
} else {
  pcConsole.error('[获取分组列表]: 测试不通过');
}

// 更新分组
const name = `${group.id}-测试更新分组`;
const { data: newGroup } = await table.update({ ...group, name });
if (newGroup.name === name) {
  pcConsole.success('[更新分组]: 测试通过');
} else {
  pcConsole.error('[更新分组]: 测试不通过');
}

// 删除分组
const { data: delGroupCount } = await table.delete(newGroup);
if (delGroupCount === 1) {
  pcConsole.success('[删除分组]: 测试通过');
} else {
  pcConsole.error('[删除分组]: 测试不通过');
}

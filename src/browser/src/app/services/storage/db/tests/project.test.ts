import { db } from 'pc/browser/src/app/services/storage/db';

const table = db.project;

const workSpaceUuid = crypto.randomUUID();

// 批量创建项目
const { data: projects } = await table.bulkCreate({
  projectMsgs: [
    {
      name: '测试项目一',
      description: '测试项目一的描述'
    },
    {
      name: '测试项目二',
      description: '测试项目二的描述'
    }
  ],
  workSpaceUuid
});
if (projects.length === 2) {
  pcConsole.success('[批量创建项目]: 测试通过');
} else {
  pcConsole.error('[批量创建项目]: 测试不通过');
}
console.log('projects', projects);

// 分页获取项目列表
const { data: projectPage } = await table.page({ projectUuids: projects.map(({ uuid }) => uuid), workSpaceUuid });
if (projectPage.items.length === projects.length) {
  pcConsole.success('[分页获取项目列表]: 测试通过', projectPage);
} else {
  pcConsole.error('[分页获取项目列表]: 测试不通过', projectPage);
}

// 修改项目信息
const name = `${projects.at(0).uuid}-修改项目信息`;
const { data: projectUpdateRes } = await table.update({ projectUuid: projects.at(0).uuid, name });
if (projectUpdateRes.name === name) {
  pcConsole.success('[修改项目信息]: 测试通过');
} else {
  pcConsole.error('[修改项目信息]: 测试不通过');
}

// 批量删除项目
const { data: delKeys } = await table.bulkDelete({ projectUuids: projects.map(n => n.uuid) });
if (delKeys === 2) {
  pcConsole.success('[批量删除项目]: 测试通过');
} else {
  pcConsole.error('[批量删除项目]: 测试不通过');
}

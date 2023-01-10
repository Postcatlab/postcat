import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';

setTimeout(async () => {
  await testApiGroupTree();
  const d = await db.project.collections('91ca042f-e12f-4416-9d93-ce5d2637e578');
  console.log('dddd', d);
});

const testApiGroupTree = async () => {
  const a = await db.group.bulkUpdate([
    {
      id: 1,
      type: 1,
      name: '测试分组一',
      parentId: 0,
      sort: 1,
      projectUuid: '91ca042f-e12f-4416-9d93-ce5d2637e578',
      workSpaceUuid: 'd8bc0426-5d17-4067-be34-855dd4d6036a'
    },
    {
      id: 2,
      type: 1,
      name: '测试分组二',
      parentId: 1,
      sort: 1,
      projectUuid: '91ca042f-e12f-4416-9d93-ce5d2637e578',
      workSpaceUuid: 'd8bc0426-5d17-4067-be34-855dd4d6036a'
    }
  ]);
  await db.apiData.bulkUpdate([
    {
      id: 1,
      groupId: 1,
      orderNum: 2,
      projectUuid: '91ca042f-e12f-4416-9d93-ce5d2637e578',
      workSpaceUuid: 'd8bc0426-5d17-4067-be34-855dd4d6036a'
    },
    {
      id: 2,
      groupId: 1,
      orderNum: 1,
      projectUuid: '91ca042f-e12f-4416-9d93-ce5d2637e578',
      workSpaceUuid: 'd8bc0426-5d17-4067-be34-855dd4d6036a'
    },
    {
      id: 3,
      groupId: 2,
      orderNum: 3,
      projectUuid: '91ca042f-e12f-4416-9d93-ce5d2637e578',
      workSpaceUuid: 'd8bc0426-5d17-4067-be34-855dd4d6036a'
    }
  ]);
};

import { db } from 'pc/browser/src/app/services/storage/db';
import { genSimpleApiData } from 'pc/browser/src/app/services/storage/db/initData/apiData';

const table = db.apiData;

const params = { workSpaceUuid: crypto.randomUUID(), projectUuid: crypto.randomUUID() };

const sampleApiData = genSimpleApiData(params);

// 添加api
// @ts-ignore
const { data: apiDataAddRes } = await table.bulkCreate(sampleApiData);
if (apiDataAddRes.length === sampleApiData.apiList.length) {
  pcConsole.success('[添加api]: 测试通过');
} else {
  pcConsole.error('[添加api]: 测试不通过');
}

// 获取api列表
const buldReadParams = { ...params, apiUuids: apiDataAddRes.map(n => n.uuid) };
const { data: apiDataList } = await table.bulkRead(buldReadParams);
if (apiDataList.length === sampleApiData.apiList.length) {
  pcConsole.success('[获取api列表]: 测试通过');
} else {
  pcConsole.error('[获取api列表]: 测试不通过');
}

// 更新api
const firstApi = apiDataAddRes.at(0);
const name = `${firstApi.uuid}-测试一下更新API`;
const { data: newApiData } = await table.update({ ...params, ...firstApi, api: { name, apiUuid: firstApi.uuid } });
if (newApiData.name === name) {
  pcConsole.success('[更新api]: 测试通过');
} else {
  pcConsole.error('[更新api]: 测试不通过');
}

// 删除api
const delArr = await Promise.all(apiDataAddRes.map(n => table.delete({ ...params, apiUuid: n.uuid })));
if (delArr.every(Boolean)) {
  pcConsole.success('[删除api]: 测试通过');
} else {
  pcConsole.error('[删除api]: 测试不通过');
}

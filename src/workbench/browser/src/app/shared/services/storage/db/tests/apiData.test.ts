import { db } from 'eo/workbench/browser/src/app/shared/services/storage/db';
import { genSimpleApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/initData/apiData';

const table = db.apiData;

const params = { workSpaceUuid: crypto.randomUUID(), projectUuid: crypto.randomUUID() };

const sampleApiData = genSimpleApiData(params);

// 添加api
const { data: apiDatas } = await table.bulkCreate(sampleApiData);
if (apiDatas.length === sampleApiData.apiList.length) {
  pcConsole.success('[添加api]: 测试通过');
} else {
  pcConsole.error('[添加api]: 测试不通过');
}

const name = `${apiDatas.at(0).uuid}-测试一下更新API`;
const { data: newApiData } = await table.update({ ...apiDatas.at(0), name });
if (newApiData.name === name) {
  pcConsole.success('[更新api]: 测试通过');
} else {
  pcConsole.error('[更新api]: 测试不通过');
}

// 删除api
const delArr = await Promise.all(apiDatas.map(n => table.delete({ ...params, apiUuid: n.uuid })));
if (delArr.every(Boolean)) {
  pcConsole.success('[删除api]: 测试通过');
} else {
  pcConsole.error('[删除api]: 测试不通过');
}

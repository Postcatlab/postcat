import type { ImportProjectDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';

import { convertApiData } from './../../../shared/services/storage/db/dataSource/convert';

export const old2new = (params, projectUuid, workSpaceUuid): ImportProjectDto => {
  const { collections = [], environments } = params;

  const environmentList = environments.map(n => ({
    name: n.name,
    hostUri: n.hostUri,
    parameters: n.parameters,
    projectUuid,
    workSpaceUuid
  }));

  const genId = () => crypto.getRandomValues(new Uint32Array(1))[0];

  const genGroup = (name, parentId?) => {
    return {
      name,
      parentId,
      id: genId(),
      type: 1,
      projectUuid,
      workSpaceUuid,
      children: []
    };
  };

  const rootGroup = genGroup(collections[0].name);

  const apiList = [];
  const groupList = [rootGroup];

  const formatData = (collections = [], parentGroup) => {
    collections.forEach(item => {
      // API
      if (item.uri) {
        const newApiData = convertApiData(item);
        newApiData.groupId = parentGroup.id;
        apiList.push(newApiData);
      }
      // 分组
      else {
        const group = genGroup(item.name, parentGroup.id);

        parentGroup.children.push(group);

        if (item.children?.length) {
          formatData(item.children, group);
        }
      }
    });
  };

  collections[0].id = genId();
  formatData(collections[0]?.children, groupList[0]);

  return {
    name: 'Default',
    environmentList: [],
    collections: []
  };
};

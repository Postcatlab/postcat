import { CollectionTypeEnum, ImportProjectDto } from 'eo/workbench/browser/src/app/shared/services/storage/db/dto/project.dto';

import { convertApiData } from '../../../shared/services/storage/db/dataSource/convert';

export const old2new = (params, projectUuid, workSpaceUuid): ImportProjectDto => {
  const { collections = [], environments } = params;

  const environmentList = environments.map(n => ({
    name: n.name,
    hostUri: n.hostUri,
    parameters: n.parameters,
    projectUuid,
    workSpaceUuid
  }));
  const formatData = (collections = []) => {
    collections.forEach(item => {
      // API
      if (item.uri) {
        const newApiData = convertApiData(item);
        Object.assign(item, newApiData);
        item.collectionType = CollectionTypeEnum.API_DATA;
      }
      // 分组
      else {
        item.collectionType = CollectionTypeEnum.GROUP;

        if (item.children?.length) {
          formatData(item.children);
        }
      }
    });
  };

  formatData(collections);

  return {
    collections,
    environmentList
  };
};

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ApiBodyType } from 'eo/workbench/browser/src/app/modules/api-shared/api.model';
import { ProjectApiService } from 'eo/workbench/browser/src/app/pages/workspace/project/api/api.service';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { Group, ApiData } from 'eo/workbench/browser/src/app/shared/services/storage/db/models';
import { StorageRes, StorageResStatus } from 'eo/workbench/browser/src/app/shared/services/storage/index.model';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { reaction } from 'mobx';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private projectApi: ProjectApiService,
    private storage: StorageService,
    private indexedDBStorage: IndexedDBStorage,
    private store: StoreService,
    private api: ApiService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService
  ) {
    this.init();
  }

  async init() {
    await this.updateWorkspaces();
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';
    this.updateProjects(this.store.getCurrentWorkspaceUuid).then(() => {
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/overview']);
      }
      this.getProjectPermission();
      this.getWorkspacePermission();
    });
    reaction(
      () => this.store.isLogin,
      async () => {
        if (this.store.isLogin) {
          await this.updateWorkspaces();
        } else {
          if (this.store.isLocal) {
            this.store.setWorkspaceList([]);
          } else {
            this.changeWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
          }
        }
      }
    );
  }

  getGroups(projectID = 1): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.storage.run('groupLoadAllByProjectID', [projectID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        }
      });
    });
  }

  async deleteEnv(id) {
    const [data, err] = await this.api.api_environmentDelete({ id });
    if (data) {
      const envList = this.store.getEnvList.filter(it => it.id !== id);
      this.store.setEnvList(envList);
    }
  }
  async exportLocalProjectData(projectID = 1) {
    return new Promise(resolve => {
      this.indexedDBStorage.projectExport(projectID).subscribe((result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          resolve(false);
        }
      });
    });
  }

  async exportProjectData(projectID = 1) {
    const apiGroup = await this.getGroups(projectID);
    const result: StorageRes = await this.projectApi.getAll(projectID);
    const { success, empty } = StorageResStatus;
    if ([success, empty].includes(result.status)) {
      return {
        collections: this.exportCollects(apiGroup, result.data),
        environments: []
      };
    }
    return {
      collections: [],
      environments: []
    };
  }

  exportCollects(apiGroup: any[], apiData: any[], parentID = 0) {
    const apiGroupFilters = apiGroup.filter(child => child.parentID === parentID);
    const apiDataFilters = apiData.filter(child => child.groupID === parentID);
    return apiGroupFilters
      .map(item => ({
        name: item.name,
        children: this.exportCollects(apiGroup, apiData, item.uuid)
      }))
      .concat(apiDataFilters);
  }
  async getWorkspacePermission() {
    // TODO localworkspace no need to set permission
    {
      // * update workspace auth
      const [data, err]: any = await this.api.api_workspaceUnkown({});
      if (err) {
        return;
      }
      this.store.setPermission(data.permissions, 'workspace');
      this.store.setRole(data.role.name, 'workspace');
    }
  }
  async changeWorkspace(workspaceID: string) {
    // * real set workspace
    this.store.setCurrentWorkspaceUuid(workspaceID);
    // * real set workspace
    await this.updateProjects(workspaceID);
    await this.router.navigate(['**']);

    this.router.navigate(['/home/workspace/overview']);

    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';

    // * update workspace role
    this.getWorkspacePermission();
    this.getProjectPermission();
  }
  async getProjectPermission() {
    //TODO localworkspace no need to set permission
    // * update project auth
    // const [data, err]: any = await this.api.api_projectUserPermission({ projectID: this.store.getCurrentProjectID });
    // if (err) {
    //   return;
    // }
    // this.store.setPermission(data.permissions, 'project');
    // this.store.setRole(data.role.name, 'project');
  }
  async changeProject(pid) {
    if (!pid) {
      this.router.navigate(['/home/workspace/overview']);
      return;
    }
    this.store.setCurrentProjectID(pid);
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/project/api'], { queryParams: { pid: this.store.getCurrentProjectID } });
    // * update project role
    await this.getProjectPermission();
  }
  async updateWorkspaces() {
    const [list, wErr]: any = await this.api.api_workspaceList({});
    if (wErr) {
      // * Switch store to local workspace
      this.store.setWorkspaceList([]);
      this.updateProjects(this.store.getCurrentWorkspaceUuid);
      return;
    }
    this.store.setWorkspaceList(list);
  }
  async updateProjects(workSpaceUuid) {
    const [data] = await this.api.api_projectDetail({ projectUuids: [], workSpaceUuid });
    if (data) {
      this.store.setProjectList(data.items);
      return [data.items, null];
    } else {
      return [null, data];
    }
  }
  async createProject(data) {
    await this.api.api_projectCreate({
      projectMsgs: [data]
    });
  }
  async updateProject(data) {
    const [project] = await this.api.api_projectUpdate(data);
    if (project) {
      const projects = this.store.getProjectList;
      projects.some(val => {
        if (val.uuid === project.uuid) {
          Object.assign(val, project);
          return true;
        }
      });
      this.store.setProjectList(projects);
      this.store.setCurrentProjectID(project.uuid);
    }
  }

  async updateShareLink(): Promise<string> {
    // * update share link
    const [res, err]: any = await this.api.api_shareCreateShare({});
    if (err) {
      return 'Error ... ';
    }
    const host = (this.store.remoteUrl || window.location.host)
      .replace(/:\/{2,}/g, ':::')
      .replace(/\/{2,}/g, '/')
      .replace(/:{3}/g, '://')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    return `${host}/${lang ? `${lang}/` : ''}home/share/http/test?shareId=${res.uniqueID}`;
  }

  async updateEnvList() {
    if (this.store.isShare) {
      this.api
        .api_shareDocGetEnv({
          uniqueID: this.store.getShareID
        })
        .then(([data, err]) => {
          if (err) {
            return [];
          }
          this.store.setEnvList(data);
          return data || [];
        });
      return;
    }
    const [envList, err] = await this.api.api_environmentList({});
    this.store.setEnvList(envList || []);
    return envList;
  }

  // *** Data engine

  async deleteHistory() {
    const [, err] = await this.api.api_apiTestHistoryDelete({});
    this.store.setHistory([]);
  }
  // * delete api
  async deleteAPI(uuid) {
    // * delete API
    await this.api.api_apiDataDelete({
      apiUuids: [uuid]
    });
    this.getGroupList();
  }
  // * delete group and api
  async deleteGroup(group) {
    // * delete group
    await this.api.api_groupDelete(group);
    this.getGroupList();
    // * call deleteAPI()
  }
  async deleteMock(id) {
    // * delete mock
    const [, err] = await this.api.api_mockDelete({
      id: id
    });
    // * update API
  }

  createHistory() {
    // TODO add history
    this.store.setHistory([]);
  }

  createMock() {
    // * update API
  }

  async getHistory() {
    const [res, err] = await this.api.api_apiTestHistoryList({ page: 1, pageSize: 1 });
    if (err) {
      return;
    }
    this.store.setHistory(res.data?.items);
  }

  private genApiGroupTree(apiGroups: Group[], apiDatas: ApiData[], groupId: number) {
    const apiDataFilters = apiDatas.filter(apiData => {
      apiData['title'] = apiData.name;
      apiData['key'] = apiData['apiUuid'];
      apiData['isLeaf'] = true;
      return apiData.groupId === groupId;
    });
    const apiGroupFilters = apiGroups.filter(n => n.parentId === groupId);

    return [
      ...apiGroupFilters.map(group => ({
        ...group,
        title: group.name,
        key: group.id,
        children: this.genApiGroupTree(apiGroups, apiDatas, group.id)
      })),
      ...apiDataFilters
    ];
  }
  async getGroupList() {
    // * get group list data
    const [groupList = [], gErr] = await this.api.api_groupList({});
    if (gErr) {
      return;
    }
    console.log('Group 数据', groupList);
    // * get api list data
    const [apiList, aErr] = await this.api.api_apiDataList({});
    if (aErr) {
      return;
    }
    console.log('API 数据', apiList);
    const rootGroupIndex = groupList.findIndex(n => n.depth === 0);
    this.store.setRootGroup(groupList.splice(rootGroupIndex, 1).at(0));
    // * merge api & group
    const apiGroupTree = this.genApiGroupTree(groupList, apiList, this.store.getRootGroup.id);
    console.log('merge api & group', apiGroupTree);
    this.store.setApiGroupTree(apiGroupTree);
  }
  // ! maybe no need getAPI()
  async getAPI(apiUuids: string[]) {
    // * get API data
    const [res, err] = await this.api.api_apiDataDetail({
      apiUuids
    });
    if (err) {
      return;
    }
    //@ts-ignore
    return {
      groupId: 1,
      groupName: '',
      projectId: 1,
      lifecycle: 0,
      name: 'COVID-19 national epidemic',
      uri: 'https://view.inews.qq.com/g2/getOnsInfo',
      protocol: 0,
      status: 0,
      starred: 0,
      encoding: '',
      isShared: 0,
      tag: '',
      orderNum: 0,
      hashkey: '',
      managerId: 0,
      managerName: '',
      updateUserId: 0,
      updateUserName: '',
      createUserId: 0,
      createUserName: '',
      createTime: 1673852936608,
      updateTime: 1673852936608,
      introduction: { apiUuid: '', noteType: 0, noteRaw: '', note: '', createTime: '', updateTime: '' },
      relation: { apiUuid: '', bindAmtApiId: '', swaggerId: '', fileName: '', fileUrl: '', fileId: '' },
      apiAttrInfo: {
        beforeInject: '',
        afterInject: '',
        authInfo: '',
        requestMethod: 1,
        contentType: ApiBodyType.JSON,
        createTime: 1673852936608,
        updateTime: 1673852936608
      },
      requestParams: {
        headerParams: [],
        bodyParams: [
          {
            responseUuid: '',
            name: 'name',
            paramType: 0,
            partType: 0,
            dataType: 0,
            dataTypeValue: '',
            structureId: '',
            structureParamId: '',
            contentType: '',
            isRequired: 1,
            binaryRawData: '',
            description: '',
            orderNo: 0,
            createTime: '',
            updateTime: '',
            paramAttr: {
              minLength: 0,
              maxLength: 100,
              minValue: 0,
              maxValue: 1,
              paramLimit: '',
              paramValueList: '',
              paramMock: '',
              attr: '',
              structureIsHide: 0,
              example: 'disease_h5',
              createTime: '',
              updateTime: '',
              dbArr: '',
              paramNote: ''
            },
            childList: []
          }
        ],
        queryParams: [
          {
            responseUuid: '',
            name: 'name',
            paramType: 0,
            partType: 0,
            dataType: 0,
            dataTypeValue: '',
            structureId: '',
            structureParamId: '',
            contentType: '',
            isRequired: 1,
            binaryRawData: '',
            description: '',
            orderNo: 0,
            createTime: '',
            updateTime: '',
            paramAttr: {
              minLength: '',
              maxLength: '',
              minValue: {},
              maxValue: {},
              paramLimit: '',
              paramValueList: '',
              paramMock: '',
              attr: '',
              structureIsHide: 0,
              example: 'disease_h5',
              createTime: '',
              updateTime: '',
              dbArr: '',
              paramNote: ''
            },
            childList: []
          }
        ],
        restParams: []
      },
      responseList: [
        {
          responseUuid: '',
          apiUuid: '',
          name: '',
          httpCode: '',
          contentType: 0,
          isDefault: 0,
          createTime: '',
          updateTime: '',
          responseParams: {
            headerParams: [
              {
                responseUuid: '',
                name: 'date',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'Sat, 05 Feb 2022 04:30:44 GMT',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'content-type',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'application/json',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'transfer-encoding',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'chunked',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'connection',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'close',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'server',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'openresty',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'tracecode',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: '8QMewH9c6JodvyHb5wE=',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'x-client-ip',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: '120.26.198.150',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              },
              {
                responseUuid: '',
                name: 'x-server-ip',
                paramType: 0,
                partType: 0,
                dataType: 0,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 1,
                binaryRawData: '',
                description: '',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: '',
                  maxLength: '',
                  minValue: {},
                  maxValue: {},
                  paramLimit: '',
                  paramValueList: '',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: '58.250.137.40',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              }
            ],
            bodyParams: [
              {
                responseUuid: '',
                name: 'ret',
                paramType: 0,
                partType: 0,
                dataType: 13,
                dataTypeValue: '',
                structureId: '',
                structureParamId: '',
                contentType: '',
                isRequired: 0,
                binaryRawData: '',
                description: 'ret description',
                orderNo: 0,
                createTime: '',
                updateTime: '',
                paramAttr: {
                  minLength: 1,
                  maxLength: 20,
                  minValue: 0,
                  maxValue: 100,
                  paramLimit: '',
                  paramValueList: '[{"value":"test","description":"test"},{"value":"test1","description":"test2"}]',
                  paramMock: '',
                  attr: '',
                  structureIsHide: 0,
                  example: 'example',
                  createTime: '',
                  updateTime: '',
                  dbArr: '',
                  paramNote: ''
                },
                childList: []
              }
            ],
            queryParams: [],
            restParams: []
          }
        }
      ],
      resultList: [{ id: '', name: '', httpCode: '', httpContentType: '', type: 0, content: '', createTime: '', updateTime: '' }],
      writeHistory: 0,
      historyInfo: { oldId: '', updateDesc: '', versionId: 0, projectVersionId: 0 },
      workSpaceUuid: 'b0027228-79c1-48c4-b872-56621a6b2344',
      projectUuid: '06ddd9a0-b595-4216-96bf-34ef54ff8910',
      uuid: '2c210770-fd59-46f5-aefb-f978a37e40a3',
      id: 4,
      apiUuid: '2c210770-fd59-46f5-aefb-f978a37e40a3'
    };
    // return res[0];
  }

  // ? update
  updateAPI() {
    // * update api
    // * update api list (for group)
    // * update mock
  }
  updateMock() {
    // * update mock
  }
  async createAPI(apiData: ApiData[]) {
    // * update group
    await this.api.api_apiDataCreate({ apiList: apiData });
    this.getGroupList();
  }
  async createGroup(group) {
    // * update group
    await this.api.api_groupCreate(group);
    this.getGroupList();
  }
  async updateGroup(group) {
    // * update group
    // * update api list
    await this.api.api_groupUpdate(group);
    this.getGroupList();
  }
  updateHistory() {}
}

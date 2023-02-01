import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { WebService } from 'eo/workbench/browser/src/app/core/services';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { APP_CONFIG } from 'eo/workbench/browser/src/environments/environment';
import { autorun, reaction, toJS } from 'mobx';

import { ApiStoreService } from '../../pages/workspace/project/api/service/store/api-state.service';
import { db } from '../services/storage/db';

@Injectable({
  providedIn: 'root'
})
export class EffectService {
  constructor(
    private store: StoreService,
    private api: ApiService,
    private router: Router,
    private lang: LanguageService,
    private web: WebService,
    private apiStore: ApiStoreService,
    private eMessage: EoNgFeedbackMessageService,
    private route: ActivatedRoute
  ) {
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';
    if (this.store.isShare) return;
    this.init();
  }
  async init() {
    const result = await db.workspace.read();
    this.store.setLocalWorkspace(result.data as API.Workspace);
    const isUserFirstUse = !this.store.getCurrentWorkspaceUuid;

    //User first use postcat,select localwork space
    if (isUserFirstUse) {
      this.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
    }
    //TODO perf
    const initWorkspaceInfo = async () => {
      if (!this.store.isLogin) {
        this.store.setWorkspaceList([]);
        if (this.store.isLocal) {
          return;
        }
        this.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
        return;
      }

      //* Get workspace list
      await this.updateWorkspaceList();
      this.fixedID();

      if (!this.store.isLocal) {
        const { roles, permissions } = await this.getWorkspacePermission();
        this.store.setPermission(permissions, 'workspace');
        this.store.setRole(roles, 'workspace');
      }
    };
    initWorkspaceInfo();
    reaction(
      () => this.store.isLogin,
      async () => {
        initWorkspaceInfo();
      }
    );
    // * Init project
    this.updateProjects(this.store.getCurrentWorkspaceUuid).then(async () => {
      // Use first user postcat,auto into Default project
      if (isUserFirstUse) {
        this.switchProject(this.store.getProjectList[0].projectUuid);
        return;
      }
      if (this.store.getProjectList.length === 0) {
        this.router.navigate(['/home/workspace/overview']);
      }
      // * Fixed projectID
      const { pid } = this.route.snapshot.queryParams;
      if (!pid) return;
      if (this.store.getCurrentProjectID !== pid) {
        this.switchProject(pid);
        return;
      }

      if (!this.store.isLocal) {
        // * update project role
        const { permissions, roles } = await this.getProjectPermission();
        this.store.setPermission(permissions, 'project');
        this.store.setRole(roles, 'project');
      }
    });

    // * Fetch role list
    const workspaceRoleList = await this.getRoleList(1);
    this.store.setRoleList(workspaceRoleList, 'workspace');
    const projectRoleList = await this.getRoleList(2);
    this.store.setRoleList(projectRoleList, 'project');
  }
  /**
   * Fixed workspaceID and projectID
   * Jump to the exist workspace and project
   */
  private fixedID() {
    const { pid, wid } = this.route.snapshot.queryParams;
    const isWorkspaceExist = this.store.getWorkspaceList.some(it => it.workSpaceUuid === wid);

    if (this.store.getCurrentWorkspaceUuid === wid && isWorkspaceExist) return;

    this.switchWorkspace(wid);
    this.store.setCurrentProjectID(pid);
  }
  async getRoleList(type) {
    const [data, err] = await this.api.api_roleList({ roleModule: type });
    if (err) {
      return;
    }
    return data;
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
  async switchWorkspace(workspaceID: string) {
    const workspace = this.store.getWorkspaceList.find(it => it.workSpaceUuid === workspaceID) || this.store.getLocalWorkspace;
    this.store.setCurrentWorkspace(workspace);

    // * real set workspace
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/overview']);
    // * update title
    document.title = this.store.getCurrentWorkspace?.title ? `Postcat - ${this.store.getCurrentWorkspace?.title}` : 'Postcat';

    // * update workspace role
    if (!this.store.isLocal) {
      const { roles, permissions } = await this.getWorkspacePermission();
      this.store.setPermission(permissions, 'workspace');
      this.store.setRole(roles, 'workspace');
    }
  }
  async getWorkspacePermission() {
    // * local workspace no need to set permission
    if (this.store.isLocal) {
      return;
    }
    // * update workspace auth
    const [data, err]: any = await this.api.api_workspaceRoles({});
    if (err) {
      return;
    }
    return data;
  }
  async getProjectPermission() {
    // * localworkspace no need to set permission
    if (this.store.isLocal) {
      return;
    }
    // * update project auth
    const [data, err]: any = await this.api.api_projectGetRole({});
    if (err) {
      return;
    }
    return data.at(0);
  }

  async switchProject(pid) {
    if (!pid) {
      this.router.navigate(['/home/workspace/overview']);
      return;
    }
    this.store.setCurrentProjectID(pid);

    //* update project info
    this.apiStore.setGroupList([]);
    //* jump to project
    await this.router.navigate(['**']);
    this.router.navigate(['/home/workspace/project/api'], { queryParams: { pid: this.store.getCurrentProjectID } });

    // * update project role
    const { permissions, roles } = await this.getProjectPermission();
    this.store.setPermission(permissions, 'project');
    this.store.setRole(roles, 'project');
  }
  async updateWorkspaceList() {
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
  async createProject(msg: any[] = []) {
    const [data, err] = await this.api.api_projectCreate({
      projectMsgs: [].concat(msg)
    });
    if (err) {
      this.eMessage.error($localize`Create Project Failed !`);
      return [];
    }
    return data;
  }
  async updateProject(data) {
    const [project, err] = await this.api.api_projectUpdate({ ...data, description: 'description' });
    if (err) {
      return;
    }
    const projects = this.store.getProjectList;
    projects.some(val => {
      if (val.projectUuid === project.projectUuid) {
        Object.assign(val, project);
        return true;
      }
    });
    this.store.setProjectList(projects);
    this.store.setCurrentProjectID(project.projectUuid);
  }

  async updateShareLink() {
    //* Query share link
    const [data, err]: any = await this.api.api_projectShareGetShareLink({});
    if (err) {
      return 'Error ... ';
    }
    const shareData = data || {};
    if (!shareData.sharedUuid) {
      // * Create share link
      const [createData, err]: any = await this.api.api_projectShareCreateShare({});
      if (err) {
        return 'Error ... ';
      }
      Object.assign(shareData, createData);
    }
    const host = (this.store.remoteUrl || window.location.host)
      .replace(/:\/{2,}/g, ':::')
      .replace(/\/{2,}/g, '/')
      .replace(/:{3}/g, '://')
      .replace(/(\/$)/, '');
    const lang = !APP_CONFIG.production && this.web.isWeb ? '' : this.lang.langHash;
    return `${host}/${lang ? `${lang}/` : ''}share/http/test?shareId=${shareData.sharedUuid}`;
  }
}

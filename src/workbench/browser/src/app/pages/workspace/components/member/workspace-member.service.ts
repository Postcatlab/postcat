import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun, toJS } from 'mobx';

@Injectable()
export class WorkspaceMemberService {
  workSpaceUuid: string;
  role: any[];
  isOwner = false;
  constructor(
    private store: StoreService,
    private effect: EffectService,
    private message: EoNgFeedbackMessageService,
    private api: ApiService
  ) {
    autorun(() => {
      this.role = this.store.getWorkspaceRole;
      this.workSpaceUuid = this.store.getCurrentWorkspaceUuid;
      this.isOwner = this.store.getWorkspaceRole.find(it => it.name === 'Workspace Owner');
    });
  }
  async addMember(ids) {
    return await this.api.api_workspaceAddMember({
      userIds: [ids]
    });
  }
  async queryMember(search) {
    if (this.store.isLocal) {
      return [
        {
          role: {
            id: 1
          },
          ...this.store.getUserProfile
        }
      ];
    }
    const [data, err]: any = await this.api.api_workspaceSearchMember({ username: '', page: 1, pageSize: 100 });
    if (err) {
      return;
    }
    return data
      .map(({ roles, id, ...items }) => ({
        id,
        roles,
        roleTitle: roles.at(0)?.name,
        isSelf: this.store.getUserProfile?.id === id, // * Is my workspace
        isOwner: roles.find(it => it.name === 'Workspace Owner'),
        isEditor: roles.find(it => it.name === 'Workspace Editor'),
        ...items
      }))
      .sort((a, b) => (a.isSelf ? -1 : 1));
  }
  async removeMember(item) {
    return await this.api.api_workspaceRemoveMember({
      userIds: [item.id]
    });
  }
  async quitMember(members) {
    if (this.store.isLocal) {
      return;
    }
    if (members.isCreator) {
      this.message.warning(
        $localize`You are the only owner of the workspace, please transfer the ownership to others before leaving the workspace.`
      );
      return [null, 'warning'];
    }
    const [data, err]: any = await this.api.api_workspaceMemberQuit({});
    if (err) {
      return;
    }
    if (this.store.getCurrentWorkspaceUuid === this.workSpaceUuid) {
      await this.effect.switchWorkspace(this.store.getLocalWorkspace.workSpaceUuid);
    }
    this.store.setWorkspaceList(this.store.getWorkspaceList.filter(item => item.workSpaceUuid !== this.workSpaceUuid));
    return [data, err];
  }
  async changeRole(item) {
    const { userId, roleIds } = item;
    const hash = {
      owner: 1,
      editor: 6
    };
    const [, err]: any = await this.api.api_workspaceSetRole({
      userRole: [{ userId, roleIds: [hash[roleIds]] }]
    });
    // * return isOK
    return !err;
  }
  async searchUser(search) {
    console.log('search', search);
    const [data, err] = await this.api.api_userSearch({ username: search.trim() });
    if (err) {
      return;
    }
    console.log('searchUser', data);
    return data;
  }
}

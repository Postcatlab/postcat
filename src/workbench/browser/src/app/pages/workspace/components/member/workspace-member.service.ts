import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';

@Injectable()
export class WorkspaceMemberService {
  workSpaceUuid: string;
  role: any[];
  isOwner = false;
  constructor(
    private api: ApiService,
    private store: StoreService,
    private effect: EffectService,
    private message: EoNgFeedbackMessageService
  ) {
    autorun(() => {
      console.log('getProjectRoleList', this.store.getWorkspaceRole);
      this.role = this.store.getWorkspaceRole;
      this.workSpaceUuid = this.store.getCurrentWorkspaceUuid;
      this.isOwner = this.store.getWorkspaceRole.find(it => it.name === 'Workspace Owner');
    });
  }
  async addMember(ids) {
    return await this.api.api_workspaceAddMember({
      userIds: ids
    });
  }
  async queryMember(search) {
    let result = [];
    if (this.store.isLocal) {
      result = [
        {
          role: {
            id: 1
          },
          ...this.store.getUserProfile
        }
      ];
    } else {
      const [data, err]: any = await this.api.api_workspaceSearchMember({ username: search.trim(), page: 0, pageSize: 1 });
      result = data || [];
    }
    result.forEach(member => {
      member.roleTitle = this.store.getWorkspaceRoleList.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
    });
    return result;
  }
  async removeMember(item) {
    return await this.api.api_workspaceRemoveMember({
      userIds: [item.id]
    });
  }
  async quitMember(members) {
    let memberList = members.filter(val => val.role.id === 1);
    if (memberList.length === 1 && memberList[0].myself) {
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
    const roleID = item.role.id === 1 ? 2 : 1;
    const [data, err]: any = await this.api.api_workspaceSetRole({
      userRole: [{ userId: item.id, roleIds: [roleID] }]
    });
    if (err) {
      return;
    }
    item.role.id = roleID;
    item.role.name = item.role.name === 'Workspace Owner' ? 'Workspace Editor' : 'Workspace Owner';
    item.roleTitle = this.store.getWorkspaceRoleList.find(val => val.id === roleID).title;
    return [data, err];
  }
  async searchUser(search) {
    const [data, err] = await this.api.api_userSearch({ username: search.trim() });
    if (err) {
      return;
    }
    return data;
  }
}

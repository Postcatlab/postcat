import { compileNgModule } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';

import { MEMBER_MUI } from '../../../../shared/models/member.model';
import { RemoteService } from '../../../../shared/services/storage/remote.service';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';
@Injectable()
export class WorkspaceMemberService {
  workspaceID: number;
  role: 'Owner' | 'Editor' | string;
  roleMUI = MEMBER_MUI;
  constructor(
    private remote: RemoteService,
    private store: StoreService,
    private effect: EffectService,
    private message: EoNgFeedbackMessageService
  ) {
    autorun(() => {
      this.role = this.store.getWorkspaceRole;
      this.workspaceID = this.store.getCurrentWorkspaceID;
    });
  }
  async addMember(ids) {
    return await this.remote.api_workspaceAddMember({
      workspaceID: this.workspaceID,
      userIDs: ids
    });
  }
  async queryMember() {
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
      const [data, error]: any = await this.remote.api_workspaceMember({
        workspaceID: this.workspaceID
      });
      result = data || [];
    }
    result.forEach(member => {
      member.roleTitle = this.roleMUI.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
    });
    return result;
  }
  async removeMember(item) {
    return await this.remote.api_workspaceRemoveMember({
      workspaceID: this.workspaceID,
      userIDs: [item.id]
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
    const [data, err]: any = await this.remote.api_workspaceMemberQuit({
      workspaceID: this.workspaceID
    });
    if (!err) {
      if (this.store.getCurrentWorkspaceID === this.workspaceID) {
        await this.effect.changeWorkspace(this.store.getLocalWorkspace.id);
      }
      this.store.setWorkspaceList(this.store.getWorkspaceList.filter(item => item.id !== this.workspaceID));
    }
    return [data, err];
  }
  async changeRole(item) {
    const roleID = item.role.id === 1 ? 2 : 1;
    const [data, err]: any = await this.remote.api_workspaceSetRole({
      workspaceID: this.workspaceID,
      roleID: roleID,
      memberID: item.id
    });
    if (!err) {
      item.role.id = roleID;
      item.role.name = item.role.name === 'Owner' ? 'Editor' : 'Owner';
      item.roleTitle = this.roleMUI.find(val => val.id === roleID).title;
    }
    return [data, err];
  }
  searchUser(search) {
    return new Promise(resolve => {
      this.remote.api_userSearch({ username: search.trim() }).then(([data, err]: any) => {
        if (err) {
          resolve([]);
          return;
        }
        resolve(data);
      });
    });
  }
}

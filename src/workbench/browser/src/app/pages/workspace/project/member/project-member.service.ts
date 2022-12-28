import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { autorun } from 'mobx';

import { MEMBER_MUI } from '../../../../shared/models/member.model';
import { RemoteService } from '../../../../shared/services/storage/remote.service';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';
@Injectable()
export class ProjectMemberService {
  projectID: number;
  role: 'Owner' | 'Editor' | string;
  roleMUI = MEMBER_MUI;
  constructor(
    private remote: RemoteService,
    private store: StoreService,
    private message: EoNgFeedbackMessageService,
    private effect: EffectService
  ) {
    autorun(() => {
      this.role = this.store.getProjectRole;
      this.projectID = this.store.getCurrentProjectID;
    });
  }
  async addMember(ids) {
    return await this.remote.api_projectAddMember({
      projectID: this.projectID,
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
      const [data, error]: any = await this.remote.api_projectMember({
        projectID: this.projectID
      });
      result = data || [];
    }
    result.forEach(member => {
      member.roleTitle = this.roleMUI.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
      //Workspace owner can't edit
      if (member.role.id === 1) {
        member.disabledEdit = true;
      }
    });
    return result;
  }
  async removeMember(item) {
    return await this.remote.api_projectDelMember({
      projectID: this.projectID,
      userIDs: [item.id]
    });
  }
  async quitMember(members) {
    const [data, err]: any = await this.remote.api_projectMemberQuit({
      projectID: this.projectID
    });
    if (!err) {
      const project = this.store.getProjectList.find(item => item.uuid !== this.store.getCurrentProjectID);
      this.effect.changeProject(project.uuid);
    }
    return [data, err];
  }
  async changeRole(item) {
    const roleID = item.role.id === 3 ? 4 : 3;
    const [data, err]: any = await this.remote.api_projectSetRole({
      projectID: this.projectID,
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
      this.remote
        .api_workspaceSearchMember({
          workspaceID: this.store.getCurrentWorkspaceID,
          username: search.trim()
        })
        .then(([data, err]: any) => {
          if (err) {
            resolve([]);
            return;
          }
          resolve(data);
        });
    });
  }
}

import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { autorun } from 'mobx';

import { MEMBER_MUI } from '../../../../shared/models/member.model';
import { EffectService } from '../../../../shared/store/effect.service';
import { StoreService } from '../../../../shared/store/state.service';
@Injectable()
export class ProjectMemberService {
  projectID: number;
  role: 'Owner' | 'Editor' | string;
  roleMUI = MEMBER_MUI;
  constructor(private api: ApiService, private store: StoreService, private effect: EffectService) {
    autorun(() => {
      this.role = this.store.getProjectRole;
      this.projectID = this.store.getCurrentProjectID;
    });
  }
  async addMember(ids) {
    return await this.api.api_projectAddMember({
      projectUuid: this.projectID,
      userIds: ids
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
      const [data, error]: any = await this.api.api_projectMemberList({
        projectUuid: this.projectID,
        username: ''
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
    return await this.api.api_projectDelMember({
      projectUuid: this.projectID,
      userIds: [item.id]
    });
  }
  async quitMember(members) {
    const [data, err]: any = await this.api.api_projectMemberQuit({
      projectUuid: this.projectID,
      userId: ''
    });
    if (!err) {
      const project = this.store.getProjectList.find(item => item.uuid !== this.store.getCurrentProjectID);
      this.effect.switchProject(project.uuid);
    }
    return [data, err];
  }
  async changeRole(item) {
    const roleID = item.role.id === 3 ? 4 : 3;
    const [data, err]: any = await this.api.api_projectSetRole({
      projectUuid: this.projectID,
      userRole: roleID
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
      this.api
        .api_workspaceSearchMember({
          workSpaceUuid: this.store.getCurrentWorkspaceUuid,
          username: search.trim(),
          page: 1,
          pageSize: 20
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

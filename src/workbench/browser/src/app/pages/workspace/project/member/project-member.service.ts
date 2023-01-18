import { Injectable } from '@angular/core';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';

@Injectable()
export class ProjectMemberService {
  role: any[] = [];
  constructor(private api: ApiService, private store: StoreService, private effect: EffectService) {
    autorun(async () => {
      console.log('this.store.getProjectRole', this.store.getProjectRole);
      this.role = this.store.getProjectRole;
    });
  }

  async addMember(ids) {
    return await this.api.api_projectAddMember({
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
      const [data, err]: any = await this.api.api_projectMemberList({
        username: ''
      });
      if (err) {
        return;
      }
      result = data || [];
    }
    result.forEach(member => {
      member.roleTitle = this.store.getProjectRoleList.find(val => val.id === member.role.id).title;
      if (member.id === this.store.getUserProfile.id) {
        member.myself = true;
      }
      // * Workspace owner can't edit
      if (member.role.id === 1) {
        member.disabledEdit = true;
      }
    });
    return result;
  }
  async removeMember(item) {
    return await this.api.api_projectDelMember({
      userIds: [item.id]
    });
  }
  async quitMember(members) {
    const [data, err]: any = await this.api.api_projectMemberQuit({
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
      userRole: roleID
    });
    if (err) {
      return;
    }
    item.role.id = roleID;
    item.role.name = item.role.name === 'Owner' ? 'Editor' : 'Owner';
    item.roleTitle = this.store.getProjectRoleList.find(val => val.id === roleID).title;
    return [data, err];
  }
  async searchUser(search) {
    const [data, err] = await this.api.api_workspaceSearchMember({
      username: search.trim(),
      page: 1,
      pageSize: 20
    });
    if (err) {
      return;
    }
    return data;
  }
}

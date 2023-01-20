import { Injectable } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { ApiService } from 'eo/workbench/browser/src/app/shared/services/storage/api.service';
import { EffectService } from 'eo/workbench/browser/src/app/shared/store/effect.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';
import { autorun } from 'mobx';

@Injectable()
export class ProjectMemberService {
  role: any[] = [];
  isOwner = false;
  constructor(
    private api: ApiService,
    private store: StoreService,
    private effect: EffectService,
    private message: EoNgFeedbackMessageService
  ) {
    autorun(async () => {
      this.role = this.store.getProjectRole;
      this.isOwner =
        this.store.getWorkspaceRole.some(it => it.name === 'Workspace Owner') ||
        this.store.getProjectRole.some(it => it.name === 'Project Owner');
    });
  }

  async addMember(ids) {
    return await this.api.api_projectAddMember({
      userIds: ids
    });
  }
  async queryMember(search = '') {
    if (this.store.isLocal) {
      return [
        {
          role: {
            id: 1
          },
          roleTitle: $localize`Project Owner`,
          ...this.store.getUserProfile,
          username: this.store.getUserProfile?.userName
        }
      ];
    }
    const [data, err]: any = await this.api.api_projectMemberList({
      username: search.trim()
    });
    if (err) {
      return [];
    }
    const titleHash = {
      'Project Owner': $localize`Project Owner`,
      'Project Editor': $localize`Project Editor`
    };
    return data
      .map(({ roles, id, ...items }) => ({
        id,
        roles,
        roleTitle: titleHash[roles.at(0)?.name],
        isSelf: this.store.getUserProfile?.id === id, // * Is my project
        isOwner: roles.some(it => it.name === 'Project Owner'),
        isEditor: roles.some(it => it.name === 'Project Editor'),
        ...items
      }))
      .sort((a, b) => (a.isSelf ? -1 : 1));
  }
  async removeMember(item) {
    return await this.api.api_projectDelMember({
      userIds: [item.id]
    });
  }
  async quitMember(members) {
    const [data, err]: any = await this.api.api_projectMemberQuit({
      userId: members.id
    });
    if (err) {
      this.message.error($localize`Quit Failed`);
      return [null, err];
    }
    this.message.success($localize`Quit successfully`);
    const project = this.store.getProjectList.find(item => item.uuid !== this.store.getCurrentProjectID);
    this.effect.switchProject(project.uuid);
    return [data, err];
  }
  async changeRole(item) {
    const { userId, roleIds } = item;
    const hash = {
      owner: 7,
      editor: 8
    };
    const [, err]: any = await this.api.api_projectSetRole({
      userRole: [{ userId, roleIds: [hash[roleIds]] }]
    });
    // * return isOK
    return !err;
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

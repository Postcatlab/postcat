import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EoNgFeedbackMessageService } from 'eo-ng-feedback';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/storage/remote.service';
import { StoreService } from 'eo/workbench/browser/src/app/shared/store/state.service';

type UserMeta = {
  username: string;
  roleTitle: string;
  myself: boolean;
  id: number;
  role: {
    name: string;
    id: number;
  };
  email: string;
  mobilePhone: string;
  permissions: string[];
};

@Component({
  selector: 'eo-manage-access',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent {
  @Input() list: UserMeta[] = [];
  @Input() loading = false;
  @Output() readonly eoOnChange = new EventEmitter<UserMeta>();
  roleMUI = [
    {
      title: 'Project Owner',
      name: 'owner',
      id: 3
    },
    {
      title: 'Editor',
      name: 'editor',
      id: 4
    }
  ];
  constructor(public store: StoreService, private remote: RemoteService, private message: EoNgFeedbackMessageService) {}

  async changeRole(item) {
    const roleID = item.role.id === 3 ? 4 : 3;
    const [data, err]: any = await this.remote.api_projectSetRole({
      projectID: this.store.getCurrentProjectID,
      roleID: roleID,
      memberID: item.id
    });
    if (err) {
      this.message.error($localize`Change role Failed`);
      return;
    }
    this.message.success($localize`Change role successfully`);
    item.role.id = roleID;
    item.roleTitle = this.roleMUI.find(val => val.id === roleID).title;
  }
  async removeMember(item) {
    const [data, err]: any = await this.remote.api_projectDelMember({
      projectID: this.store.getCurrentProjectID,
      userIDs: [item.id]
    });
    if (err) {
      this.message.error($localize`Change role error`);
      return;
    }
    this.message.success($localize`Remove Member successfully`);
    this.eoOnChange.emit(item);
  }
  quitProject(item) {
    const [data, err]: any = this.remote.api_projectMemberQuit({
      projectID: this.store.getCurrentProjectID
    });
    if (err) {
      this.message.error($localize`Quit Failed`);
      return;
    }
    this.message.success($localize`Quit successfully`);
    this.store.setWorkspaceList(this.store.getWorkspaceList.filter(item => item.id !== this.store.getCurrentWorkspaceID));
  }
}

import { Component, OnInit } from '@angular/core'

import { NzModalService } from 'ng-zorro-antd/modal'

@Component({
  selector: 'eo-member',
  template: `<nz-modal
    [nzFooter]="modalFooter"
    [(nzVisible)]="isInvateModalVisible"
    nzTitle="Add people to the space"
  >
    <ng-container *nzModalContent>
      <input placeholder="" />
      <button nz-button nzType="primary" i18n>Select a member above</button>
    </ng-container>
    <ng-template #modalFooter> </ng-template>
  </nz-modal>`
})
export class MemberComponent implements OnInit {
  isInvateModalVisible
  constructor(public modal: NzModalService) {
    this.isInvateModalVisible = false
  }
  ngOnInit(): void {}
}

import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalButtonOptions } from 'ng-zorro-antd/modal';

export type ModalOptions = {
  nzTitle: string;
  nzContent: any;
  nzFooter?: null | ModalButtonOptions[];
  [propName: string]: any;
};
@Injectable()
export class ModalService {
  constructor(private modalService: NzModalService) {}
  create(inOpts) {
    const modalOpts: ModalOptions = {
      nzTitle: 'modal title',
      nzContent: inOpts.nzContent,
      nzClosable: 'nzClosable' in inOpts ? inOpts.nzClosable : true,
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec',
      },
      nzFooter: [
        {
          label: $localize`Cancel`,
          onClick: () => {
            modal.destroy();
          },
        },
        {
          label: $localize`Confirm`,
          type: 'primary',
          onClick: () => {
            if (inOpts.nzOnOk) {
              inOpts.nzOnOk();
            } else {
              modal.destroy();
            }
          },
        },
      ],
    };
    Object.assign(modalOpts, inOpts);
    const modal = this.modalService.create(modalOpts);
    return modal;
  }
}

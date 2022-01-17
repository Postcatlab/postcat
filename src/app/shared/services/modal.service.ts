import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModalButtonOptions } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private modalService: NzModalService) {}
  create(inOpts) {
    const modalOpts: {
      [propName: string]: any;
      nzTitle: string;
      nzContent: any;
      nzFooter?: null | ModalButtonOptions[];
    } = {
      nzTitle: 'modal title',
      nzContent: inOpts.nzContent,
      nzClosable: 'nzClosable' in inOpts ? inOpts.nzClosable : true,
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec',
      },
      nzFooter: [
        {
          label: '确认',
          type: 'primary',
          onClick: () => {
            if (inOpts.nzOnOk) {
              inOpts.nzOnOk();
            } else {
              modal.destroy();
            }
          },
        },
        {
          label: '取消',
          onClick: () => modal.destroy(),
        },
      ],
    };
    Object.assign(modalOpts, inOpts);
    const modal = this.modalService.create(modalOpts);
    return modal;
  }
}

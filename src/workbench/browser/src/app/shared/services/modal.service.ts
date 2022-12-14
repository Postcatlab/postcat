import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NzModalService, ModalButtonOptions } from 'ng-zorro-antd/modal';
import { filter } from 'rxjs';

export type ModalOptions = {
  nzTitle: string;
  nzContent: any;
  nzFooter?: null | ModalButtonOptions[];
  [propName: string]: any;
};
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modal: NzModalService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.modal.closeAll();
    });
  }
  create = inOpts => {
    console.log('inOpts', inOpts);
    const modalOpts: ModalOptions = {
      nzTitle: null,
      nzContent: inOpts.nzContent,
      nzClosable: 'nzClosable' in inOpts ? inOpts.nzClosable : true,
      nzComponentParams: {
        title: 'title in component',
        subtitle: 'component sub title，will be changed after 2 sec'
      },
      nzFooter: [
        {
          label: $localize`Cancel`,
          onClick: () => {
            modal.destroy();
          }
        },
        //@ts-ignore
        ...(inOpts.onlyCancel
          ? []
          : [
              {
                label: $localize`Confirm`,
                type: 'primary',
                onClick: () => {
                  if (inOpts.nzOnOk) {
                    return inOpts.nzOnOk();
                  }
                }
              }
            ])
      ]
    };
    if (inOpts.withoutFooter) {
      modalOpts.nzFooter = null;
    }
    Object.assign(modalOpts, inOpts);
    const modal = this.modal.create(modalOpts);
    return modal;
  };
}

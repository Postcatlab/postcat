import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NzModalService, ModalButtonOptions, ModalOptions } from 'ng-zorro-antd/modal';
import { filter } from 'rxjs';

export type EoModalOptions = {
  nzTitle: string;
  nzContent: any;
  nzFooter?: null | ModalButtonOptions[] | ModalOptions['nzFooter'];
  [propName: string]: any;
};
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modal: NzModalService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.modal.openModals.forEach((val: any) => {
        if (!val?.config?.stayWhenRouterChange) val.close();
      });
    });
  }
  create = (inOpts: EoModalOptions) => {
    const modalOpts: EoModalOptions = {
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
        ...(!inOpts.nzOnOk
          ? []
          : [
              {
                label: $localize`Confirm`,
                type: 'primary',
                onClick: () => {
                  return inOpts.nzOnOk();
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
  confirm = inOpts => {
    const modalOpts: EoModalOptions = {
      nzTitle: null,
      nzContent: inOpts.nzContent,
      nzCancelText: $localize`Cancel`,
      nzOnCancel: () => modal.destroy()
    };
    Object.assign(modalOpts, inOpts);
    const modal = this.modal.confirm(inOpts);
    return modal;
  };
}

import { Render, Component } from 'ecode/dist/render';

export class ModalS extends Render {
  components;
  template;
  constructor() {
    super({ children: [] });
    this.components = [];
    this.template = '';
  }
  wakeUp({ id, title, children, event = { open: null, close: null } }) {
    this.template = '';
  }
  component({ id, title, children, event = { open: null, close: null } }) {
    const comp = new Component({
      id,
      children,
      imports: [...children.map((it) => it.render().imports)],
      init: [],
    });
    this.components.push(comp.render());
    const { open, close } = event;
    return `
    const ${Render.toCamel(id)}Modal = this.modal.create({
      nzTitle: '${title}',
      nzContent: ${Render.toCamel(id)}Component,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {},
      nzOnOk: () => {},
      nzFooter: []
    });
    ${open ? `${Render.toCamel(id)}Modal.afterOpen.subscribe(() => { ${Render.callbackRender(open)} })` : ''}
    ${close ? `${Render.toCamel(id)}Modal.afterClose.subscribe(result => { ${Render.callbackRender(close)} })` : ''}
    `;
  }
  close(id) {
    return `
    // * close the modal and clear data cache
    ${Render.toCamel(id)}Modal.close()`;
  }
  danger({ title, content, okText = 'Delete' }) {
    return `
    const confirm = () => new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: $localize\`${title}\`,
        nzContent: $localize\`${content}\`,
        nzOkDanger: true,
        nzOkText: $localize\`${okText}\`,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false)
      });
    })
    const isOk = await confirm()
    if (!isOk) {
      return 
    }
    `;
  }
  confirm({ title, content, okText = 'Yes' }) {
    return `
    const confirm = () => new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: $localize\`${title}\`,
        nzContent: $localize\`${content}\`,
        nzOkText: $localize\`${okText}\`,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false)
      });
    })
    const isOk = await confirm()
    if (!isOk) {
      return 
    }
    `;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [
            // { name: 'NzModalRef', type: 'base' },
            {
              name: 'NzModalService',
              type: 'service',
              inject: { name: 'modal' },
            },
            { name: 'NzModalModule', type: 'module' },
          ],
          from: 'ng-zorro-antd/modal',
        },
        // {
        //   target: [
        //     {
        //       name: 'ViewContainerRef',
        //       type: 'service',
        //       inject: { name: 'viewContainerRef' },
        //     },
        //   ],
        //   from: '@angular/core',
        // },
      ],
      template: ``,
      data: [],
      methods: [],
      components: [...this.components],
    };
  }
}

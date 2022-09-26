import * as _ from 'lodash';
import { Render } from 'ecode/dist/render';
import { Button } from './button';

type modalType = {
  footer: any[];
  close: () => string;
  //   static close: () => string
};

export class Modal extends Render implements modalType {
  footer: any[] = [];
  id = '';
  title;
  constructor({ id = '', title, children, footer }) {
    super({ children });
    this.id = Render.toCamel(id);
    this.title = title;
    this.footer = footer;
  }
  wakeUp() {
    return `
    // * 唤起弹窗
    this.is${this.id}ModalVisible = true
    `;
  }
  close() {
    return `
    // * 关闭弹窗
    this.is${this.id}ModalVisible = false
    `;
  }
  render() {
    const footerRender = (list) =>
      list.map((it) =>
        new Button({
          label: it.label,
          id: it.label,
          event: { click: it.callback },
        }).render()
      );
    const footer = footerRender(this.footer);
    return {
      template: `<nz-modal 
                    [nzFooter]="modalFooter"
                    [(nzVisible)]="is${this.id}ModalVisible"
                    nzTitle="${this.title.text}">
                <ng-container *nzModalContent>
                  ${this.children.template}   
                </ng-container>
                <ng-template #modalFooter>
                  ${footer.map((it) => it.template).join('\n')}
                </ng-template>
            </nz-modal>`,
      data: [{ name: `is${this.id}ModalVisible`, init: false, type: ['boolean'] }, ...this.children.data],
      init: [...this.children.init],
      imports: [
        {
          target: [
            {
              name: 'NzModalService',
              type: 'service',
              inject: { name: 'modal' },
            },
            { name: 'NzModalModule', type: 'module' },
          ],
          from: 'ng-zorro-antd/modal',
        },
        ...this.children.imports,
      ],
      methods: [footer.map((it) => it.methods), ...this.children.methods],
    };
  }
  static wakeUp(id) {
    return `
    // * 唤起弹窗
    this.is${Render.toCamel(id)}ModalVisible = true
    `;
  }
  static close(id) {
    return `
    // * 关闭弹窗
    this.is${Render.toCamel(id)}ModalVisible = false
    `;
  }
}

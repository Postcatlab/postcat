import * as _ from 'lodash';
import { Render } from 'ecode/dist/render';
import { Button } from './button';

type modalType = {
  footer?: { label: string; event: any; status: any; theme?: string[] }[] | null;
  close: () => string;
  //   static close: () => string
};

const eventHash = new Map().set('open', 'nzAfterOpen').set('close', 'nzAfterClose');

const eventTranlate = (event) =>
  Object.entries(event).reduce((total, [e, cb]) => {
    total[eventHash.get(e)] = cb;
    return total;
  }, {});

export class Modal extends Render implements modalType {
  footer;
  id = '';
  title;
  width;
  init;
  constructor({ id = '', event = {}, width = null, title, children, footer = null }) {
    super({ children, event: eventTranlate(event) });
    this.id = Render.toCamel(id);
    this.title = title;
    this.footer = footer;
    this.width = width;
    this.init = [];
  }

  wakeUp() {
    return `
    // * 唤起弹窗
    const ${this.id}ModalRef = this.modal.create({
      nzTitle: '${this.title}',
      nzWidth: ${this.width},
      nzCloseable: true,
      nzContent: this.modal${this.id}Tpl,
    })
    `;
  }
  close() {
    return `
    // * 关闭弹窗
    ${this.id}ModalRef.close()
    `;
  }
  render() {
    return {
      template: `<ng-templete #modal${this.id}Tpl let-params>${this.children.template}</ng-templete>`,
      data: [...this.children.data],
      init: [...this.children.init],
      imports: [
        {
          target: [
            {
              name: 'EoNgFeedbackModalService',
              type: 'service',
              inject: { name: 'modal' },
            },
            { name: 'EoNgFeedbackModalModule', type: 'module' },
          ],
          from: 'eo-ng-feedback',
        },
        {
          target: [
            {
              name: 'ViewChild',
              type: 'base',
            },
          ],
          from: '@angular/core',
        },
        { name: 'EoNgFeedbackModalModule', type: 'module' },
        ...this.children.imports,
      ],
      methods: [...this.methods, ...this.children.methods],
    };
  }
  static wakeUp(id) {
    return `
    // * 唤起弹窗
    const ${this.id}ModalRef = this.modal.create({
      nzTitle: '${this.title}',
      nzWidth: ${this.width},
      nzCloseable: true,
      nzContent: this.modal${this.id}Tpl,
    })
    `;
  }
  static close(id) {
    return `
    // * 关闭弹窗
    this.is${Render.toCamel(id)}ModalVisible = false
    `;
  }
}

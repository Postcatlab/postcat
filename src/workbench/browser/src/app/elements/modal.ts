import * as _ from 'lodash';
import { Render } from 'ecode/dist/render';
import { Button } from './button';

type modalType = {
  footer?: { label: string; event: any; status: any; theme?: string[] }[];
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
  footer: any[] = [];
  id = '';
  title;
  constructor({ id = '', event = {}, title, children, footer = [] }) {
    super({ children, event: eventTranlate(event) });
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
    const mainMethods = [
      `handle${this.id}ModalCancel(): void {
        // * 关闭弹窗 
        this.is${this.id}ModalVisible = false
      }`,
    ];
    const footerRender = (list) =>
      list.map((it) =>
        new Button({
          label: it.label,
          id: it.label,
          event: { click: it.callback },
          status: { disabled: it.status },
        }).render()
      );
    const footer = footerRender(this.footer);
    const footerTemplate = footer.length
      ? `<ng-template #modalFooter>
    ${footer.map((it) => it.template).join('\n')}
    </ng-template>`
      : '';

    return {
      template: `<nz-modal 
                    [nzFooter]="${footer.length ? 'modalFooter' : null}"
                    [(nzVisible)]="is${this.id}ModalVisible"
                    (nzOnCancel)="handle${this.id}ModalCancel()"
                    ${this.eventCb.join(' ')}
                    nzTitle="${this.title.text}">
                <ng-container *nzModalContent>
                  ${this.children.template}   
                </ng-container>
                ${footerTemplate}
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
      methods: [...mainMethods, ...this.methods, footer.map((it) => it.methods), ...this.children.methods],
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

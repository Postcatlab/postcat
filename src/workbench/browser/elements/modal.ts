import * as _ from 'lodash';
import { Render } from 'ecode/dist/render';
import { Button } from './button';

type modalType = {
  footer?: { label: string; event: any; status: any; theme?: string[] }[] | null;
  close: () => string;
  //   static close: () => string
};

const eventHash = new Map().set('open', 'nzAfterOpen').set('close', 'nzAfterClose');

const eventTranlate = (list) =>
  list.reduce((total, [e, cb]) => {
    const key = eventHash.get(e);
    total[key] = total[key] ? total[key].concat(cb) : [cb];
    return total;
  }, {});

export class Modal extends Render implements modalType {
  footer;
  id = '';
  title;
  width;
  constructor({ id = '', event = {}, width = null, title, children, footer = null }) {
    const close = children
      .flat(Infinity)
      .map((it) => it.render())
      .filter((it) => it.resetFn)
      .map((it) => it.resetFn)
      .flat(Infinity)
      .filter((it) => it);
    super({ children, event: eventTranlate([...Object.entries({ close }), ...Object.entries(event)]) });
    this.id = Render.toCamel(id);
    this.title = title;
    this.footer = footer;
    this.width = width;
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
    const footerRender = (list = []) =>
      list.map(({ label, type = '', click, disabled = [] }) =>
        new Button({
          id: _.camelCase(label),
          type,
          label: { text: label },
          event: { click },
          status: { disabled },
        }).render()
      );
    const footer = footerRender(this.footer || []);
    const footerTemplate = footer?.length
      ? `<ng-template #modal${this.id}Footer>
    ${footer.map((it) => it.template).join('\n')}
    </ng-template>`
      : '';
    const width = this.width ? `[nzWidth]="${this.width}"` : '';
    return {
      template: `<nz-modal 
                    ${
                      this.footer == null
                        ? ''
                        : footer?.length === 0
                        ? '[nzFooter]="null"'
                        : '[nzFooter]="modal' + this.id + 'Footer"'
                    }
                    ${width}
                    [(nzVisible)]="is${this.id}ModalVisible"
                    (nzOnCancel)="handle${this.id}ModalCancel()"
                    ${this.eventCb.join(' ')}
                    nzTitle="${this.title.text}"
                    i18n-nzTitle
                    >
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
        ...footer.map((it) => it.imports),
      ],
      methods: [...mainMethods, ...this.methods, ...footer.map((it) => it.methods), ...this.children.methods],
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

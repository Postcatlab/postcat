import { Render } from 'ecode/dist/render';

export class Tabs extends Render {
  children;
  constructor({ children }) {
    super({ children: [] });
    this.children = children;
  }
  forEachTabs(list) {
    return list
      .map(
        ({ title, hash, body }) =>
          `<eo-ng-tab nzTitle="${title}" i18n-nzTitle>
      ${body.map((it) => it.render().template).join(' ')}
      </eo-ng-tab>`
      )
      .join(' ');
  }
  render() {
    const children = this.children.map(({ body }) => body.map((it) => it.render())).flat(Infinity);
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'NzTabsModule', type: 'module' }],
          from: 'ng-zorro-antd/tabs',
        },
        ...children.map((it) => it.imports),
      ],
      template: `<eo-ng-tabset>
        ${this.forEachTabs(this.children)}
      </eo-ng-tabset>`,
      resetFn: [...children.map((it) => it.resetFn)],
      createFn: [...children.map((it) => it.creatFn)],
      data: [...children.map((it) => it.data)],
      methods: [...children.map((it) => it.methods)],
    };
  }
}

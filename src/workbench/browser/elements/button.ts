import { Render } from 'ecode/dist/render';
import _ from 'lodash';

type buttonType = {
  id: string;
  label: string;
  //   children: any[];
};

type initType = {
  id: string;
  label: string | object;
  class?: string[];
  type?: 'primary' | 'default';
  theme?: ('danger' | 'block' | 'large' | 'small')[];
  event: any;
  status?: object;
  attr?: object;
};

const themeHash = new Map()
  .set('danger', 'nzDanger')
  .set('block', 'nzBlock')
  .set('large', 'nzSize="large"')
  .set('small', 'nzSize="small"');

export class Button extends Render implements buttonType {
  id = '';
  label;
  type;
  theme;
  class;
  constructor({ id = '', type, attr = {}, theme = [], class: cls = [], event, label, status = {} }: initType) {
    if (event?.click && event.click.length) {
      const myClick = JSON.parse(JSON.stringify(event.click));
      event.click = [
        `this.is${Render.toCamel(id)}BtnLoading = true
        const btn${Render.toCamel(id)}Running = async () => {`,
        ...myClick,
        `};
        await btn${Render.toCamel(id)}Running()
        this.is${Render.toCamel(id)}BtnLoading = false`,
      ];
      // console.log('==>', event.click);
    }
    super({ event, status, attr, children: [], elementType: 'btn' });
    this.id = Render.toCamel(id);
    this.label = label;
    this.type = type;
    this.theme = theme.map((it) => themeHash.get(it)).join(' ');
    this.class = cls;
  }
  render() {
    // TODO update array and object type
    const label = _.isString(this.label) ? this.label : this.label.text;
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'NzButtonModule', type: 'module' }],
          from: 'ng-zorro-antd/button',
        },
        ...this.children.imports,
      ],
      template: `<button nz-button [nzLoading]="is${this.id}BtnLoading" ${this.attr.join(' ')} class="${this.class.join(
        ' '
      )}" nzType="${this.type || 'primary'}" ${this.theme} ${this.eventCb.join(' ')} i18n>${label}</button>`,
      data: [{ name: `is${this.id}BtnLoading`, init: false, type: ['boolean'] }],
      methods: [...this.methods],
    };
  }
}

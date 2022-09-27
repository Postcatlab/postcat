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
  type?: 'primary' | 'default';
  theme?: ('danger' | 'block')[];
  event: object;
  status?: object;
  isDisabled?: any[];
};

const themeHash = new Map().set('danger', 'nzDanger').set('block', 'nzBlock');

export class Button extends Render implements buttonType {
  id = '';
  label;
  type;
  theme;
  isDisabled;
  constructor({ id = '', type, theme = [], isDisabled = [], event, label, status }: initType) {
    super({ event, status, children: [], elementType: 'btn' });
    this.id = id;
    this.label = label;
    this.type = type;
    this.theme = theme.map((it) => themeHash.get(it));
    this.isDisabled = isDisabled;
  }
  render() {
    const isDisabledMethod = this.isDisabled.length
      ? `is${this.id}Disabled() {
      return ${this.isDisabled.join(' ')}
    }`
      : '';
    const isDisabledTemplate = this.isDisabled.length ? `[disabled]=is${this.id}Disabled()` : '';

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
      template: `<button nz-button ${isDisabledTemplate} nzType="${this.type || 'primary'}" ${
        this.theme
      } ${this.eventCb.join(' ')} i18n>${label}</button>`,
      data: [],
      methods: [isDisabledMethod, ...this.methods],
    };
  }
}
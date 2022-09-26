import { Render } from 'ecode/dist/render';
import _ from 'lodash';

type formType = {
  reset: () => void;
};

type dataType = {
  label?: string | { text: string; i18n?: string };
  type: 'input' | 'select' | 'date' | 'time' | 'password';
  class?: string;
  placeholder?: string;
  rules?: (string | Record<string, string | number>)[];
};

type initType = {
  id: string;
  data: dataType[];
  layout?: 'horizontal' | 'vertical' | 'inline';
  children?: any[];
};
export class Form extends Render implements formType {
  id = '';
  data;
  layout;
  constructor({ id = '', children, data = [], layout = 'horizontal' }: initType) {
    super({ children });
    this.id = Render.toCamel(id);
    this.data = data;
    this.layout = layout;
  }
  init(id) {
    const initRules = (list) =>
      list.map(
        ({ label, rules = [] }) =>
          `${Render.toCamel('fc-' + label)}: [null, [${rules
            .filter(_.isString)
            .map((it) => 'Validators.' + it)
            .join(',')}]]`
      );
    return `
      /\/ * Init ${id} form 
      this.validate${id}Form = this.fb.group({
        ${initRules(this.data)}
      });
      `;
  }
  reset() {
    Form.reset(this.id);
  }

  render() {
    const isLabelRequired = (rules) => (rules.includes('required') ? 'nzRequired' : '');

    const formBindName = ({ label, rules }) => {
      if (rules.length) {
        return `formControlName="${Render.toCamel('fc-' + label)}"`;
      }
      return '';
    };
    const renderKey = ({ label, type, placeholder, rules }) => {
      switch (type) {
        case 'input':
          return `<input type="text" nz-input ${formBindName({
            label,
            rules,
          })} placeholder="${placeholder}" ${isLabelRequired(rules)} />`;

        default:
          return '';
      }
    };
    const formList = (list) =>
      list
        .map(
          (it) => `
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your username!">
            <nz-form-label [nzSpan]="4">${it.label}</nz-form-label>
            ${renderKey(it)}
          </nz-form-control>
        </nz-form-item>
    `
        )
        .join('\n');
    return {
      imports: [
        {
          target: [{ name: 'UntypedFormBuilder', inject: { name: 'fb' } }, 'UntypedFormGroup', 'Validators'],
          from: '@angular/forms',
        },
        ...this.children.imports,
      ],
      template: `
      <form nz-form [formGroup]="validateForm" nzLayout="${this.layout}">
        ${formList(this.data)}
      </form>`,
      init: [this.init(this.id), ...this.children.init],
      data: [
        {
          name: `validate${this.id}Form`,
          init: 'UntypedFormGroup',
        },
        ...this.children.data,
      ],
      methods: [...this.methods],
    };
  }

  static reset(id) {
    return `
    /\/ * Clear ${id} form
    this.validate${Render.toCamel(id)}Form.reset()`;
  }
}

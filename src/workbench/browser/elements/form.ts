import { Render } from 'ecode/dist/render';
import _ from 'lodash';

type formType = {
  reset: () => void;
};

type dataType = {
  label?: string | { text: string; i18n?: string };
  isShowLabel?: boolean;
  type: 'input' | 'select' | 'date' | 'time' | 'password';
  key: string;
  class?: string;
  placeholder?: string;
  rules?: (string | Record<string, string | number>)[];
};

type initType = {
  id: string;
  data: dataType[];
  layout?: '-' | '|' | '--' | 'horizontal' | 'vertical' | 'inline';
  children?: any[];
};

const layoutHash = new Map()
  .set('-', 'horizontal')
  .set('|', 'vertical')
  .set('--', 'inline')
  .set('horizontal', 'horizontal')
  .set('vertical', 'vertical')
  .set('inline', 'inline');
export class Form extends Render implements formType {
  id = '';
  data;
  layout;
  constructor({ id = '', children, data = [], layout = 'horizontal' }: initType) {
    super({ children });
    this.id = Render.toCamel(id);
    this.data = data;
    this.layout = layoutHash.get(layout);
  }
  init(id) {
    const initRules = (list) =>
      list.map(
        ({ key, rules = [] }) =>
          `${key}: [null, [${rules
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
    return Form.reset(this.id);
  }
  getData(name) {
    return Form.getData(this.id, name);
  }

  render() {
    const isLabelRequired = (rules) => (rules.includes('required') ? 'nzRequired' : '');

    const formBindName = ({ key, rules = [] }) => {
      if (rules.length) {
        return `formControlName="${key}"`;
      }
      return '';
    };
    const typeHash = new Map().set('input', 'text').set('text', 'text').set('password', 'password');
    const renderKey = ({ key, type, placeholder, rules }) => {
      switch (type) {
        case 'input':
        case 'password':
          return `<input type="${typeHash.get(type)}" nz-input  ${formBindName({
            key,
            rules,
          })} placeholder="${placeholder || ''}" i18n-placeholder ${isLabelRequired(rules)} />`;

        default:
          return '';
      }
    };
    const formList = (list) =>
      list
        .map((it) => {
          const labelTmpl = it.isShowLabel
            ? `<nz-form-label [nzSpan]="${it.span || 12}" i18n>${it.label}</nz-form-label>`
            : '';
          return `
        <nz-form-item>
          <nz-form-control nzErrorTip="Please input your ${it.label.split('/').map(_.lowerCase).join(' or ')} !">
            ${labelTmpl}
            ${renderKey(it)}
          </nz-form-control>
        </nz-form-item>
    `;
        })
        .join('\n');
    return {
      imports: [
        {
          target: [{ name: 'UntypedFormBuilder', inject: { name: 'fb' } }, 'UntypedFormGroup', 'Validators'],
          from: '@angular/forms',
        },
        {
          target: [{ name: 'NzFormModule', type: 'module' }],
          from: 'ng-zorro-antd/form',
        },
        {
          target: [{ name: 'ReactiveFormsModule', type: 'module' }],
          from: '@angular/forms',
        },
        {
          target: [{ name: 'NzInputModule', type: 'module' }],
          from: 'ng-zorro-antd/input',
        },
        ...this.children.imports,
      ],
      template: `
      <form nz-form [formGroup]="validate${this.id}Form" nzLayout="${this.layout}">
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
  static getData(id, formData) {
    return `
    /\/ * get ${id} form values
    const ${formData} = this.validate${Render.toCamel(id)}Form.value`;
  }
}

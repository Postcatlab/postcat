import { Render } from 'ecode/dist/render';
import { Button } from '../button';
import { Canvas } from '../canvas';
import { rulesHash } from './validators';
import _ from 'lodash';

type formType = {
  reset: () => void;
};

type dataType = {
  label?: string | { text: string; i18n?: string };
  isShowLabel?: boolean;
  type: 'input' | 'select' | 'date' | 'time' | 'password';
  key: string;
  focus?: boolean;
  class?: string;
  placeholder?: string;
  rules?: (string | Record<string, string | number>)[];
};

type initType = {
  id: string;
  data: dataType[];
  layout?: '-' | '|' | '--' | 'horizontal' | 'vertical' | 'inline';
  children?: any[];
  footer?: any[];
  footerClass?: string[];
};

const layoutHash = new Map()
  .set('-', 'horizontal')
  .set('|', 'vertical')
  .set('--', 'inline')
  .set('horizontal', 'horizontal')
  .set('vertical', 'vertical')
  .set('inline', 'inline');

// * 解析规则和参数
const parseRule = (rule) => rule.split(':').map((it) => it.trim());

export class Form extends Render implements formType {
  id = '';
  data;
  layout;
  footer;
  rules;
  constructor({ id = '', children, footerClass = [], data = [], layout = 'horizontal', footer = [] }: initType) {
    super({ children });
    this.id = Render.toCamel(id);
    this.data = data;
    this.layout = layoutHash.get(layout);
    this.rules = this.renderRules(this.data, this.id);
    this.footer = new Canvas({
      class: footerClass,
      children: footer.map((it) => new Button(it)),
    }).render();
  }
  renderRules(list, id) {
    const regInitMethod = (data, mid) =>
      data.map(({ key, rules = [] }) => {
        const ruleList = rules.map(parseRule);
        const dynamicRule = ruleList.filter(([type]) => !builtInRule.includes(type));
        return dynamicRule.length
          ? `
          dynamic${mid}Validator = (control: UntypedFormControl): { [s: string]: boolean } => {
            ${dynamicRule
              .map(([type, params]) => rulesHash[type].dynamicRule({ valid: type, params, form: `validate${mid}Form` }))
              .join('\n')}
            return {};
          }`
          : '';
      });

    const builtInRule = Object.entries(rulesHash)
      .map(([key, data]) => ({ key, isBuiltIn: data.isBuiltIn }))
      .filter((it) => it.isBuiltIn)
      .map((it) => it.key);

    return {
      initRule: list.map(({ key, rules = [] }) => {
        const ruleList = rules.map((it) => {
          const [type, params] = parseRule(it);
          return [type, params];
        });
        const staticRule = ruleList.filter(([type]) => builtInRule.includes(type));
        const dynamicRule = ruleList.filter(([type]) => !builtInRule.includes(type));
        return `${key}: [null,
          ${
            staticRule.length
              ? '[' +
                staticRule
                  .map(([t, params]) => rulesHash[t].statementRule({ id, params }))
                  .concat(dynamicRule.length ? `this.dynamic${id}Validator` : '')
                  .join(',') +
                ']'
              : '[]'
          }
        ]`;
      }),
      methods: regInitMethod(list, id),
    };
  }
  init(id) {
    return [
      `
    /\/ * Init ${id} form 
    this.validate${id}Form = this.fb.group({
        ${this.rules.initRule.join(',')}
      });
      `,
    ];
  }
  reset() {
    return Form.reset(this.id);
  }
  getData(name) {
    return Form.getData(this.id, name);
  }
  patch(name, data) {
    return Form.patch(this.id, name, data);
  }
  getValue(name, nick) {
    return Form.getValue(this.id, name, nick);
  }
  isOk() {
    return Form.isOk(this.id);
  }
  focus(key) {
    return `
      \/\/ * auto focus
      setTimeout(() => {
        this.${key}${this.id}Ref?.nativeElement.focus()
      }, 300)
    `;
  }
  render() {
    const formBindName = ({ key, rules = [] }) => {
      if (rules.length) {
        return `formControlName="${key}"`;
      }
      return '';
    };
    const typeHash = new Map().set('input', 'text').set('text', 'text').set('password', 'password');
    const renderKey = ({ key, type, placeholder, focus = false, rules }: any) => {
      switch (type) {
        case 'input':
        case 'password':
          return `
          <input type="${typeHash.get(type)}" ${focus ? `#${key}${this.id}Ref` : ''} nz-input  ${formBindName({
            key,
            rules,
          })} placeholder="${placeholder || ''}" i18n-placeholder  />`;

        default:
          return '';
      }
    };
    const formList = (list) =>
      list
        .map(({ isShowLabel = true, label, rules, placeholder, key, span, type, focus, ...it }, i) => {
          const isLabelRequired = (ruleList) => (ruleList.includes('required') ? 'nzRequired' : '');
          const labelTmpl = isShowLabel
            ? `<nz-form-label [nzSpan]="${span || 24}" ${isLabelRequired(rules)} i18n>${label}</nz-form-label>`
            : '';
          const errorTip = (ruleList) =>
            ruleList.map(parseRule).map(
              ([ty, params]) =>
                `<ng-container *ngIf="control.hasError('${ty}')" i18n>
                  ${rulesHash[ty].errTip({ params, label })} 
                </ng-container>
              `
            );

          const renderErrTipTpl =
            rules.length > 1
              ? `<ng-template #${key}ErrorTpl let-control>
                ${errorTip(rules).join('\n')}
              </ng-template>`
              : '';
          return `
        <nz-form-item>
          ${labelTmpl}
          <nz-form-control ${
            rules.length > 1 ? `[nzErrorTip]="${key}ErrorTpl"` : `nzErrorTip="${rulesHash[rules[0]].errTip({ label })}"`
          }>
            ${renderKey({ isShowLabel, placeholder, label, rules, key, span, focus, type })}
            ${renderErrTipTpl}
            </nz-form-control>
            </nz-form-item>
            `;
        })
        .join('\n');
    const refList = this.data
      .filter((it) => it.focus)
      .map((it) => ({
        name: `@ViewChild('${it.key}${this.id}Ref') ${it.key}${this.id}Ref`,
        init: `ElementRef<HTMLInputElement>`,
        bing: true,
      }));
    const createFn = this.data
      .filter((it) => it.focus)
      .map(
        (it) => `\/\/ * auto focus
        setTimeout(() => {
          this.${it.key}${this.id}Ref?.nativeElement.focus()
        }, 300)
      `
      );
    return {
      elementType: 'form',
      imports: [
        {
          target: [
            { name: 'UntypedFormBuilder', inject: { name: 'fb' } },
            { name: 'ReactiveFormsModule', type: 'module' },
            'UntypedFormControl',
            'UntypedFormGroup',
            'Validators',
          ],
          from: '@angular/forms',
        },
        {
          target: ['ViewChild', 'ElementRef'],
          from: '@angular/core',
        },
        {
          target: [{ name: 'NzFormModule', type: 'module' }],
          from: 'ng-zorro-antd/form',
        },
        {
          target: [{ name: 'NzInputModule', type: 'module' }],
          from: 'ng-zorro-antd/input',
        },
        ...this.children.imports,
        ...this.footer.imports,
      ],
      template: `
      <form nz-form [formGroup]="validate${this.id}Form" nzLayout="${this.layout}">
        ${formList(this.data)}
        ${this.footer.template}
      </form>`,
      init: [...this.init(this.id), ...this.children.init],
      resetFn: [
        `
      \/\/ * auto clear form 
      this.validate${this.id}Form.reset()`,
        ...this.children.resetFn,
      ],
      createFn: [...createFn, ...this.children.createFn],
      data: [
        {
          name: `validate${this.id}Form`,
          init: 'UntypedFormGroup',
        },
        ...refList,
        ...this.footer.data,
        ...this.children.data,
      ],
      methods: [this.rules.methods, ...this.footer.methods, ...this.methods],
    };
  }

  static isOk(id) {
    return `const isOk = this.validate${Render.toCamel(id)}Form.valid`;
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
  static patch(id, key, data) {
    return `
    /\/ * get ${id} form values
    this.validate${Render.toCamel(id)}Form.patchValue({
      ${key}: ${data}
    })`;
  }
  static getValue(id, name, nick = '') {
    return ` const {${name}${nick ? ':' + nick : ''}} = this.validate${Render.toCamel(id)}Form.value;`;
  }
}

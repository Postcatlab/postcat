import { Render } from 'ecode/dist/render';

type initType = {
  id: string;
  placeholder?: string;
};

export class Input extends Render {
  placeholder;
  id;
  constructor({ placeholder, id }: initType) {
    super({ children: [], elementType: 'input' });
    this.placeholder = placeholder;
    this.id = Render.toCamel(id);
  }
  getValue(data) {
    return `const ${data} = this.input${this.id}Value`;
  }
  isEmpty() {
    return `this.input${this.id}Value === ''`;
  }
  reset() {
    return `this.input${this.id}Value = ''`;
  }
  render() {
    return {
      type: 'element',
      resetFn: [
        `
      \/\/ * auto clear form 
      this.input${this.id}Value = ''`,
        ...this.children.resetFn,
      ],
      imports: [
        {
          target: [{ name: 'NzInputModule', type: 'module' }],
          from: 'ng-zorro-antd/input',
        },
        {
          target: [{ name: 'FormsModule', type: 'module' }],
          from: '@angular/forms',
        },
      ],
      template: `<input nz-input [(ngModel)]="input${this.id}Value" i18n-placeholder placeholder="${
        this.placeholder || ''
      }"/>`,
      data: [{ name: `input${this.id}Value`, init: '', type: ['string'] }],
      init: [],
      methods: [],
    };
  }
}

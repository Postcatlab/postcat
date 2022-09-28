import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: string;
  class: string[];
  children?: any[];
};

export class Title extends Render {
  label;
  class;
  constructor({ label, class: cls = [], children = [] }: initType) {
    super({ children, elementType: 'text' });
    this.label = label;
    this.class = cls.length ? this.renderClass(cls) : '';
  }
  renderClass(list) {
    return `class="${list.join(' ')}" `;
  }
  render() {
    return {
      type: 'element',
      imports: [...this.children.imports],
      template: `<h2 class="text-lg flex justify-between items-center">
      <span ${this.class} i18n>${this.label}</span>${this.children.template}</h2>`,
      data: [...this.children.data],
      methods: [...this.children.methods],
    };
  }
}

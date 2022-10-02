import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: string;
  id?: string;
  class?: string[];
  children?: any[];
};

export class Title extends Render {
  label;
  id;
  class;
  constructor({ label, id = '', class: cls = [], children = [] }: initType) {
    super({ children, elementType: 'text' });
    this.label = label;
    this.id = id;
    this.class = cls.length ? this.renderClass(cls) : '';
  }
  renderClass(list) {
    return `class="${list.join(' ')}" `;
  }
  render() {
    const id = this.id ? `id="${this.id}"` : '';
    return {
      type: 'element',
      imports: [...this.children.imports],
      template: `<h2 class="text-lg flex justify-between items-center" ${id}>
      <span ${this.class} i18n>${this.label}</span>${this.children.template}</h2>`,
      data: [...this.children.data],
      methods: [...this.children.methods],
    };
  }
}

import { Render } from 'ecode/dist/render';

export class Canvas extends Render {
  class;

  constructor({ children = [], attr = {}, class: cls }) {
    super({ children, attr });
    this.class = cls;
  }
  render() {
    return {
      type: 'element',
      template: `<section class="${this.class.join(' ')}" ${this.attr.join(' ')}>${this.children.template}</section>`,
      imports: [...this.children.imports],
      init: [...this.children.init],
      data: [...this.children.data],
      methods: [...this.children.methods],
      resetFn: [...this.children.resetFn],
      createFn: [...this.children.createFn],
    };
  }
}

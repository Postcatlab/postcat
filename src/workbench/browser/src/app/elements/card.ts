import { Render } from 'ecode/dist/render';

export class Card extends Render {
  class;
  constructor({ children = [], class: cls }) {
    super({ children });
    this.class = cls;
  }
  render() {
    return {
      type: 'element',
      template: `<section class="${this.class.join(' ')}">${this.children.template}</section>`,
      imports: [...this.children.imports],
      init: [...this.children.init],
      data: [...this.children.data],
      methods: [...this.children.methods],
    };
  }
}

import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: string;
  children?: any[];
};

export class Title extends Render {
  label;
  constructor({ label, children = [] }: initType) {
    super({ children, elementType: 'text' });
    this.label = label;
  }
  render() {
    return {
      type: 'element',
      imports: [...this.children.imports],
      template: `<h2 class="text-lg flex justify-between items-center"><span i18n>${this.label}</span>${this.children.template}</h2>`,
      data: [...this.children.data],
      methods: [...this.children.methods],
    };
  }
}

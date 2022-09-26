import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: string;
};

export class Title extends Render {
  label;
  constructor({ label }: initType) {
    super({ children: [], elementType: 'text' });
    this.label = label;
  }
  render() {
    return {
      type: 'element',
      imports: [],
      template: `<h2 class="text-lg" i18n>${this.label}</h2>`,
      data: [],
      methods: [],
    };
  }
}

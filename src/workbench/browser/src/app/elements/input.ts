import { Render } from 'ecode/dist/render';

type initType = {
  placeholder?: string;
};

export class Input extends Render {
  placeholder;
  constructor({ placeholder }: initType) {
    super({ children: [], elementType: 'input' });
    this.placeholder = placeholder;
  }
  render() {
    return {
      type: 'element',
      imports: [],
      template: `<input placeholder="${this.placeholder || ''}"/>`,
      data: [],
      methods: [],
    };
  }
}

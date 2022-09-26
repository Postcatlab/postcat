import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: object | string;
};

export class Text extends Render {
  label;
  constructor({ label }: initType) {
    super({ children: [], elementType: 'text' });
    this.label = this.parserLabel(label);
  }
  parserLabel(data) {
    if (_.isArray(data)) {
      return data;
    }
    if (_.isObject(data)) {
      return [data];
    }
    if (_.isString(data)) {
      return [{ text: data }];
    }
  }
  rendertemplate(list) {
    return list
      .map(({ text, type }) => `<span ${type?.link ? 'style="color:blue"' : ''} i18n>${text}</span>`)
      .join(' ');
  }
  render() {
    const template = this.rendertemplate(this.label);
    return {
      type: 'element',
      imports: [],
      template: `<div class="pb-4">${template}</div>`,
      data: [],
      methods: [],
    };
  }
}

import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  type?: 'title';
  label: object | string;
};

export class Text extends Render {
  label;
  type;
  constructor({ label, type }: initType) {
    super({ children: [], elementType: 'text' });
    this.type = type;
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
    if (this.type === 'title') {
      return list.map(({ text }) => `<div i18n>${text}</div>`).join(' ');
    }
    return list
      .map(({ text, type }) => `<span ${type?.link ? 'style="color:blue"' : ''} i18n>${text}</span>`)
      .join(' ');
  }
  render() {
    const template = this.rendertemplate(this.label);
    return {
      type: 'element',
      imports: [],
      template,
      data: [],
      methods: [],
    };
  }
}

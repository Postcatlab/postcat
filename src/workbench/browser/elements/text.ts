import _ from 'lodash';
import { Render } from 'ecode/dist/render';

type initType = {
  label: object | string;
  event?: any;
};

export class Text extends Render {
  label;
  constructor({ label, event = {} }: initType) {
    super({ children: [], event, elementType: 'text' });
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
      .map(({ text }) => {
        if (this.eventCb.length > 0) {
          // TODO
          return `<span style="color: #1890ff" class="cursor-pointer" ${this.eventCb.join(' ')} i18n> ${text} </span>`;
        }
        return `<span i18n> ${text} </span>`;
      })
      .join(' ');
  }
  render() {
    const template = this.rendertemplate(this.label);
    return {
      type: 'element',
      imports: [],
      template: `${template}`,
      data: [],
      methods: [...this.methods],
    };
  }
}

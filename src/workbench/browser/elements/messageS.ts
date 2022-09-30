import { Render } from 'ecode/dist/render';

export class MessageS extends Render {
  constructor() {
    super({ children: [] });
  }
  success(text) {
    return `this.eMessage.success($localize\`${text}\`)`;
  }
  error(text) {
    return `this.eMessage.error($localize\`${text}\`)`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'EoMessageService', type: 'service', inject: { name: 'eMessage' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/eoui/message/eo-message.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

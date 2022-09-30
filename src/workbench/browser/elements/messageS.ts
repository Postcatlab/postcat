import { Render } from 'ecode/dist/render';

export class MessageS extends Render {
  constructor() {
    super({ children: [] });
  }
  success(text) {
    return `this.eMessage.success(\`${text}\`)`;
  }
  error(text) {
    return `this.eMessage.error(\`${text}\`)`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'EoMessageService', type: 'service', inject: { name: 'eMessage' } }],
          from: 'eo/workbench/browser/src/app/eoui/message/eo-message.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

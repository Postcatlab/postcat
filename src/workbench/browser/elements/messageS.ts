import { Render } from 'ecode/dist/render';

export class MessageS extends Render {
  constructor() {
    super({ children: [] });
  }
  success(text) {
    return `this.message.success(\`${text}\`)`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'EoMessageService', type: 'service', inject: { name: 'message' } }],
          from: 'eo/workbench/browser/src/app/eoui/message/eo-message.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

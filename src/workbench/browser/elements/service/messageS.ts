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
          target: [{ name: 'EoNgFeedbackMessageService', type: 'service', inject: { name: 'eMessage' }, ignore: true }],
          from: 'eo-ng-feedback',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

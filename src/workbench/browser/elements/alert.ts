import { Render } from 'ecode/dist/render';

export class Alert extends Render {
  text;
  icon;
  type;
  constructor({ text = '', type = 'warning', icon = true }) {
    super({ children: [] });
    this.text = text;
    this.type = type;
    this.icon = icon;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'EoNgFeedbackAlertModule', type: 'module' }],
          from: 'eo-ng-feedback',
        },
      ],
      template: `<eo-ng-feedback-alert
      nzType="${this.type}"
      nzMessage="${this.text}"
      i18n-nzMessage
      ${this.icon ? 'nzShowIcon' : ''}
    ></eo-ng-feedback-alert>`,
      data: [],
      methods: [],
    };
  }
}

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
          target: [{ name: 'NzAlertModule', type: 'module' }],
          from: 'ng-zorro-antd/alert',
        },
      ],
      template: `<nz-alert
      nzType="${this.type}"
      nzMessage="${this.text}"
      i18n-nzMessage
      ${this.icon ? 'nzShowIcon' : ''}
    ></nz-alert>`,
      data: [],
      methods: [],
    };
  }
}

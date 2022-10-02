import { Render } from 'ecode/dist/render';

export class Line extends Render {
  constructor() {
    super({ children: [] });
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'NzDividerModule', type: 'module' }],
          from: 'ng-zorro-antd/divider',
        },
      ],
      template: `<nz-divider></nz-divider>`,
      data: [],
      methods: [],
    };
  }
}

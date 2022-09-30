import { Render } from 'ecode/dist/render';

export class ModalS extends Render {
  constructor() {
    super({ children: [] });
  }
  danger({ title, content }) {
    return `
    const confirm = () => new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: \`${title}\`,
        nzContent: \`${content}\`,
        nzOkDanger: true,
        nzOnOk: () => resolve(true),
        nzOnCancel: () => resolve(false)
      });
    })
    const isOk = await confirm()
    if (!isOk) {
      return 
    }
    `;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [
            {
              name: 'NzModalService',
              type: 'service',
              inject: { name: 'modal' },
            },
            { name: 'NzModalModule', type: 'module' },
          ],
          from: 'ng-zorro-antd/modal',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

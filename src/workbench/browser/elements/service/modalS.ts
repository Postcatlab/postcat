import { Render } from 'ecode/dist/render';

export class ModalS extends Render {
  constructor() {
    super({ children: [] });
  }
  danger({ title, content, okText = 'Delete' }) {
    return `
    const confirm = () => new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: $localize\`${title}\`,
        nzContent: $localize\`${content}\`,
        nzOkDanger: true,
        nzOkText: $localize\`${okText}\`,
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
  confirm({ title, content, okText = 'Yes' }) {
    return `
    const confirm = () => new Promise((resolve) => {
      this.modal.confirm({
        nzTitle: $localize\`${title}\`,
        nzContent: $localize\`${content}\`,
        nzOkText: $localize\`${okText}\`,
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

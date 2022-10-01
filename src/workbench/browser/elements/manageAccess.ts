import { Render } from 'ecode/dist/render';

export class ManageAccess extends Render {
  constructor({ event }) {
    super({ children: [], event });
  }

  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'ManageAccessComponent', type: 'component' }],
          from: 'eo/workbench/browser/src/app/shared/components/manage-access/manage-access.component',
        },
        {
          target: [{ name: 'SharedModule', type: 'module' }],
          from: 'eo/workbench/browser/src/app/shared/shared.module',
        },
      ],
      template: `<eo-manage-access [data]="memberList" ${this.eventCb.join(' ')}></eo-manage-access>`,
      data: [{ name: `memberList`, init: '[]' }],
      methods: [...this.methods],
    };
  }
  static setList(list) {
    return `
    // * 对成员列表进行排序
    const Owner = ${list}.filter(it => it.roleName === 'Owner')
    const Member = ${list}.filter(it => it.roleName !== 'Owner')
    this.memberList = Owner.concat(Member)`;
  }
}

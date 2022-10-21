import { Render } from 'ecode/dist/render';

export class Tree extends Render {
  id;
  showline;
  clickMethod;
  constructor({ id, showline = false, click = [] }) {
    super({ children: [] });
    this.id = Render.toCamel(id);
    this.showline = showline;
    this.clickMethod = Render.callbackRender(click);
  }
  setData(data) {
    return Tree.setData(this.id, data);
  }
  render() {
    const mainMethods = [
      `async handleClickTree${this.id}Data($event) {
          ${this.clickMethod}
      }`,
    ];
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'ApiModule', type: 'module' }],
          from: 'eo/workbench/browser/src/app/pages/api/api.module',
        },
      ],
      template: `<eo-api-group-tree ${this.showline ? 'nzShowLine' : ''}></eo-api-group-tree>`,
      data: [
        // {
        //   name: `tree${this.id}Data`,
        //   init: `[
        //     {
        //       title: '0-0',
        //       key: '00',
        //       expanded: true,
        //       children: [
        //         {
        //           title: '0-0-0',
        //           key: '000',
        //           expanded: true,
        //           children: [
        //             { title: '0-0-0-0', key: '0000', isLeaf: true },
        //             { title: '0-0-0-1', key: '0001', isLeaf: true },
        //             { title: '0-0-0-2', key: '0002', isLeaf: true }
        //           ]
        //         },
        //         {
        //           title: '0-0-1',
        //           key: '001',
        //           children: [
        //             { title: '0-0-1-0', key: '0010', isLeaf: true },
        //             { title: '0-0-1-1', key: '0011', isLeaf: true },
        //             { title: '0-0-1-2', key: '0012', isLeaf: true }
        //           ]
        //         },
        //         {
        //           title: '0-0-2',
        //           key: '002'
        //         }
        //       ]
        //     },
        //     {
        //       title: '0-1',
        //       key: '01',
        //       children: [
        //         {
        //           title: '0-1-0',
        //           key: '010',
        //           children: [
        //             { title: '0-1-0-0', key: '0100', isLeaf: true },
        //             { title: '0-1-0-1', key: '0101', isLeaf: true },
        //             { title: '0-1-0-2', key: '0102', isLeaf: true }
        //           ]
        //         },
        //         {
        //           title: '0-1-1',
        //           key: '011',
        //           children: [
        //             { title: '0-1-1-0', key: '0110', isLeaf: true },
        //             { title: '0-1-1-1', key: '0111', isLeaf: true },
        //             { title: '0-1-1-2', key: '0112', isLeaf: true }
        //           ]
        //         }
        //       ]
        //     },
        //     {
        //       title: '0-2',
        //       key: '02',
        //       isLeaf: true
        //     }
        //   ]`,
        //   type: ['any[]'],
        // },
      ],
      init: [],
      methods: [...mainMethods],
    };
  }
  static setData(id, data) {
    return `
    \/\/ * set tree data
    this.tree${Render.toCamel(id)}Data = ${data}`;
  }
}

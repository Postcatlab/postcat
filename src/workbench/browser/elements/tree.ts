import { Render } from 'ecode/dist/render';

export class Tree extends Render {
  constructor({ data }) {
    super({ children: [] });
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'NzTreeModule', type: 'module' }],
          from: 'ng-zorro-antd/tree',
        },
      ],
      template: `<nz-tree [nzData]="nodes" nzShowLine (nzClick)="nzEvent($event)"></nz-tree>`,
      data: [],
      methods: [],
    };
  }
}

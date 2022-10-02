import { Render } from 'ecode/dist/render';

export class Overview extends Render {
  constructor() {
    super({ children: [] });
  }
  render() {
    return {
      type: 'element',
      template: `<eo-api-overview></eo-api-overview>`,
      imports: [
        {
          target: [{ name: 'ApiOverviewComponent', type: 'component' }],
          from: 'eo/workbench/browser/src/app/pages/api/overview/api-overview.component',
        },
        {
          target: [{ name: 'EoIconparkIconModule', type: 'module' }],
          from: 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module',
        },
        {
          target: [{ name: 'NzDividerModule', type: 'module' }],
          from: 'ng-zorro-antd/divider',
        },
        {
          target: [{ name: 'NzCardModule', type: 'module' }],
          from: 'ng-zorro-antd/card',
        },
      ],
      init: [],
      data: [],
      methods: [],
    };
  }
}

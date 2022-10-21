import { Render } from 'ecode/dist/render';

export class ApiContent extends Render {
  constructor() {
    super({ children: [] });
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'ApiModule', type: 'module' }],
          from: 'eo/workbench/browser/src/app/pages/api/api.module',
        },
      ],
      template: `<eo-api></eo-api>`,
      data: [],
      methods: [],
    };
  }
}

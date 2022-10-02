import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class ProjectS extends Render {
  constructor() {
    super({ children: [] });
  }

  exportProjectData(name) {
    return `const ${name} = await this.project.exportProjectData();`;
  }
  getWorkspaceInfo(id) {
    return `await this.project.getWorkspaceInfo(${id});`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'ProjectService', type: 'service', inject: { name: 'project' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/shared/services/project/project.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

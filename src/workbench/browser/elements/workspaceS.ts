import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class WorkspaceS extends Render {
  constructor() {
    super({ children: [] });
  }
  setWorkspaceList(list) {
    return `this.workspace.setWorkspaceList(${list})`;
  }
  getCurrent(name) {
    return `const ${name} = this.workspace.currentWorkspace;`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'WorkspaceService', type: 'service', inject: { name: 'workspace' } }],
          from: 'eo/workbench/browser/src/app/shared/services/workspace/workspace.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

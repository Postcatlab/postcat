import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class UserS extends Render {
  constructor() {
    super({ children: [] });
  }
  send(name, data) {
    return `const [err, data]:any = await this.api.${name}(${data})
    if(err) {
      return
    }
    `;
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

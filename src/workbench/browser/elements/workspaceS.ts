import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class WorkspaceS extends Render {
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
          target: [{ name: 'UserService', type: 'service', inject: { name: 'user' } }],
          from: 'eo/workbench/browser/src/app/shared/services/user/user.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

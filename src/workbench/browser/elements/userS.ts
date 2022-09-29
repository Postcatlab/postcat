import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class UserS extends Render {
  constructor() {
    super({ children: [] });
  }
  get(name, eq = false) {
    return `${eq ? '=' : ''} this.user.${name}`;
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

import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class UserS extends Render {
  constructor() {
    super({ children: [] });
  }
  get(name, eq = false) {
    return `${eq ? '=' : ''} this.user.${name}`;
  }
  getKey(name) {
    return `const ${name} = this.user.${name}`;
  }
  setLoginInfo(data) {
    return `this.user.setLoginInfo(${data})`;
  }
  setUserProfile(data) {
    return `this.user.setUserProfile(${data})`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'UserService', type: 'service', inject: { name: 'user' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/shared/services/user/user.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

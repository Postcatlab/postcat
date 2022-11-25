import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class UserS extends Render {
  constructor() {
    super({ children: [] });
  }
  get(name, eq = false) {
    return `${eq ? '=' : ''} this.store.${name}`;
  }
  getKey(name) {
    return `const ${name} = this.store.${name}`;
  }
  clearAuth() {
    return `this.store.clearAuth()`;
  }
  setLoginInfo(data) {
    return `this.store.setLoginInfo(${data})`;
  }
  setUserProfile(data) {
    return `this.store.setUserProfile(${data})`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'StoreService', type: 'service', inject: { name: 'user' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/shared/services/user/user.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

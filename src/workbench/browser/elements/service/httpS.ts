import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class HTTPS extends Render {
  constructor() {
    super({ children: [] });
  }
  errTip(tip) {
    return tip ? `this.eMessage.error($localize\`${tip}\`)` : '';
  }
  send(name, params = '', { err = 'err', data = 'data', errTip = '' } = {}) {
    return `const [${data}, ${err}]:any = await this.api.${name}(${params})
    if(${err}) {
      ${this.errTip(errTip)}
      if (this.user.isLogin) {
        return
      }
      if (${err}.status === 401) {
        this.message.send({ type: 'http-401', data: {} })
      }
      return
    }`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'UserService', type: 'service', inject: { name: 'user' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/shared/services/user/user.service',
        },
        {
          target: [{ name: 'MessageService', type: 'service', inject: { name: 'message' } }],
          from: 'eo/workbench/browser/src/app/shared/services/message/message.service',
        },
        {
          target: [{ name: 'RemoteService', type: 'service', inject: { name: 'api' } }],
          from: 'eo/workbench/browser/src/app/shared/services/storage/remote.service',
        },
        {
          target: [{ name: 'EoMessageService', type: 'service', inject: { name: 'eMessage' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/eoui/message/eo-message.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

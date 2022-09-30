import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class HTTPS extends Render {
  constructor() {
    super({ children: [] });
  }
  errTip(tip) {
    return tip ? `this.eMessage.error('${tip}')` : '';
  }
  send(name, params = '', { err = 'err', data = 'data', errTip = '' } = {}) {
    return `const [${data}, ${err}]:any = await this.api.${name}(${params})
    if(${err}) {
      ${this.errTip(errTip)}
      return
    }

    `;
  }
  render() {
    return {
      type: 'element',
      imports: [
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

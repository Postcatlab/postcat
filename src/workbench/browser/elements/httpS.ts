import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class HTTPS extends Render {
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
          target: [{ name: 'RemoteService', type: 'service', inject: { name: 'api' } }],
          from: 'eo/workbench/browser/src/app/shared/services/storage/remote.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

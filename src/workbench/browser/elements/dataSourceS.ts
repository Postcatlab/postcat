import { Render } from 'ecode/dist/render';
import * as _ from 'lodash';

export class DataSourceS extends Render {
  constructor() {
    super({ children: [] });
  }
  isConnectRemote(status) {
    return `const ${status} = this.dataSource.isConnectRemote`;
  }
  hasUrl(status) {
    return `const ${status} = this.dataSource.mockUrl`;
  }
  ping() {
    return `const [isOk] = await this.dataSource.pingRmoteServerUrl();`;
  }
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'DataSourceService', type: 'service', inject: { name: 'dataSource' }, ignore: true }],
          from: 'eo/workbench/browser/src/app/shared/services/data-source/data-source.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

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
  render() {
    return {
      type: 'element',
      imports: [
        {
          target: [{ name: 'DataSouceService', type: 'service', inject: { name: 'dataSource' }, ignore: true }],
          from: 'eo/app/shared/services/remote/remote.service',
        },
      ],
      template: ``,
      data: [],
      methods: [],
    };
  }
}

import { Pipe, PipeTransform } from '@angular/core';

import { BodyParam } from '../../../../../services/storage/db/models/apiData';
@Pipe({
  name: 'apiParamsNum'
})
export class ApiParamsNumPipe implements PipeTransform {
  transform(params: BodyParam[], ...args: unknown[]): number {
    if (!params || typeof params !== 'object') {
      return 0;
    }
    const data = params.filter(val => val.name || val.paramAttr?.example || val.description);
    return data.length || params?.[0]?.binaryRawData?.length;
  }
}

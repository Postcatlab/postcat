import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'apiParamsNum'
})
export class ApiParamsNumPipe implements PipeTransform {
  transform(params: any, ...args: unknown[]): number {
    if (!params || typeof params !== 'object') {
      return 0;
    }
    return params.filter(val => val.name || val.paramAttr?.example || val.description).length;
  }
}

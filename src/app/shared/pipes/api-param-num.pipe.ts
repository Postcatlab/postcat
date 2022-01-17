import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'apiParamsNum',
  pure: false,
})
export class ApiParamsNumPipe implements PipeTransform {
  transform(params: any, ...args: unknown[]): number {
    if (typeof params !== 'object') {
      return 0;
    }
    return params.filter((val) => val.name).length;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { protocalMap, requestMethodMap } from 'eo/workbench/browser/src/app/shared/services/storage/db/enums/api.enum';

type FormatType = keyof typeof formatMap;

const formatMap = {
  protocal: protocalMap,
  requestMethod: requestMethodMap
} as const;

@Pipe({ name: 'apiFormater' })
export class ApiFormaterPipe implements PipeTransform {
  constructor() {}

  transform(value: any, type: FormatType) {
    return formatMap[type][value];
  }
}

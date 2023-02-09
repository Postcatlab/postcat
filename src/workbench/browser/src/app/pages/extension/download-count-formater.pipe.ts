import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'downloadCountFormater' })
export class DownloadCountFormaterPipe implements PipeTransform {
  constructor() {}

  transform(count = 0) {
    if (count > 999) {
      return `${(count / 1000).toFixed(1)}K`;
    } else if (count > 9999) {
      return `${(count / 10000).toFixed(1)}M`;
    } else {
      return count;
    }
  }
}

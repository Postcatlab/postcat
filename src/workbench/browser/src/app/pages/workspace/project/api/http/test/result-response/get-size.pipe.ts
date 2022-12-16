import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteToString'
})
export class ByteToStringPipe implements PipeTransform {
  transform(inputByteLength: number): string {
    inputByteLength = inputByteLength || 0;
    let tmpSizeInt = '';
    if (inputByteLength < 0.1 * 1024) {
      //如果小于0.1KB转化成B
      tmpSizeInt = `${inputByteLength.toFixed(2)}B`;
    } else if (inputByteLength < 0.1 * 1024 * 1024) {
      //如果小于0.1MB转化成KB
      tmpSizeInt = `${(inputByteLength / 1024).toFixed(2)}KB`;
    } else if (inputByteLength < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB转化成MB
      tmpSizeInt = `${(inputByteLength / (1024 * 1024)).toFixed(2)}MB`;
    } else {
      //其他转化成GB
      tmpSizeInt = `${(inputByteLength / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    }
    const tmpSizeStr = tmpSizeInt.toString();
    const tmpLen = tmpSizeStr.indexOf('.');
    if (tmpSizeStr.substring(tmpLen + 1, 2) === '00') {
      return tmpSizeStr.substring(0, tmpLen) + tmpSizeStr.substring(tmpLen + 3, 2);
    }
    return tmpSizeStr;
  }
}

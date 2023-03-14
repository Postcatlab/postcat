import { cloneDeep } from 'lodash-es';
export interface ParamAttr {
  example: string;
}

export interface ChildList {
  name: string;
  isRequired: number;
  description: string;
  paramAttr: ParamAttr;
  dataType: number;
}

export interface RootObject {
  name: string;
  isRequired: number;
  paramAttr: ParamAttr;
  dataType: number;
  description: string;
  childList: ChildList[];
}

/**
 * @description Merge specified key
 * @param {RootObject[]} baseArr baseArr
 * @param {RootObject[]} newDataArr newDataArr
 * @param {string[]} mergerKey specified key
 * @param {string} childKey childList correspondence key
 * @param {boolean} childKey isChild
 * @return {RootObject[]} assginArr
 */

export const pcMerge = (
  baseArr: RootObject[],
  newDataArr: RootObject[],
  mergerKey: string[],
  childKey: string,
  isChild: boolean
): RootObject[] => {
  let handleData = !isChild ? cloneDeep(baseArr) : baseArr;
  for (let item of newDataArr) {
    //If you can't find this name, just push it
    if (handleData.findIndex(ele => ele.name === item.name) === -1) handleData.push(item);
    else {
      for (let ele of handleData) {
        if (item.name === ele.name) {
          //Assigns the specified key
          mergerKey.forEach(e => {
            ele[e] = item[e];
          });
          if (item[childKey] && item[childKey].length !== 0) {
            if (ele[childKey]) {
              //Subtree recursion
              pcMerge(ele[childKey], item[childKey], mergerKey, childKey, true);
            } else {
              ele[childKey] = item[childKey];
            }
          }
        }
      }
    }
  }
  return handleData;
};

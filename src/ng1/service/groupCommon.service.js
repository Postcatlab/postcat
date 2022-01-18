/**
 * @author EOAPI
 * @description 分组操作服务
 * @required Group_MultistageService
 */
angular
  .module("eolinker")
  .factory("Group_MultistageService", Group_MultistageService);

Group_MultistageService.$inject = ["GroupService"];

function Group_MultistageService(GroupService) {
  const data = {
    requestGroupOrder: [],
    time: {},
    service: GroupService,
    generalFun: {},
    fun: {
      clear: null,
      spreed: null,
      operate: null,
    },
    sort: {
      operate: null,
      init: null,
    },
  };
  const privateFun = {};
  let groupInfo = {
    locationArr: [],
    parentGroupPath: {},
    childGroupPath: {
      0: [],
    },
    groupObj: {},
  };
  data.generalFun.resetGroupInfo = function (originData) {
    if (originData) {
      groupInfo = originData;
    } else {
      groupInfo = {
        locationArr: [],
        parentGroupPath: {},
        childGroupPath: {
          0: [],
        },
        groupObj: {},
      };
    }
  };
  data.generalFun.getNextNotChildGroup = function (arg) {
    data.generalFun.resetGroupInfo(arg.groupInfo || groupInfo);
    const currentGroup = groupInfo.groupObj[arg.currentGroupID];
    const index = groupInfo.childGroupPath[currentGroup.parentGroupID].indexOf(
      currentGroup.groupID
    );
    if (
      index !==
      groupInfo.childGroupPath[currentGroup.parentGroupID].length - 1
    ) {
      // 当前分组如果不是父分组最后一个子分组，就返回下一个兄弟分组
      return groupInfo.childGroupPath[currentGroup.parentGroupID][index + 1];
    } else {
      // 当前分组如果是夫分组的最后一个分组，就返回下一个父分组的兄弟分组
      return privateFun.getParentNextBrotherGroup(currentGroup);
    }
  };
  data.generalFun.getGroupLastChildIndex = function (arg) {
    data.generalFun.resetGroupInfo(arg.groupInfo || groupInfo);
    const currentChildGroup =
      groupInfo.childGroupPath[arg.currentGroupID] || [];
    if (currentChildGroup.length) {
      const nextNotChildGroupID = data.generalFun.getNextNotChildGroup({
        currentGroupID: currentChildGroup[currentChildGroup.length - 1],
      });
      const nextNoChildGroupIndex =
        groupInfo.locationArr.indexOf(nextNotChildGroupID);
      return nextNoChildGroupIndex === -1
        ? groupInfo.locationArr.length - 1
        : nextNoChildGroupIndex - 1;
    } else {
      return groupInfo.locationArr.indexOf(arg.currentGroupID);
    }
  };
  /**
   * @name 获取父分组的下一个兄弟分组 ID，如果没有则返回空
   * @returns  groupID
   */
  privateFun.getParentNextBrotherGroup = function (currentGroup) {
    if (currentGroup.groupDepth < 2) return;
    const parentGroup = groupInfo.groupObj[currentGroup.parentGroupID];
    if (!parentGroup) {
      console.error(
        `child cant not find parent,groupID:${currentGroup.parentGroupID}`
      );
      return;
    }
    const lastDepthGroupArray =
      groupInfo.childGroupPath[parentGroup.parentGroupID];
    const parentNextGroupID =
      lastDepthGroupArray[
        lastDepthGroupArray.indexOf(currentGroup.parentGroupID) + 1
      ];
    if (parentNextGroupID && parentNextGroupID !== "0") {
      return parentNextGroupID;
    } else {
      return privateFun.getParentNextBrotherGroup(parentGroup);
    }
  };
  /**
   * @name 将分组插入到当前父分组的最后（作为当前层级的最后一个分组）
   */
  privateFun.insertGroupToParentLast = function (currentGroup) {
    if (currentGroup.parentGroupID && currentGroup.parentGroupID !== "0") {
      const lastChildIndex = data.generalFun.getGroupLastChildIndex({
        currentGroupID: currentGroup.parentGroupID,
      });
      groupInfo.locationArr.splice(lastChildIndex + 1, 0, currentGroup.groupID);
    } else {
      groupInfo.locationArr.push(currentGroup.groupID);
    }
  };
  /**
   * @name 将分组插入到当前父分组的最前（作为当前层级的第一个分组）
   */
  privateFun.insertGroupToParentTop = (currentGroup) => {
    groupInfo.locationArr.splice(
      groupInfo.locationArr.indexOf(currentGroup.parentGroupID) + 1,
      0,
      currentGroup.groupID
    );
  };
  privateFun.orderByGroupOrder = function (arg) {
    const { groupInfo } = arg;
    let groupOrder = {};
    try {
      groupOrder = JSON.parse(arg.groupOrder);
    } catch (e) {}
    if (angular.equals({}, groupOrder)) {
      return;
    }
    const sortGroupArr = [];
    const status =
      groupInfo.locationArr.length === 0 ? "rootGroup" : "childGroup";
    angular.forEach(groupOrder, (childVal, childKey) => {
      sortGroupArr[childVal] = childKey.toString();
    });
    if (status !== "rootGroup") {
      var index = groupInfo.locationArr.indexOf(arg.item.groupID) + 1;
      groupInfo.childGroupPath[arg.item.groupID] = [];
    } else {
      groupInfo.childGroupPath[0] = [];
    }
    arg.item = arg.item || {};
    angular.forEach(sortGroupArr, (childVal) => {
      if (childVal in groupInfo.groupObj) {
        const childGroup = groupInfo.groupObj[childVal];
        if (status === "rootGroup") {
          groupInfo.parentGroupPath[childVal] = ["0"];
          groupInfo.childGroupPath[0].push(childVal);
          groupInfo.locationArr.push(childVal);
        } else if (childGroup.parentGroupID === arg.item.groupID) {
          groupInfo.parentGroupPath[childVal] = [arg.item.groupID].concat(
            groupInfo.parentGroupPath[arg.item.groupID] || "0"
          );
          groupInfo.childGroupPath[arg.item.groupID].push(childVal);
          groupInfo.locationArr.splice(index, 0, childVal);
          index++;
        }
      }
    });
  };
  data.generalFun.openGroup = function (arg) {
    groupInfo = arg.groupInfo || groupInfo;
    arg.currentGroupID = arg.currentGroupID.toString();
    let index = groupInfo.locationArr.indexOf(arg.currentGroupID);
    if (index === -1) return;
    arg.list[index].isOpen = true;
    angular.forEach(groupInfo.childGroupPath[arg.currentGroupID], (id, key) => {
      index = groupInfo.locationArr.indexOf(id);
      if ((index !== -1 && !arg.showIDObj) || arg.showIDObj[id]) {
        arg.list[index].hideStatus = false;
      }
    });
  };
  privateFun.closeGroup = function (arg) {
    angular.forEach(
      groupInfo.childGroupPath[arg.currentGroupID],
      (val, key) => {
        const index = groupInfo.locationArr.indexOf(val);
        arg.list[index].isOpen = false;
        arg.list[index].hideStatus = true;
        if (groupInfo.childGroupPath[val]) {
          arg.currentGroupID = val;
          privateFun.closeGroup(arg);
        }
      }
    );
  };
  privateFun.deleteChildGroup = function (currentGroupID) {
    if (
      groupInfo.childGroupPath[currentGroupID] &&
      groupInfo.childGroupPath[currentGroupID].length
    ) {
      angular.forEach(groupInfo.childGroupPath[currentGroupID], (val, key) => {
        privateFun.deleteChildGroup(val);
      });
    }
    groupInfo.groupObj[currentGroupID] = null;
    groupInfo.childGroupPath[currentGroupID] = [];
    groupInfo.parentGroupPath[currentGroupID] = [];
  };
  data.generalFun.sortByLocationArr = function (arg) {
    data.generalFun.resetGroupInfo(arg.groupInfo || groupInfo);
    angular.forEach(groupInfo.locationArr, (val, key) => {
      arg.list[key] = groupInfo.groupObj[val];
    });
    const unnecessaryLength = arg.list.length - groupInfo.locationArr.length;
    if (unnecessaryLength > 0) {
      arg.list.splice(groupInfo.locationArr.length, unnecessaryLength);
    }
  };
  data.fun.addGroup = function (arg) {
    data.generalFun.resetGroupInfo(arg.groupInfo);
    privateFun.insertGroupToParentLast(arg.currentGroup);
    data.generalFun.openGroup({
      currentGroupID: arg.currentGroup.parentGroupID,
      list: arg.list,
      groupInfo,
      showIDObj: arg.showIDObj,
    });
    groupInfo.childGroupPath[arg.currentGroup.parentGroupID] =
      groupInfo.childGroupPath[arg.currentGroup.parentGroupID] || [];
    groupInfo.childGroupPath[arg.currentGroup.parentGroupID].push(
      arg.currentGroup.groupID
    );
    groupInfo.parentGroupPath[arg.currentGroup.groupID] = [
      arg.currentGroup.parentGroupID,
    ].concat(groupInfo.parentGroupPath[arg.currentGroup.parentGroupID]);
    groupInfo.groupObj[arg.currentGroup.groupID] = arg.currentGroup;
    data.generalFun.sortByLocationArr({
      list: arg.list,
    });
  };
  data.fun.deleteGroup = function (arg) {
    data.generalFun.resetGroupInfo(arg.groupInfo);
    const currentIndex = groupInfo.locationArr.indexOf(
      arg.currentGroup.groupID
    );
    const nextNoChildGroupID = data.generalFun.getNextNotChildGroup({
      currentGroupID: arg.currentGroup.groupID,
    });
    const groupLength = nextNoChildGroupID
      ? groupInfo.locationArr.indexOf(nextNoChildGroupID) - currentIndex
      : groupInfo.locationArr.length - currentIndex;
    groupInfo.locationArr.splice(currentIndex, groupLength);
    groupInfo.childGroupPath[arg.currentGroup.parentGroupID].splice(
      groupInfo.childGroupPath[arg.currentGroup.parentGroupID].indexOf(
        arg.currentGroup.groupID
      ),
      1
    );
    groupInfo.parentGroupPath[arg.currentGroup.groupID] = [];
    groupInfo.groupObj[arg.currentGroup.groupID] = null;
    privateFun.deleteChildGroup(arg.currentGroup.groupID);
    data.generalFun.sortByLocationArr({
      list: arg.list,
    });
  };
  data.generalFun.initGroupStatus = function (arg) {
    if (!arg.list || !arg.list.length) return;
    // 分组开关状态、子分组显示状态
    const initGroupDepth = arg.initGroupDepth === 0 ? 0 : 1;
    data.generalFun.resetGroupInfo(arg.groupInfo || groupInfo);
    const currentGroupID = (arg.currentGroupID || 0).toString();
    if (arg.status === "reset") {
      angular.forEach(arg.list, (val, key) => {
        val.isOpen = false;
        if (val.groupDepth > initGroupDepth) {
          val.hideStatus = true;
        } else {
          val.hideStatus = false;
        }
        if (arg.resetItemFun) {
          arg.resetItemFun(val);
        }
      });
    }
    if (arg.showIDObj) {
      angular.forEach(arg.list, (groupItem) => {
        if (!arg.showIDObj[groupItem.groupID]) {
          groupItem.hideStatus = true;
        } else {
          // 展开所有 showID group
          groupItem.hideStatus = false;
          groupItem.isOpen = true;
        }
      });
    } else {
      // 展开当前选中 group
      if (
        initGroupDepth !== 0 &&
        (Number(currentGroupID) < 0 ||
          currentGroupID === "0" ||
          !(currentGroupID in groupInfo.groupObj))
      )
        return;
      let index = 0;
      index = groupInfo.locationArr.indexOf(currentGroupID);
      arg.list[index].hideStatus = false;
      arg.list[index].isOpen = true;
      if (currentGroupID !== "0") {
        angular.forEach(
          groupInfo.parentGroupPath[currentGroupID],
          (val, key) => {
            if ((val && val !== "0") || initGroupDepth === 0) {
              index = groupInfo.locationArr.indexOf(val);
              arg.list[index].isOpen = true;
              arg.list[index].hideStatus = false;
              angular.forEach(
                groupInfo.childGroupPath[val],
                (childVal, childKey) => {
                  index = groupInfo.locationArr.indexOf(childVal);
                  arg.list[index].hideStatus = false;
                }
              );
            }
          }
        );
      }
      angular.forEach(groupInfo.childGroupPath[currentGroupID], (val, key) => {
        index = groupInfo.locationArr.indexOf(val);
        arg.list[index].hideStatus = false;
      });
    }
  };
  privateFun.generalGroupInfo = (groupList, rootOptions) => {
    data.generalFun.resetGroupInfo();
    rootOptions = rootOptions || {};
    groupList = groupList || [];
    angular.forEach(groupList, (val, key) => {
      val.groupID = (val.groupID || 0).toString();
      val.parentGroupID = (val.parentGroupID || 0).toString();
      if (!rootOptions.stayOpenStatus) {
        val.isOpen = false;
      }
      groupInfo.groupObj[val.groupID] = val;
    });
    groupList = angular.copy(groupList);
    const tmpGroupArr = groupList.sort((a, b) => {
      return a.groupDepth - b.groupDepth;
    });
    privateFun.orderByGroupOrder({
      groupInfo,
      groupOrder: rootOptions.rootGroupOrder,
    });
    angular.forEach(tmpGroupArr, (val) => {
      if (groupInfo.locationArr.indexOf(val.groupID) === -1) {
        if (val.parentGroupID && val.parentGroupID !== "0") {
          if (val.isInsertFirst) {
            privateFun.insertGroupToParentTop(val);
            groupInfo.childGroupPath[val.parentGroupID]
              ? groupInfo.childGroupPath[val.parentGroupID].unshift(val.groupID)
              : (groupInfo.childGroupPath[val.parentGroupID] = [val.groupID]);
          } else {
            privateFun.insertGroupToParentLast(val);
            groupInfo.childGroupPath[val.parentGroupID]
              ? groupInfo.childGroupPath[val.parentGroupID].push(val.groupID)
              : (groupInfo.childGroupPath[val.parentGroupID] = [val.groupID]);
          }
          groupInfo.parentGroupPath[val.groupID] = [val.parentGroupID].concat(
            groupInfo.parentGroupPath[val.parentGroupID]
          );
        } else {
          groupInfo.parentGroupPath[val.groupID] = ["0"];
          groupInfo.childGroupPath[0].push(val.groupID);
          groupInfo.locationArr.push(val.groupID);
        }
      }
      privateFun.orderByGroupOrder({
        groupInfo,
        groupOrder: val.groupOrder,
        item: val,
      });
    });
    return groupInfo;
  };
  data.fun.generalGroupInfo = function (arg) {
    return privateFun.generalGroupInfo(arg.list, {
      stayOpenStatus: true,
    });
  };
  data.sort.init = function (response, currentGroupID, options) {
    let groupList = [];
    options = options || {};
    if (options.responseKey) {
      groupList = response[options.responseKey];
    } else {
      groupList = response.groupList;
    }
    if (!groupList) {
      return {
        groupList: [],
        groupInfo: {},
      };
    }
    const tmpOutput = [];
    privateFun.generalGroupInfo(groupList, {
      rootGroupOrder: response.groupOrder,
    });
    angular.forEach(groupInfo.locationArr, (val, key) => {
      tmpOutput.push(groupInfo.groupObj[val]);
    });
    data.generalFun.initGroupStatus({
      currentGroupID,
      status: "reset",
      initGroupDepth: options.initGroupDepth,
      list: tmpOutput,
    });
    return {
      groupList: tmpOutput,
      groupInfo,
    };
  };
  /**
   * 父分组展开功能函数
   * @param {object} arg 参数，eg:{$event:dom,item:单击所处父分组项}
   */
  data.fun.spreed = function (arg) {
    if (arg.$event) {
      arg.$event.stopPropagation();
    }
    data.generalFun.resetGroupInfo(arg.groupInfo);
    const params = {
      currentGroupID: arg.item.groupID,
      list: arg.list,
    };
    if (arg.showIDObj && Object.keys(arg.showIDObj).length) {
      params.showIDObj = arg.showIDObj;
    }
    if (arg.item.isOpen) {
      const index = groupInfo.locationArr.indexOf(arg.item.groupID);
      arg.list[index].isOpen = false;
      privateFun.closeGroup(params);
    } else {
      data.generalFun.openGroup(params);
    }
  };
  data.fun.clear = function () {
    data.service.clear();
  };
  data.fun.getGroupPath = function (arg) {
    if (!arg.currentGroupID) return;
    data.generalFun.resetGroupInfo(arg.groupInfo);
    const template = {
      output: [],
    };
    const currentGroupID = arg.currentGroupID.toString();
    const currentGroup = groupInfo.groupObj[currentGroupID];
    if (
      groupInfo.parentGroupPath[currentGroupID] &&
      groupInfo.parentGroupPath[currentGroupID].length
    ) {
      angular.forEach(groupInfo.parentGroupPath[currentGroupID], (val, key) => {
        if (val === "0") return;
        const group = groupInfo.groupObj[val];
        if (!group) return;
        template.output.unshift({
          groupName: group.groupName,
          groupID: group.groupID,
        });
      });
      template.output.push({
        groupName: currentGroup.groupName,
        groupID: currentGroup.groupID,
      });
      if (
        groupInfo.childGroupPath &&
        groupInfo.childGroupPath[-1] &&
        currentGroupID !== "0"
      ) {
        template.output.unshift({
          groupName: "根目录",
          groupID: "-1",
        });
      }
    }
    switch (arg.resultType) {
      case "string": {
        let groupPathStr = "";
        template.output.forEach((val) => {
          groupPathStr += (groupPathStr ? " / " : "") + val.groupName;
        });
        return groupPathStr;
      }
      default: {
        return template.output;
      }
    }
  };
  return data;
}

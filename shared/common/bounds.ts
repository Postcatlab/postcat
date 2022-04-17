/**
 * 边栏放置位置
 */
export enum SidePosition {
  left = 'left',
  right = 'right',
  top = 'top',
  bottom = 'bottom'
};

/**
 * 视图区域
 */
export enum ViewZone {
  top = 'top',
  bottom = 'bottom',
  side = 'side',
  main = 'main'
}

/**
 * 视图尺寸、位置
 */
export interface ViewBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 获取某个显示区域的bounds
 * @param zone
 * @param width
 * @param height
 * @param sidePosition
 */
export const getViewBounds = (zone: ViewZone, width: number, height: number, sidePosition?: SidePosition, sideWidth?: number): ViewBounds => {
  return calculateViewBounds(width, height, sidePosition, sideWidth).get(zone);
};

/**
 * 根据容器的尺寸计算所有显示区域的尺寸与位置
 * TODO：需要加上隐藏边栏的属性参数判断
 * @param width
 * @param height
 * @param sidePosition
 */
export const calculateViewBounds = (width: number, height: number, sidePosition?: SidePosition, sideWidth?: number): Map<ViewZone, ViewBounds> => {
  const position: SidePosition = sidePosition || SidePosition.left;
  const _topHeight: number = 50;
  const _bottomHeight: number = 30;
  const _sideWidth: number = sideWidth || 50;
  const _mainHeight: number = height - _topHeight - _bottomHeight;
  let topBounds: ViewBounds = {x: 0, y: 0, width: width, height: _topHeight};
  let bottomBounds: ViewBounds = {x: 0, y: (height - _bottomHeight), width: width, height: _bottomHeight};
  let sideBounds: ViewBounds = {x: 0, y: 0, width: _sideWidth, height: _mainHeight };
  let mainBounds: ViewBounds = {x: 0, y: 0, width: width, height: _mainHeight};
  switch (position) {
    case SidePosition.left:
      sideBounds.y = topBounds.height;
      mainBounds.x = sideBounds.width;
      mainBounds.y = topBounds.height;
      mainBounds.width -= mainBounds.x;
      break;
    case SidePosition.right:
      sideBounds.y = topBounds.height;
      sideBounds.x = width - sideBounds.width;
      mainBounds.y = topBounds.height;
      mainBounds.width = sideBounds.x;
      break;
    case SidePosition.top:
      sideBounds.height = sideBounds.width;
      sideBounds.width = width;
      sideBounds.y = topBounds.height;
      mainBounds.height = height - topBounds.height - sideBounds.height - bottomBounds.height;
      mainBounds.y = topBounds.height + sideBounds.height;
      break;
    case SidePosition.bottom:
      sideBounds.height = sideBounds.width;
      sideBounds.width = width;
      mainBounds.y = topBounds.height;
      mainBounds.height -= sideBounds.height;
      sideBounds.y = topBounds.height + mainBounds.height;
      break;
  }
  return new Map([
    [ViewZone.top, topBounds],
    [ViewZone.bottom, bottomBounds],
    [ViewZone.side, sideBounds],
    [ViewZone.main, mainBounds]
  ]);
};

/**
 * 边栏放置位置
 */
export enum SlidePosition {
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
  slide = 'slide',
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
 * @param slidePosition
 */
export const getViewBounds = (zone: ViewZone, width: number, height: number, slidePosition?: SlidePosition): ViewBounds => {
  return calculateViewBounds(width, height, slidePosition).get(zone);
};

/**
 * 根据容器的尺寸计算所有显示区域的尺寸与位置
 * 待做：需要加上隐藏边栏的属性参数判断
 * @param width
 * @param height
 * @param slidePosition
 */
export const calculateViewBounds = (width: number, height: number, slidePosition?: SlidePosition): Map<ViewZone, ViewBounds> => {
  const position: SlidePosition = slidePosition || SlidePosition.left;
  const _topHeight: number = 50;
  const _bottomHeight: number = 30;
  const _slideWidth: number = 50;
  const _mainHeight: number = height - _topHeight - _bottomHeight;
  let topBounds: ViewBounds = {x: 0, y: 0, width: width, height: _topHeight};
  let bottomBounds: ViewBounds = {x: 0, y: (height - _bottomHeight), width: width, height: _bottomHeight};
  let slideBounds: ViewBounds = {x: 0, y: 0, width: _slideWidth, height: _mainHeight };
  let mainBounds: ViewBounds = {x: 0, y: 0, width: width, height: _mainHeight};
  switch (position) {
    case SlidePosition.left:
      slideBounds.y = topBounds.height;
      mainBounds.x = slideBounds.width;
      mainBounds.y = topBounds.height;
      mainBounds.width -= mainBounds.x;
      break;
    case SlidePosition.right:
      slideBounds.y = topBounds.height;
      slideBounds.x = width - slideBounds.width;
      mainBounds.y = topBounds.height;
      mainBounds.width = slideBounds.x;
      break;
    case SlidePosition.top:
      slideBounds.height = slideBounds.width;
      slideBounds.width = width;
      slideBounds.y = topBounds.height;
      mainBounds.height = height - topBounds.height - slideBounds.height - bottomBounds.height;
      mainBounds.y = topBounds.height + slideBounds.height;
      break;
    case SlidePosition.bottom:
      slideBounds.height = slideBounds.width;
      slideBounds.width = width;
      mainBounds.y = topBounds.height;
      mainBounds.height -= slideBounds.height;
      slideBounds.y = topBounds.height + mainBounds.height;
      break;
  }
  return new Map([
    [ViewZone.top, topBounds],
    [ViewZone.bottom, bottomBounds],
    [ViewZone.slide, slideBounds],
    [ViewZone.main, mainBounds]
  ]);
};

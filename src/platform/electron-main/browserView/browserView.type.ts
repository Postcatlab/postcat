import { ViewBounds } from 'eo/shared/common/bounds';

export interface BrowserViewOpts {
  bounds: ViewBounds;
  partition?: string;
  preloadPath?: string;
  viewPath: string;
  preload?: string;
}

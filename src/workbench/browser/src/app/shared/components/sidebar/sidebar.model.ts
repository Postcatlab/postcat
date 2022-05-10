/**
 * Sidebar offical module
 */
export interface SidebarModuleInfo {
  // app
  name: string;
  //icon or logo image 
  logo:string;
  // 模块ID，用于关联
  moduleID: string;
  // 模块名称，用于显示
  moduleName: string;
  //is offcial app
  isOffical: boolean;
  // module route
  route: string;
  // route active when match string
  activeRoute: string;
}

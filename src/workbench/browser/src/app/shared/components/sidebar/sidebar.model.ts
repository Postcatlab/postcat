/**
 * Sidebar offical module
 */
export interface SidebarModuleInfo {
  /**
   * icon or logo image
   **/
  logo: string;
  /**
   * unique extension id
   **/
  id: string;
  /**
   * showname
   **/
  title: string;
  /**
   * is offcial app
   **/
  isOffical: boolean;
  /**
   *  module route,click sidebar will navigate this route
   **/
  route: string;
  /**
   *  sidebar active when match activeRoute
   **/
  activeRoute: string;
}

// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  moduleName: string;
  icon: string;
  class: string;
  color: string;
  style: string;
  groupTitle: boolean;
  submenu: RouteInfo[];
}

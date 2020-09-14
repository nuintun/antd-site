import memoize from 'memoize-one';
import { urlToList } from '~js/utils/utils';
import { MenuItem } from '~js/utils/getRouter';

/**
 * @function walkMenuData
 * @param {MenuItem[]} menuData
 * @param {FlatMenuData} flatMenus
 * @returns {FlatMenuData}
 */
function walkMenuData(menuData: MenuItem[], flatMenuData: MenuItem[]): MenuItem[] {
  for (const menu of menuData) {
    flatMenuData.push(menu);

    const { children } = menu;

    if (children) {
      walkMenuData(children, flatMenuData);
    }
  }

  return flatMenuData;
}

type getFlatMenuData = (menuData: MenuItem[]) => MenuItem[];

/**
 * @function getFlatMenuData
 * @description 扁平化菜单路由
 * @example [{ path: string }, { path: string }] => [path, path2]
 * @param {MenuItem[]} menuData
 * @returns {string[]}
 */
export const getFlatMenuData: getFlatMenuData = memoize((menuData: MenuItem[]): MenuItem[] => {
  return walkMenuData(menuData, []);
});

type isMenuKey = (key: string, flatMenuData: MenuItem[]) => boolean;

/**
 * @function isMenuKey
 * @description 指定标识为否为菜单标识
 * @param {string} key
 * @param {MenuItem[]} flatMenuData
 */
export const isMenuKey: isMenuKey = memoize((key: string, flatMenuData: MenuItem[]): boolean => {
  if (!key) return false;

  return flatMenuData.some((menu: MenuItem) => key === menu.key);
});

export interface ExpandKeys {
  openKeys: string[];
  selectedKeys: string[];
}

type getExpandKeysFromRouteMath = (path: string | undefined, flatMenuData: MenuItem[]) => ExpandKeys;

/**
 * @function getExpandKeysFromRouteMath
 * @description 通过当前路由获取菜单展开项标识列表
 * @param {string|undefined} path
 * @param {MenuItem[]} flatMenuPaths
 * @returns {MenuKeys}
 */
export const getExpandKeysFromRouteMath: getExpandKeysFromRouteMath = memoize(
  (path: string | undefined, flatMenuData: MenuItem[]): ExpandKeys => {
    const openKeys: string[] = [];
    const selectedKeys: string[] = [];

    if (path) {
      const paths: string[] = urlToList(path.toLowerCase());

      for (const path of paths) {
        for (const menu of flatMenuData) {
          if (path === menu.path) {
            if (menu.children) {
              openKeys.push(menu.key);
            } else {
              selectedKeys.push(menu.key);
            }
          }
        }
      }
    }

    return { openKeys, selectedKeys };
  }
);

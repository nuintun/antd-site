/**
 * @module getRouter
 * @description 通过初始路由配置获取标准路由，菜单，面包屑数据
 */

import React from 'react';
import isURL from './isURL';
import { isDevelopment } from './utils';

export interface Route {
  name: string;
  path: string;
  href?: string;
  icon?: string;
  exact?: boolean;
  strict?: boolean;
  children?: Route[];
  sensitive?: boolean;
  hideInMenu?: boolean;
  hideChildrenInMenu?: boolean;
  component?: React.ComponentType<any>;
  [key: string]: any;
}

interface RouteNode extends Route {
  href: string;
}

export interface RouteItem {
  key: string;
  name: string;
  path: string;
  exact: boolean;
  strict: boolean;
  sensitive: boolean;
  component: React.ComponentType<any>;
  [key: string]: any;
}

export interface BreadcrumbItem {
  key: string;
  name: string;
  path: string;
  href?: string;
  icon?: string;
  [key: string]: any;
}

export interface MenuItem {
  key: string;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  [key: string]: any;
}

export interface Router {
  menus: MenuItem[];
  routes: RouteItem[];
  breadcrumbs: { [path: string]: BreadcrumbItem };
}

type callback = (route: RouteNode, referrer?: RouteNode) => void;

/**
 * @function isAbsolute
 * @param {string} url
 * @returns {boolean}
 */
function isAbsolute(url: string): boolean {
  return /^\//.test(url) || isURL(url);
}

/**
 * @function normalizeURL
 * @param {string} path
 * @param {string} type
 * @param {Route} [referrer]
 * @returns {string}
 */
function normalizeURL(path: string, type: string, referrer?: Route): string {
  if (isDevelopment && !path) {
    throw new RangeError(`route path can't be empty`);
  }

  if (!referrer || isAbsolute(path)) return path;

  const sep: string = /\/$/.test(referrer[type]) ? '' : '/';

  return `${referrer[type]}${sep}${path}`;
}

/**
 * @function walkRouter
 * @param {Route} route
 * @param {callback} callback
 * @param {RouteNode} [referrer]
 */
function walkRouter(route: Route, callback: callback, referrer?: RouteNode): void {
  const path: string = normalizeURL(route.path, 'path', referrer);
  const href: string = route.href ? normalizeURL(route.href, 'href', referrer) : path;
  const routeNode: RouteNode = { ...route, path, href };

  callback(routeNode, referrer);

  const { children }: Route = route;

  if (children) {
    children.map((item: Route) => walkRouter(item, callback, routeNode));
  }
}

/**
 * @function getRouter
 * @description 获取路由
 * @param {object} router
 * @returns {Router}
 */
export default function getRouter(router: Route[]): Router {
  const menus: MenuItem[] = [];
  const routes: RouteItem[] = [];
  const breadcrumbs: { [path: string]: BreadcrumbItem } = {};

  router.forEach(route => {
    const root: string = '';
    const menusMap: { [path: string]: MenuItem[] } = { [root]: [] };

    walkRouter(route, (route: RouteNode, referrer: RouteNode): void => {
      const {
        name,
        icon,
        path,
        href,
        exact,
        strict,
        children,
        component,
        sensitive,
        hideInMenu,
        hideChildrenInMenu,
        ...rest
      }: Route = route;
      const key: string = href.toLowerCase();

      if (component) {
        routes.push({
          key,
          name,
          path,
          component,
          exact: exact !== false,
          strict: strict !== false,
          sensitive: sensitive === true,
          ...rest
        });
      }

      breadcrumbs[key] = { key, name, path, icon, ...rest };

      if (component) {
        breadcrumbs[key].href = href;
      }

      if (!hideInMenu) {
        const rpath: string = referrer ? referrer.path : root;
        const menu: MenuItem = { key, name, path, href, icon, ...rest };

        if (!hideChildrenInMenu && children) {
          menu.children = menusMap[path] = [];
        }

        if (menusMap[rpath]) {
          menusMap[rpath].push(menu);
        }
      }
    });

    menus.push(...menusMap[root]);
  });

  return { routes, menus, breadcrumbs };
}

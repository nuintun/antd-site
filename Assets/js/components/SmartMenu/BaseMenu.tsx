import './index.less';

import React from 'react';
import { Menu } from 'antd';
import { Location } from 'history';
import { MenuProps } from 'antd/es/menu';
import { Link, match } from 'react-router-dom';
import { MenuItem } from '~js/utils/getRouter';
import { ExpandKeys, getExpandKeysFromRouteMath, getFlatMenuData, isMenuKey } from './SmartMenuUtils';

const { SubMenu, Item }: typeof Menu = Menu;

export interface BaseMenuProps
  extends Omit<MenuProps, 'mode' | 'openKeys' | 'selectedKeys' | 'inlineIndent' | 'inlineCollapsed'> {
  match: match;
  icon?: string;
  location: Location;
  collapsed?: boolean;
  menuData: MenuItem[];
  menuItemRender?: (menu: MenuItem & { replace: boolean }) => React.ReactNode;
}

interface BaseMenuState {
  pathname: string;
  openKeys: string[];
  collapsed: boolean;
  menuData: MenuItem[];
  selectedKeys: string[];
  cachedOpenKeys: string[];
}

const defaultIconRender = (icon?: string): React.ReactNode => {
  if (!icon) return null;

  return <img className="anticon ui-sider-menu-icon" src={icon} alt="icon" />;
};

const defaultTitleRender = ({ name, icon }: MenuItem): React.ReactNode => {
  if (icon) {
    return (
      <>
        {defaultIconRender(icon)}
        <span>{name}</span>
      </>
    );
  }

  return name;
};

export default class BaseMenu extends React.PureComponent<BaseMenuProps, BaseMenuState> {
  static defaultProps: Pick<BaseMenuProps, 'collapsed'> = {
    collapsed: false
  };

  static getDerivedStateFromProps(props: BaseMenuProps, state: BaseMenuState): Partial<BaseMenuState> | null {
    const { match, collapsed, location, menuData }: BaseMenuProps = props;
    const { pathname }: Location = location;

    if (pathname !== state.pathname || menuData !== state.menuData) {
      const flatMenuData: MenuItem[] = getFlatMenuData(menuData);

      let { openKeys, selectedKeys }: ExpandKeys = getExpandKeysFromRouteMath(match.path, flatMenuData);

      const cachedOpenKeys = [...state.openKeys.filter(key => isMenuKey(key, flatMenuData)), ...openKeys];

      openKeys = collapsed ? [] : cachedOpenKeys;
      selectedKeys = [...state.selectedKeys, ...selectedKeys];

      return { pathname, collapsed, openKeys, menuData, selectedKeys, cachedOpenKeys };
    }

    if (collapsed !== state.collapsed) {
      if (collapsed) {
        const { openKeys }: BaseMenuState = state;

        return { collapsed, openKeys: [], cachedOpenKeys: openKeys };
      } else {
        const { cachedOpenKeys }: BaseMenuState = state;

        return { collapsed, openKeys: cachedOpenKeys };
      }
    }

    return null;
  }

  state: BaseMenuState = {
    pathname: '',
    menuData: [],
    cachedOpenKeys: [],
    collapsed: !!this.props.collapsed,
    openKeys: this.props.defaultOpenKeys ?? [],
    selectedKeys: this.props.defaultSelectedKeys ?? []
  };

  cachedOpenKeys: string[] = [];

  onOpenChange = (openKeys: string[]) => {
    const { onOpenChange }: BaseMenuProps = this.props;

    this.setState({ openKeys });

    onOpenChange && onOpenChange(openKeys);
  };

  getItem(menu: MenuItem) {
    const { name, icon, href, target }: MenuItem = menu;
    const { location, menuItemRender }: BaseMenuProps = this.props;
    const replace: boolean = href === location.pathname + location.search + location.hash;

    if (menuItemRender) {
      return menuItemRender({ ...menu, replace });
    }

    return (
      <Link to={href} replace={replace} target={target}>
        {defaultIconRender(icon)}
        <span>{name}</span>
      </Link>
    );
  }

  getSubMenuOrItem(menu: MenuItem): React.ReactElement {
    const { key, children } = menu;

    if (children && children.length) {
      return (
        <SubMenu key={key} title={defaultTitleRender(menu)}>
          {this.getMenuItems(children)}
        </SubMenu>
      );
    }

    return <Item key={key}>{this.getItem(menu)}</Item>;
  }

  getMenuItems(menuData: MenuItem[]): React.ReactElement[] {
    return menuData.map(menu => this.getSubMenuOrItem(menu));
  }

  render() {
    const { openKeys, selectedKeys }: BaseMenuState = this.state;
    const { match, location, collapsed, menuData, ...restProps }: BaseMenuProps = this.props;

    return (
      <Menu
        {...restProps}
        mode="inline"
        inlineIndent={16}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={this.onOpenChange}
      >
        {this.getMenuItems(menuData)}
      </Menu>
    );
  }
}

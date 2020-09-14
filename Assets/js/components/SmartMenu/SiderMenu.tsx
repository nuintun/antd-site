import React from 'react';
import { Layout } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { SiderProps } from 'antd/es/layout/Sider';
import BaseMenu, { BaseMenuProps } from './BaseMenu';

const { Sider }: typeof Layout = Layout;

export const defaultRenderLogo = (logo?: string): React.ReactNode => {
  if (!logo) return null;

  return <img src={logo} alt="logo" />;
};

export interface SiderMenuProps extends BaseMenuProps, Pick<SiderProps, 'trigger' | 'onCollapse'> {
  logo?: string;
  title?: string;
  width?: number;
  isMobile?: boolean;
  collapsedWidth?: number;
}

export default class SiderMenu extends React.PureComponent<SiderMenuProps> {
  static defaultProps: Pick<SiderMenuProps, 'width' | 'theme' | 'trigger' | 'collapsed' | 'collapsedWidth'> = {
    width: 256,
    trigger: null,
    theme: 'light',
    collapsed: false,
    collapsedWidth: 80
  };

  render() {
    const {
      logo,
      style,
      theme,
      title,
      width,
      trigger,
      isMobile,
      className,
      collapsed,
      onCollapse,
      inlineIndent,
      collapsedWidth,
      ...restProps
    }: SiderMenuProps = this.props;

    return (
      <Sider
        collapsible
        width={width}
        theme={theme}
        style={style}
        trigger={trigger}
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsedWidth={collapsedWidth}
        className={classnames('ui-sider-menu-sider', 'fix-sider-bar', theme, className)}
      >
        <div className="ui-sider-menu-logo">
          <Link to="/">
            {defaultRenderLogo(logo)}
            <h1>{title}</h1>
          </Link>
        </div>
        <BaseMenu {...restProps} theme={theme} collapsed={collapsed} className="ui-sider-menu" inlineIndent={inlineIndent} />
      </Sider>
    );
  }
}

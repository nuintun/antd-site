import './index.less';

import React from 'react';
import { Drawer } from 'antd';
import SiderMenu, { SiderMenuProps } from './SiderMenu';

const SmartMenu = (props: SiderMenuProps) => {
  const { width, isMobile, collapsed, onCollapse, ...restProps }: SiderMenuProps = props;

  const onClose = React.useCallback(() => {
    onCollapse && onCollapse(true, 'clickTrigger');
  }, [onCollapse]);

  if (isMobile) {
    return (
      <Drawer
        width={width}
        closable={false}
        placement="left"
        onClose={onClose}
        visible={!collapsed}
        className="ui-sider-menu"
        style={{ padding: 0, height: '100vh' }}
      >
        <SiderMenu {...restProps} width={width} collapsed={false} isMobile={isMobile} onCollapse={onCollapse} />
      </Drawer>
    );
  }

  return <SiderMenu {...restProps} width={width} isMobile={isMobile} collapsed={collapsed} onCollapse={onCollapse} />;
};

export default SmartMenu;

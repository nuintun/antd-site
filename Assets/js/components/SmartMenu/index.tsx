import './index.less';

import React, { useCallback } from 'react';
import { Drawer } from 'antd';
import SiderMenu, { SiderMenuProps } from './SiderMenu';

const SmartMenu = (props: SiderMenuProps) => {
  const { width, isMobile, collapsed, onCollapse, ...restProps }: SiderMenuProps = props;

  const onClose = useCallback(() => {
    onCollapse && onCollapse(true, 'clickTrigger');
  }, [onCollapse]);

  const onChange = useCallback(
    (visible: boolean): void => {
      if (visible && onCollapse) {
        onCollapse(false, 'clickTrigger');
      }
    },
    [onCollapse]
  );

  if (isMobile) {
    return (
      <Drawer
        width={width}
        closable={false}
        placement="left"
        onClose={onClose}
        onChanage={onChange}
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

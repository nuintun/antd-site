import React from 'react';
import { history } from '~js/utils/utils';
import { Button, DatePicker, Result } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import { MenuItem } from '~js/utils/getRouter';
import SmartMenu from '~js/components/SmartMenu';

function backHome() {
  history.push('/');
}

export default class Page extends React.PureComponent<RouteComponentProps & { menuData: MenuItem[] }> {
  state = {
    collapsed: false
  };

  onCollapse = (collapsed: boolean) => {
    console.log(collapsed)
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    const { match, location, menuData }: RouteComponentProps & { menuData: MenuItem[] } = this.props;

    return (
      <>
        <SmartMenu
          match={match}
          title="狐聊管理后台"
          menuData={menuData}
          location={location}
          collapsed={collapsed}
          onCollapse={this.onCollapse}
          logo={require('~images/favicon.ico')}
        />
        <Result
          title="403"
          status="403"
          subTitle="对不起，您无权访问此页面！"
          extra={
            <>
              <Button type="primary" onClick={backHome}>
                返回首页
              </Button>
              <DatePicker />
            </>
          }
        />
      </>
    );
  }
}

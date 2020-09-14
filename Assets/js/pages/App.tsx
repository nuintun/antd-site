import React from 'react';
import 'dayjs/locale/zh-cn';
import { render } from 'react-dom';
import { ConfigProvider } from 'antd';
import router from '~js/config/router';
import zhCN from 'antd/es/locale/zh_CN';
import { history } from '~js/utils/utils';
import getRouter from '~js/utils/getRouter';
import { Router, Route, Switch } from 'react-router-dom';

const { routes, menus, breadcrumbs } = getRouter(router);

console.log({ routes, menus, breadcrumbs }, location.pathname);

export default function Page() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {routes.map(({ component: Component, ...restProps }) => (
            <Route {...restProps} render={restProps => <Component {...restProps} menuData={menus} />} />
          ))}
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

render(<Page />, document.getElementById('root'));

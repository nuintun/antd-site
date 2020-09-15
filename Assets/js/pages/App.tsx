import React from 'react';
import 'dayjs/locale/zh-cn';
import { render } from 'react-dom';
import NotFound from '~js/pages/404';
import { ConfigProvider } from 'antd';
import router from '~js/config/router';
import zhCN from 'antd/es/locale/zh_CN';
import { history } from '~js/utils/utils';
import SmartMenu from '~js/components/SmartMenu';
import getRouter, { RouteItem } from '~js/utils/getRouter';
import { matchPath, Route, Router, Switch, useHistory, useLocation } from 'react-router-dom';

const { routes, menus, breadcrumbs } = getRouter(router);

const withLayoutRoutes: RouteItem[] = [];
const skipLayoutRoutes: RouteItem[] = [];

routes.forEach((route: RouteItem) => {
  if (route.skipLayout) {
    skipLayoutRoutes.push(route);
  } else {
    withLayoutRoutes.push(route);
  }
});

console.log({ routes, menus, breadcrumbs }, location.pathname);

const getMatchRoute = (routes: RouteItem[]) => {
  for (const route of routes) {
    const match = matchPath(location.pathname, route);

    if (match) {
      return { route, match };
    }
  }

  return null;
};

function WithLayoutPage(): React.ReactElement {
  const history = useHistory();
  const location = useLocation();
  const props = getMatchRoute(withLayoutRoutes);
  const [collapsed, setCollapsed] = React.useState(false);
  const onCollapse = React.useCallback(collapsed => setCollapsed(collapsed), []);

  if (props) {
    const { route, match } = props;
    const { component: Component }: RouteItem = route;

    return (
      <>
        <SmartMenu
          match={match}
          menuData={menus}
          history={history}
          title="狐聊管理后台"
          location={location}
          collapsed={collapsed}
          onCollapse={onCollapse}
          logo={require('~images/favicon.ico')}
        />
        <Component match={match} history={history} location={location} breadcrumbs={breadcrumbs} />
      </>
    );
  }

  return <NotFound />;
}

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {skipLayoutRoutes.map(route => (
            <Route {...route} />
          ))}
          <Route>
            <WithLayoutPage />
          </Route>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

render(<App />, document.getElementById('root'));

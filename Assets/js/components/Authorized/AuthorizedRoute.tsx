import React from 'react';
import Authorized from './Authorized';
import { Redirect, Route } from 'react-router-dom';
import { IAuthorityType } from './CheckPermissions';

interface AuthorizedRouteProps {
  redirectPath: string;
  currentAuthority: string;
  authority: IAuthorityType;
  render: (props: any) => React.ReactNode;
  component: React.ComponentClass<any, any>;
}

const AuthorizedRoute: React.FunctionComponent<AuthorizedRouteProps> = ({
  render,
  authority,
  redirectPath,
  component: Component,
  ...rest
}) => (
  <Authorized authority={authority} noMatch={<Route {...rest} render={() => <Redirect to={{ pathname: redirectPath }} />} />}>
    <Route {...rest} render={(props: any) => (Component ? <Component {...props} /> : render(props))} />
  </Authorized>
);

export default AuthorizedRoute;

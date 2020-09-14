import React from 'react';
import { Result } from 'antd';
import Secured from './Secured';
import AuthorizedRoute from './AuthorizedRoute';
import check, { IAuthorityType } from './CheckPermissions';

interface AuthorizedProps {
  authority: IAuthorityType;
  noMatch?: React.ReactNode;
}

type IAuthorizedType = React.FunctionComponent<AuthorizedProps> & {
  check: typeof check;
  Secured: typeof Secured;
  AuthorizedRoute: typeof AuthorizedRoute;
};

const Authorized: React.FunctionComponent<AuthorizedProps> = ({
  children,
  authority,
  noMatch = <Result status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />
}) => {
  const childrenRender: React.ReactNode = typeof children === 'undefined' ? null : children;
  const dom = check(authority, childrenRender, noMatch);

  return <>{dom}</>;
};

export default Authorized as IAuthorizedType;

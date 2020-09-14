import React from 'react';
import { Button, Result } from 'antd';
import { history } from '~js/utils/utils';

function backHome() {
  history.push('/');
}

export default function Page() {
  return (
    <Result
      title="403"
      status="403"
      subTitle="对不起，您无权访问此页面！"
      extra={
        <Button type="primary" onClick={backHome}>
          返回首页
        </Button>
      }
    />
  );
}

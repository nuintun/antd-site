import React from 'react';
import { Button, Result } from 'antd';
import { history } from '~js/utils/utils';

function backHome() {
  history.push('/');
}

export default function Page() {
  return (
    <Result
      title="404"
      status="404"
      subTitle="对不起，您访问的页面不存在！"
      extra={
        <Button type="primary" onClick={backHome}>
          返回首页
        </Button>
      }
    />
  );
}

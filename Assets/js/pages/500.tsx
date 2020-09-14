import React from 'react';
import { Button, Result } from 'antd';
import { history } from '~js/utils/utils';

function backHome() {
  history.push('/');
}

export default function Page(): React.ReactElement {
  return (
    <Result
      title="500"
      status="500"
      subTitle="对不起，服务器错误！"
      extra={
        <Button type="primary" onClick={backHome}>
          返回首页
        </Button>
      }
    />
  );
}

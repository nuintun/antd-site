import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export default class Page extends React.PureComponent<RouteComponentProps> {
  render() {
    return <div style={{ textAlign: 'center', lineHeight: '600px' }}>{this.props.location.pathname}</div>;
  }
}

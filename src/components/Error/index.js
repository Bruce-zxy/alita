import React, { Component } from 'react';
import { Toast } from 'antd-mobile';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: '' };
  }

  static getDerivedStateFromError(error) {
      console.log(error.message);
      
    // Update state so the next render will show the fallback UI.
    return { error: error.message };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);

    const ErrorTips = () => (
      <div>
        <p>【程序无法进行】</p>
        <p>这有可能是因为网络或者程序的原因导致的意外！</p>
      </div>
    )
    Toast.offline(<ErrorTips />, 5)

  }

  render() {
    const { error } = this.state;
    if (error) {
      // You can render any custom fallback UI
      return (
        <div>
          【错误信息：】<b>{error}, 请您刷新页面后重新访问！</b>
        </div>
      )
    }

    return this.props.children; 
  }
}
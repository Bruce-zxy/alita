import React, { Component } from 'react';

export default ({ location }) => {
    return (
    <div>
      <h3>
        未找到<code>{location.pathname}</code>的页面
      </h3>
    </div>
  );
}
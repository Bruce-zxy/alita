import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import initReactFastclick from 'react-fastclick';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';

import * as moment from 'moment';
import 'moment/locale/zh-cn';

import ErrorBoundary from './components/Error';
import NoMatch from './components/NoMatch';
import Routes from './config/route';

import { LOCAL_URL, LOCAL_URL_SHOW } from './config/common';

initReactFastclick();
moment.locale('zh-cn');

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${localStorage.getItem('u_token')}`
      }
    });
  }
});

// const client = new ApolloClient({
//   uri: "https://48p1r2roz4.sse.codesandbox.io"
// });

const NORMAL_COLOR = "#555555";
const ACTIVE_COLOR = "#0572E4";

const gTabBar = [{
    name: '选项目',
    page: 'HOME',
    icon: <i className="iconfont iconxiangmu"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconxiangmu" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '找资金',
    page: 'PROJECT',
    icon: <i className="iconfont iconqian"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconqian" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '服务商',
    page: 'SERVICE',
    icon: <i className="iconfont iconfuwushang"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconfuwushang" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '资讯',
    page: 'NEWS',
    icon: <i className="iconfont iconxinwen"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconxinwen" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '我的',
    page: 'MINE',
    icon: <i className="iconfont iconyonghuming"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconyonghuming" style={{ color: ACTIVE_COLOR }}></i>,
  }
]

const toCreateTreeRoute = (routes) => routes.map((route) => {
  if (route.children.length) {
    delete route.component;
    return (
      <Route {...route} key={route.key}>
        <Switch>
          {toCreateTreeRoute(route.children)}
          <Route component={NoMatch} />
        </Switch>
      </Route>
    )
  } else {
    return (
      <Route {...route} key={route.key} />
    )
  }
})


const AppRoute = (props) => {

  const { pathname } = props.location;

  const [tabKey, setTabKey] = useState('选项目');
  const gotoPage = (tabName) => () => {
    // 查询Tabbar时隐时见的问题
    console.log('【NOMAL】', pathname);
    console.log('【NOMAL】', pathname.split('/')[3]);
    
    
    const tab_key_index = gTabBar.findIndex(item => item.name === tabName);
    setTabKey(tabName);
    props.history.push(LOCAL_URL[gTabBar[tab_key_index].page]);
  }

  useEffect(() => {
    console.log('【Effect】', pathname);
    console.log('【Effect】', pathname.split('/')[3]);
    const tab_key_index = gTabBar.findIndex(item => item.page.toLowerCase() === pathname.split('/')[3]);
    if (gTabBar[tab_key_index]) {
      const tab_key = gTabBar[tab_key_index].name;
      setTabKey(tab_key);
    }
  }, [pathname])

  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <TabBar 
          unselectedTintColor={NORMAL_COLOR} 
          tintColor={ACTIVE_COLOR} 
          barTintColor="white" 
          hidden={!LOCAL_URL_SHOW.includes(pathname.split('/')[3])} 
          prerenderingSiblingsNumber={Infinity}
        >
          {gTabBar.map(tabbar => (
            <TabBar.Item 
              key={tabbar.name}
              title={tabbar.name}
              icon={tabbar.icon}
              selectedIcon={tabbar.selected}
              selected={tabKey === tabbar.name}
              onPress={gotoPage(tabbar.name)}
            >
              <Switch>
                {toCreateTreeRoute(Routes)}
                <Route component={NoMatch} />
              </Switch>
            </TabBar.Item>
          ))}
        </TabBar>
      </ApolloProvider>
    </ErrorBoundary>
  );
}

export default () => (
  <Router>
    <Route component={AppRoute}/>
  </Router>
)

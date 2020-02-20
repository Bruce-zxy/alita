import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import initReactFastclick from 'react-fastclick';
import { ApolloProvider } from "react-apollo";
import loadable from '@loadable/component';

import * as moment from 'moment';
import 'moment/locale/zh-cn';

import ErrorBoundary from './components/Error';
// import NoMatch from './components/NoMatch';
import Loader from './components/Loader';

import { LOCAL_URL, LOCAL_URL_SHOW } from './config/common';
import { initMetadata, asyncEffectHandler, toSetWeChatShareConfig } from './utils/global';
import client from './config/apollo-client';

initReactFastclick();
moment.locale('zh-cn');

const Home = loadable(() => import('./pages/home'), { fallback: <Loader /> });
const HomeDetail = loadable(() => import('./pages/home_detail'), { fallback: <Loader /> });

const Finance = loadable(() => import('./pages/finance'), { fallback: <Loader /> });
const FinanceDetail = loadable(() => import('./pages/finance_detail'), { fallback: <Loader /> });

const Service = loadable(() => import('./pages/service'), { fallback: <Loader /> });
const ServiceDetail = loadable(() => import('./pages/service_detail'), { fallback: <Loader /> });

const News = loadable(() => import('./pages/news'), { fallback: <Loader /> });
const NewsDetail = loadable(() => import('./pages/news_detail'), { fallback: <Loader /> });

const Mine = loadable(() => import('./pages/mine'), { fallback: <Loader /> });
const MineFinancial = loadable(() => import('./pages/mine_financial'), { fallback: <Loader /> });
const MineService = loadable(() => import('./pages/mine_service'), { fallback: <Loader /> });
const MineCard = loadable(() => import('./pages/mine_card'), { fallback: <Loader /> });
const MineProject = loadable(() => import('./pages/mine_project'), { fallback: <Loader /> });
const MineFunds = loadable(() => import('./pages/mine_funds'), { fallback: <Loader /> });

const Signup = loadable(() => import('./pages/signup'), { fallback: <Loader /> });
const Signin = loadable(() => import('./pages/signin'), { fallback: <Loader /> });

const PublishProject = loadable(() => import('./pages/publish_project'), { fallback: <Loader /> });
const PublishFunds = loadable(() => import('./pages/publish_funds'), { fallback: <Loader /> });
const PublishMember = loadable(() => import('./pages/publish_member'), { fallback: <Loader /> });

const NORMAL_COLOR = "#555555";
const ACTIVE_COLOR = "#0572E4";

const gTabBar = [{
    name: '项目招商',
    page: 'HOME',
    icon: <i className="iconfont iconxiangmu"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconxiangmu" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '金融资本',
    page: 'FINANCE',
    icon: <i className="iconfont iconqian"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconqian" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '配套服务',
    page: 'SERVICE',
    icon: <i className="iconfont iconfuwushang"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconfuwushang" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '政策资讯',
    page: 'NEWS',
    icon: <i className="iconfont iconxinwen"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconxinwen" style={{ color: ACTIVE_COLOR }}></i>,
  }, {
    name: '我的',
    page: 'MINE',
    icon: <i className="iconfont iconyonghuming"  style={{ color: NORMAL_COLOR }}></i>,
    selected: <i className="iconfont iconyonghuming" style={{ color: ACTIVE_COLOR }}></i>,
  }
];

const AdditionalRouteConfig = () => (
  <Switch>
    <Route path={`${LOCAL_URL['SIGNUP']}`} component={(props) => <Signup {...props} />} exact />
    <Route path={`${LOCAL_URL['SIGNIN']}`} component={(props) => <Signin {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_PROJECT']}`} component={(props) => <PublishProject {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_FUNDS']}`} component={(props) => <PublishFunds {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_MEMBER']}`} component={(props) => <PublishMember {...props} />} exact />
  </Switch>
)

const MainRouteConfig = {
  项目招商: (props) => {
    return (
      <Switch>
        <Route path={LOCAL_URL['HOME']} component={(props) => <Home {...props} />} exact />
        <Route path={`${LOCAL_URL['HOME_DETAIL']}/:id`} component={(props) => <HomeDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['HOME_DETAIL']}`} component={(props) => <HomeDetail {...props} />} exact />
        <AdditionalRouteConfig />
      </Switch>
    )
  }, 
  金融资本: (props) => {
    return (
      <Switch>
        <Route path={LOCAL_URL['FINANCE']} component={(props) => <Finance {...props} />} exact />
        <Route path={`${LOCAL_URL['FINANCE_FUNDS']}/:id`} component={(props) => <FinanceDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['FINANCE_FUNDS']}`} component={(props) => <FinanceDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['FINANCE_FINANCING']}/:id`} component={(props) => <FinanceDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['FINANCE_FINANCING']}`} component={(props) => <FinanceDetail {...props} />} exact />
        <AdditionalRouteConfig />
      </Switch>
    )
  }, 
  配套服务: (props) => {
    return (
      <Switch>
        <Route path={LOCAL_URL['SERVICE']} component={(props) => <Service {...props} />} exact />
        <Route path={`${LOCAL_URL['SERVICE_DETAIL']}/:id`} component={(props) => <ServiceDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['SERVICE_DETAIL']}`} component={(props) => <ServiceDetail {...props} />} exact />
      </Switch>
    )
  }, 
  政策资讯: (props) => {
    return (
      <Switch>
        <Route path={LOCAL_URL['NEWS']} component={(props) => <News {...props} />} exact />
        <Route path={`${LOCAL_URL['NEWS_DETAIL']}/:id`} component={(props) => <NewsDetail {...props} />} exact />
        <Route path={`${LOCAL_URL['NEWS_DETAIL']}`} component={(props) => <NewsDetail {...props} />} exact />
      </Switch>
    )
  }, 
  我的: (props) => {
    const token = localStorage.getItem('u_token');
    if (!token) {
      return <Signin {...props} />;
    } else {
      return (
        <Switch>
          <Route path={LOCAL_URL['MINE']} component={(props) => <Mine {...props} />} exact />
          <Route path={`${LOCAL_URL['MINE_FINANCIAL']}`} component={(props) => <MineFinancial {...props} />} exact />
          <Route path={`${LOCAL_URL['MINE_SERVICE']}`} component={(props) => <MineService {...props} />} exact />
          <Route path={`${LOCAL_URL['MINE_CARD']}`} component={(props) => <MineCard {...props} />} exact />
          <Route path={`${LOCAL_URL['MINE_PROJECT']}`} component={(props) => <MineProject {...props} />} exact />
          <Route path={`${LOCAL_URL['MINE_FUNDS']}`} component={(props) => <MineFunds {...props} />} exact />
        </Switch>
      )
    }
  }
}

const AppRoute = (props) => {

  const { pathname } = props.location;

  const [tabKey, setTabKey] = useState('项目招商');
  const gotoPage = (tabName) => () => {
    const tab_key_index = gTabBar.findIndex(item => item.name === tabName);
    setTabKey(tabName);
    props.history.push(LOCAL_URL[gTabBar[tab_key_index].page]);
  }

  const [flag, setFlag] = useState(false);
  useEffect(() => {
    initMetadata().then(setFlag);
  }, []);

  useEffect(() => {
    const tab_key_index = gTabBar.findIndex(item => item.page.toLowerCase() === pathname.split('/')[1]);
    if (gTabBar[tab_key_index]) {
      const tab_key = gTabBar[tab_key_index].name;
      setTabKey(tab_key);
      toSetWeChatShareConfig()
    }
  }, [pathname])
  
  if (pathname === "/") {
    return <Redirect to="/project" />;
  }
  if (!flag) {
    return <Loader />
  } else {
    return (
      <ErrorBoundary>
        <ApolloProvider client={client}>
          {LOCAL_URL_SHOW.includes(pathname.split('/')[1]) && <TabBar
            unselectedTintColor={NORMAL_COLOR}
            tintColor={ACTIVE_COLOR}
            barTintColor="white"
            hidden={!LOCAL_URL_SHOW.includes(pathname.split('/')[1])}
          >
            {gTabBar.map((tabbar, i) => (
              <TabBar.Item
                key={tabbar.name}
                title={tabbar.name}
                icon={tabbar.icon}
                selectedIcon={tabbar.selected}
                selected={tabKey === tabbar.name}
                onPress={gotoPage(tabbar.name)}
              >
                {MainRouteConfig[tabbar.name](props)}
              </TabBar.Item>
            ))}
          </TabBar>}
          <AdditionalRouteConfig />
        </ApolloProvider>
      </ErrorBoundary>
    );
  }
}

export default () => (
  <Router>
    <Route component={AppRoute}/>
  </Router>
)

import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import initReactFastclick from 'react-fastclick';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import loadable from '@loadable/component';

import * as moment from 'moment';
import 'moment/locale/zh-cn';

import ErrorBoundary from './components/Error';
import NoMatch from './components/NoMatch';
import Loader from './components/Loader';
import { Q_GET_METADATA_TREES, Q_GET_PROVIDER_CATEGORY_TREES } from './gql';
import { buildingQuery } from './utils/global';

import { LOCAL_URL, LOCAL_URL_SHOW } from './config/common';

initReactFastclick();
moment.locale('zh-cn');

const Home = loadable(() => import('./pages/home'), { fallback: <Loader /> });
const HomeDetail = loadable(() => import('./pages/home_detail'), { fallback: <Loader /> });

const Project = loadable(() => import('./pages/project'), { fallback: <Loader /> });
const ProjectDetail = loadable(() => import('./pages/project_detail'), { fallback: <Loader /> });

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
const MineProvider = loadable(() => import('./pages/mine_provider'), { fallback: <Loader /> });

const Signup = loadable(() => import('./pages/signup'), { fallback: <Loader /> });
const Signin = loadable(() => import('./pages/signin'), { fallback: <Loader /> });

const PublishProject = loadable(() => import('./pages/publish_project'), { fallback: <Loader /> });
const PublishFunds = loadable(() => import('./pages/publish_funds'), { fallback: <Loader /> });
const PublishService = loadable(() => import('./pages/publish_service'), { fallback: <Loader /> });
const PublishMember = loadable(() => import('./pages/publish_member'), { fallback: <Loader /> });

const client = new ApolloClient({
  uri: "http://192.168.30.224:3000/graphql",
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${localStorage.getItem('u_token')}`
      }
    });
  }
});

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
];

const AdditionalRouteConfig = () => (
  <Switch>
    <Route path={`${LOCAL_URL['SIGNUP']}`} component={(props) => <Signup {...props} />} exact />
    <Route path={`${LOCAL_URL['SIGNIN']}`} component={(props) => <Signin {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_PROJECT']}`} component={(props) => <PublishProject {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_FUNDS']}`} component={(props) => <PublishFunds {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_SERVICE']}`} component={(props) => <PublishService {...props} />} exact />
    <Route path={`${LOCAL_URL['PUBLISH_MEMBER']}`} component={(props) => <PublishMember {...props} />} exact />
  </Switch>
)

const MainRouteConfig = {
  选项目: (
    <Switch>
      <Route path={LOCAL_URL['HOME']} component={(props) => <Home {...props} />} exact />
      <Route path={`${LOCAL_URL['HOME_DETAIL']}/:id`} component={(props) => <HomeDetail {...props} />} exact />
      <AdditionalRouteConfig />
    </Switch>
  ), 
  找资金: (
    <Switch>
      <Route path={LOCAL_URL['PROJECT']} component={(props) => <Project {...props} />} exact />
      <Route path={`${LOCAL_URL['PROJECT_FUNDS']}/:id`} component={(props) => <ProjectDetail {...props} />} exact />
      <Route path={`${LOCAL_URL['PROJECT_FINANCING']}/:id`} component={(props) => <ProjectDetail {...props} />} exact />
      <AdditionalRouteConfig />
    </Switch>
  ), 
  服务商: (
    <Switch>
      <Route path={LOCAL_URL['SERVICE']} component={(props) => <Service {...props} />} exact />
      <Route path={`${LOCAL_URL['SERVICE_DETAIL']}/:id`} component={(props) => <ServiceDetail {...props} />} exact />
      <AdditionalRouteConfig />
    </Switch>
  ), 
  资讯: (
    <Switch>
      <Route path={LOCAL_URL['NEWS']} component={(props) => <News {...props} />} exact />
      <Route path={`${LOCAL_URL['NEWS_DETAIL']}/:id`} component={(props) => <NewsDetail {...props} />} exact />
      <AdditionalRouteConfig />
    </Switch>
  ), 
  我的: (
    <Switch>
      <Route path={LOCAL_URL['MINE']} component={(props) => <Mine {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_FINANCIAL']}`} component={(props) => <MineFinancial {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_SERVICE']}`} component={(props) => <MineService {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_CARD']}`} component={(props) => <MineCard {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_PROJECT']}`} component={(props) => <MineProject {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_FUNDS']}`} component={(props) => <MineFunds {...props} />} exact />
      <Route path={`${LOCAL_URL['MINE_PROVIDER']}`} component={(props) => <MineProvider {...props} />} exact />
      <AdditionalRouteConfig />
    </Switch>
  )
}

const AppRoute = (props) => {

  const { pathname } = props.location;

  const [tabKey, setTabKey] = useState('选项目');
  const gotoPage = (tabName) => () => {
    const tab_key_index = gTabBar.findIndex(item => item.name === tabName);
    setTabKey(tabName);
    props.history.push(LOCAL_URL[gTabBar[tab_key_index].page]);
  }

  if (!localStorage.getItem('metadata')) {
    console.log('???');
    const defaultVariables = {
      page: 0,
      limit: 1000,
      join: [{ field: 'category' }],
      sort: [{ field: 'sort', order: 'DESC' }, { field: 'create_at', order: 'DESC' }],
    };
    
    
    client.mutate({
      mutation: Q_GET_METADATA_TREES,
      variables: {
        queryString: buildingQuery(defaultVariables)
      },
      update: (proxy, { data }) => {
        if (data && data.metadataTrees) {
          localStorage.setItem('metadata', JSON.stringify(data.metadataTrees));
        }
      }
    });
    
    client.mutate({
      mutation: Q_GET_PROVIDER_CATEGORY_TREES
    }).then(result => {
      console.log(result);
      
    })
  }

  useEffect(() => {
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
              {MainRouteConfig[tabbar.name]}
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

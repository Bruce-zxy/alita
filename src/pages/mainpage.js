import React, {Fragment, useContext, useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

// import ShopContext from '../context/shop';

import HomePage from './home';
import ActivityList from './list';
import ActivityDetail from './detail';
import ApplicationPage from './application';
import MinePage from './mine';
import AttentionPage from './attention';
import ServicePage from './service';

import config from '../lib/config';

const gPageUrl = config.LOCAL_URL;
const COLOR_SELECTED = "#FF6F70";
const COLOR_UNSELECTED = "#949494";
const gTabBar = {
  '实践通': {
    page: 'HOME',
    icon: (<i className="iconfont iconshijianjidix" style={{ color: COLOR_UNSELECTED }}></i>),
    selected: (<i className="iconfont iconshijianjidix" style={{ color: COLOR_SELECTED }}></i>),
  },
  '关注': {
    page: 'ATTENTION',
    icon: (<i className="iconfont iconxinwen" style={{ color: COLOR_UNSELECTED }}></i>),
    selected: (<i className="iconfont iconxinwen" style={{ color: COLOR_SELECTED }}></i>),
  },
  '服务': {
    page: 'SERVICE',
    icon: (<i className="iconfont iconfuwu-copy" style={{ color: COLOR_UNSELECTED }}></i>),
    selected: (<i className="iconfont iconfuwu-copy" style={{ color: COLOR_SELECTED }}></i>),
  },
  '我的': {
    page: 'MINE',
    icon: (<i className="iconfont iconwode01" style={{ color: COLOR_UNSELECTED }}></i>),
    selected: (<i className="iconfont iconwode01" style={{ color: COLOR_SELECTED }}></i>),
  }
}

const MainPageRoutes = (props) => {
  // const { match: { url }} = props;
  return (
    <Fragment>
      <Fragment>
        <Route component={HomePage} path={`${gPageUrl['HOME']}`} exact />
        <Route component={ActivityList} path={`${gPageUrl['HOME_LIST']}/:news_type`} exact/>
        <Route component={ActivityDetail} path={`${gPageUrl['HOME_DETAIL']}/:id`} exact/>
        <Route component={ApplicationPage} path={`${gPageUrl['VOLUNTEER_APPLY']}`} exact/>
      </Fragment>
      <Fragment>
        <Route component={AttentionPage} path={`${gPageUrl['ATTENTION']}`} exact />
      </Fragment>
      <Fragment>
        <Route component={ServicePage} path={`${gPageUrl['SERVICE']}`} exact />
        <Route component={ServicePage} path={`${gPageUrl['SERVICE_DETAILS']}`} />
        <Route component={ServicePage} path={`${gPageUrl['SERVICE_SUBMIT']}`} />
      </Fragment>
      <Fragment>
        <Route component={MinePage} path={`${gPageUrl['MINE']}`} exact />
        <Route component={MinePage} path={`${gPageUrl['SETTING']}`} />
        <Route component={MinePage} path={`${gPageUrl['NICKNAME']}`} />
        <Route component={MinePage} path={`${gPageUrl['SEX']}`} />
        <Route component={MinePage} path={`${gPageUrl['PHONE']}`} />
        <Route component={MinePage} path={`${gPageUrl['SCORES']}`} />
        <Route component={MinePage} path={`${gPageUrl['ORDER']}`} />
        <Route component={MinePage} path={`${gPageUrl['SUGGESTION']}`} />
      </Fragment>
    </Fragment>
  )
}

window.count = 0;

export default (props) => {
  
  const { location: { pathname }, history } = props;
  const tab_key_en = pathname.split('/').slice(4,5).shift() || 'home';
  const tab_key_cn = Object.keys(gTabBar).filter(item => (gTabBar[item].page.toLowerCase() === tab_key_en.toLowerCase())).shift();

  // const shopContext = useContext(ShopContext);
  const [tabKey, setTabKey] = useState(tab_key_cn);
  useEffect(() => {
    // console.log('MainPage::useEffect: ', {shopContext});
  }, []);

  const gotoPage = (tabName) => () => {
    setTabKey(tabName);
    history.push(gPageUrl[gTabBar[tabName].page]);
  }

  return (
    <div style={{ position: 'fixed', height: '100vh', width: '100vw', top: 0 }}>
      <TabBar className="hdz-tabbar" unselectedTintColor={COLOR_UNSELECTED} tintColor={COLOR_SELECTED} barTintColor="white" hidden={false}  >
        { Object.keys(gTabBar).map(key => (
          <TabBar.Item title={key} key={key}
            icon={gTabBar[key].icon}
            selectedIcon={gTabBar[key].selected}
            selected={tabKey === (key)}
            onPress={gotoPage(key) }
          >
            <div style={{ position: 'fixed', height: 'calc(100% - 50px)', width: '100%', top: 0, overflow: 'auto' }}>
              <MainPageRoutes {...props} />
            </div>
          </TabBar.Item>
        )) }
      </TabBar>
    </div>
  );
}
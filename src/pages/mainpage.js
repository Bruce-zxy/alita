import React, {Fragment, useContext, useState, useEffect} from 'react';
import { Route } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

// import ShopContext from '../context/shop';

import HomePage from './home';
import ActivityList from './home_list';
import ActivityDetail from './home_detail';
import ApplicationPage from './home_application';
import AttentionPage from './attention';
import ServicePage from './service';
import ServiceSubmitPage from './service_submit';
import MinePage from './mine';
import ScoresPage from './mine_scores';
import SettingPage from './mine_setting';
import OrderPage from './mine_order';

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

const MainPageRoutes = {
  '实践通': (
    <Fragment>
      <Route component={HomePage} path={`${gPageUrl['HOME']}`} exact />
      <Route component={ActivityList} path={`${gPageUrl['HOME_LIST']}/:news_type`} exact/>
      <Route component={ActivityDetail} path={`${gPageUrl['HOME_DETAIL']}/:id`} exact/>
      <Route component={ApplicationPage} path={`${gPageUrl['VOLUNTEER_APPLY']}`} exact/>
    </Fragment>
  ),
  '关注': (
    <Fragment>
      <Route component={AttentionPage} path={`${gPageUrl['ATTENTION']}`} exact />
    </Fragment>
  ),
  '服务': (
    <Fragment>
      <Route component={ServicePage} path={`${gPageUrl['SERVICE']}`} exact />
      <Route component={ServicePage} path={`${gPageUrl['SERVICE']}/:id`} exact />
      <Route component={ServiceSubmitPage} path={`${gPageUrl['SERVICE_SUBMIT']}/:id`} exact />
    </Fragment>
  ),
  '我的': (
    <Fragment>
      <Route component={MinePage} path={`${gPageUrl['MINE']}`} exact />
      <Route component={SettingPage} path={`${gPageUrl['SETTING']}`} exact />
      <Route component={SettingPage} path={`${gPageUrl['SETTING']}/:type`} exact />
      <Route component={ScoresPage} path={`${gPageUrl['SCORES']}`} exact />
      <Route component={OrderPage} path={`${gPageUrl['ORDER']}/:type`} exact/>
      <Route component={MinePage} path={`${gPageUrl['ORDER']}/:type/:id`} exact/>
      <Route component={MinePage} path={`${gPageUrl['SUGGESTION']}`} exact/>
    </Fragment>
  )
};

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
    <div style={{ position: 'fixed', height: '100vh', width: '100vw', top: 0, zIndex: 1 }}>
      <TabBar className="hdz-tabbar" unselectedTintColor={COLOR_UNSELECTED} tintColor={COLOR_SELECTED} barTintColor="white" hidden={false}  >
        { Object.keys(gTabBar).map((key, i) => (
          <TabBar.Item title={key} key={key}
            icon={gTabBar[key].icon}
            selectedIcon={gTabBar[key].selected}
            selected={tabKey === (key)}
            onPress={gotoPage(key) }
          >
            <div style={{ position: 'fixed', height: 'calc(100% - 50px)', width: '100%', top: 0, overflow: 'auto', zIndex: 1 }}>
              {MainPageRoutes[key]}
            </div>
          </TabBar.Item>
        )) }
      </TabBar>
    </div>
  );
}
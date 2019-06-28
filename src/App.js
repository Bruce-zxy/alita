import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import initReactFastclick from 'react-fastclick';

import ShopProvider from './context/shop.provider';

import MainPage from './pages/mainpage';
import ExceptionPage from './pages/exception';

import config from './lib/config';
import './App.scss';

initReactFastclick();

const AppRoute = () => {
  alert('??')
  return (
    <ShopProvider>
      <Route path={config.LOCAL_URL.ROOT} exact           component={() => <Redirect to={{ pathname: config.LOCAL_URL.HOME }} />} />
      <Route path={config.LOCAL_URL.HOME_URL} exact       component={() => <Redirect to={{ pathname: config.LOCAL_URL.HOME }} />} />
      <Route path={config.LOCAL_URL.MAIN_PAGE}            component={MainPage}      />
      <Route path={`${config.LOCAL_URL.EXCEPTION}/:type`} component={ExceptionPage} />
    </ShopProvider>
  );
}

export default () => (
  <Router>
      <Route component={AppRoute}/>
  </Router>
)

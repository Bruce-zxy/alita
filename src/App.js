import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import loadable from '@loadable/component';
import * as moment from 'moment';
import 'moment/locale/zh-cn';

import ErrorBoundary from './components/Error';
import NoMatch from './components/NoMatch';
import Loader from './components/Loader';
import { LOCAL_URL } from './config/common';

moment.locale('zh-cn');

const Home = loadable(() => import('./pages/home'), { fallback: <Loader /> });
const Mine = loadable(() => import('./pages/mine'), { fallback: <Loader /> });
const Project = loadable(() => import('./pages/project'), { fallback: <Loader /> });

const AppRoute = () => {
  return (
    <ErrorBoundary>
      <Switch>
        <Route path={LOCAL_URL['ROOT']} component={(props) => <Redirect to={{ pathname: LOCAL_URL.HOME, search: props.location.search }} />} exact />
        <Route path={LOCAL_URL['HOME']} component={(props) => <Home {...props}/>} />
        <Route path={LOCAL_URL['MINE']} component={(props) => <Mine {...props}/>} />
        <Route path={LOCAL_URL['PROJECT']} component={(props) => <Project {...props}/>} />
        <Route component={NoMatch} />
      </Switch>
    </ErrorBoundary>
  );
}

export default () => (
  <Router>
      <Route component={AppRoute}/>
  </Router>
)

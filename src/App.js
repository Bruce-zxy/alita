import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as moment from 'moment';
import initReactFastclick from 'react-fastclick';
import 'moment/locale/zh-cn';

import ErrorBoundary from './components/Error';
import NoMatch from './components/NoMatch';
import Routes from './config/route';

initReactFastclick();
moment.locale('zh-cn');

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


const AppRoute = () => {
  return (
    <ErrorBoundary>
      <Switch>
        {toCreateTreeRoute(Routes)}
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

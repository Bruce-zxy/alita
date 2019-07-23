import React from 'react';
import { Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

import Loader from '../components/Loader';
import { LOCAL_URL } from './common';

const Home = loadable(() => import('../pages/home'), { fallback: <Loader /> });
const HomeDetail = loadable(() => import('../pages/home_detail'), { fallback: <Loader /> });
const Mine = loadable(() => import('../pages/mine'), { fallback: <Loader /> });
const Project = loadable(() => import('../pages/project'), { fallback: <Loader /> });

export default [{
    key: "根目录",
    path: LOCAL_URL['ROOT'],
    component: (props) => <Redirect to={{ pathname: LOCAL_URL.HOME, search: props.location.search }} />,
    exact: true,
    children: []
}, {
    key: "应用首页",
    path: LOCAL_URL['HOME'],
    exact: false,
    children: [{
        key: "主页",
        path: LOCAL_URL['HOME'],
        component: (props) => <Home {...props} />,
        exact: true,
        children: []
    }, {
        key: "应用首页详情",
        path: LOCAL_URL['HOME_DETAIL'],
        component: (props) => <HomeDetail {...props} />,
        exact: true,
        children: []
    }]
}, {
    key: "个人中心",
    path: LOCAL_URL['MINE'],
    component: (props) => <Mine {...props} />,
    exact: false,
    children: []
}, {
    key: "项目中心",
    path: LOCAL_URL['PROJECT'],
    component: (props) => <Project {...props} />,
    exact: false,
    children: []
}]
import React from 'react';
import { Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

import Loader from '../components/Loader';
import { LOCAL_URL } from './common';

const Home = loadable(() => import('../pages/home'), { fallback: <Loader /> });
const HomeDetail = loadable(() => import('../pages/home_detail'), { fallback: <Loader /> });
const Project = loadable(() => import('../pages/project'), { fallback: <Loader /> });
const ProjectDetail = loadable(() => import('../pages/project_detail'), { fallback: <Loader /> });
const Service = loadable(() => import('../pages/service'), { fallback: <Loader /> });
const ServiceDetail = loadable(() => import('../pages/service_detail'), { fallback: <Loader /> });
const News = loadable(() => import('../pages/news'), { fallback: <Loader /> });
const Mine = loadable(() => import('../pages/mine'), { fallback: <Loader /> });

export default [{
    key: "根目录",
    path: LOCAL_URL['ROOT'],
    component: (props) => <Redirect to={{ pathname: LOCAL_URL.HOME, search: props.location.search }} />,
    exact: true,
    children: []
}, {
    key: "选项目",
    path: LOCAL_URL['HOME'],
    exact: false,
    children: [{
        key: "选项目首页",
        path: LOCAL_URL['HOME'],
        component: (props) => <Home {...props} />,
        exact: true,
        children: []
    }, {
        key: "选项目详情",
        path: LOCAL_URL['HOME_DETAIL'] + '/:id',
        component: (props) => <HomeDetail {...props} />,
        exact: true,
        children: []
    }]
}, {
    key: "找资金",
    path: LOCAL_URL['PROJECT'],
    exact: false,
    children: [{
        key: "选项目首页",
        path: LOCAL_URL['PROJECT'],
        exact: false,
        children: [{
            key: "主页",
            path: LOCAL_URL['PROJECT'],
            component: (props) => <Project {...props} />,
            exact: true,
            children: []
        }, {
            key: "找资金",
            path: LOCAL_URL['PROJECT_FUNDS'] + '/:id',
            component: (props) => <ProjectDetail {...props} />,
            exact: true,
            children: []
        }, {
            key: "江旅金融",
            path: LOCAL_URL['PROJECT_FINANCING'] + '/:id',
            component: (props) => <ProjectDetail {...props} />,
            exact: true,
            children: []
        }]
    }]
}, {
    key: "服务商",
    path: LOCAL_URL['SERVICE'],
    exact: false,
    children: [{
        key: "服务商首页",
        path: LOCAL_URL['SERVICE'],
        exact: false,
        children: [{
            key: "主页",
            path: LOCAL_URL['SERVICE'],
            component: (props) => <Service {...props} />,
            exact: true,
            children: []
        }, {
            key: "服务商详情页",
            path: '/app/lvyoto/service/detail/:id',
            component: (props) => <ServiceDetail {...props} />,
            exact: true,
            children: []
        }]
    }]
}, {
    key: "资讯",
    path: LOCAL_URL['NEWS'],
    exact: true,
    children: [{
        key: "选项目首页",
        path: LOCAL_URL['NEWS'],
        component: (props) => <News {...props} />,
        exact: true,
        children: []
    }]
}, {
    key: "个人中心",
    path: LOCAL_URL['MINE'],
    exact: true,
    children: [{
        key: "选项目首页",
        path: LOCAL_URL['MINE'],
        component: (props) => <Mine {...props} />,
        exact: true,
        children: []
    }]
}]
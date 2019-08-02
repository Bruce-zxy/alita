import React from 'react';
import { Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

import Loader from '../components/Loader';
import { LOCAL_URL } from './common';

const Home           = loadable(() => import('../pages/home'), { fallback: <Loader /> });
const HomeDetail     = loadable(() => import('../pages/home_detail'), { fallback: <Loader /> });

const Project        = loadable(() => import('../pages/project'), { fallback: <Loader /> });
const ProjectDetail  = loadable(() => import('../pages/project_detail'), { fallback: <Loader /> });

const Service        = loadable(() => import('../pages/service'), { fallback: <Loader /> });
const ServiceDetail  = loadable(() => import('../pages/service_detail'), { fallback: <Loader /> });

const News           = loadable(() => import('../pages/news'), { fallback: <Loader /> });
const NewsDetail     = loadable(() => import('../pages/news_detail'), { fallback: <Loader /> });

const Mine           = loadable(() => import('../pages/mine'), { fallback: <Loader /> });
const MineFinancial  = loadable(() => import('../pages/mine_financial'), { fallback: <Loader /> });
const MineService    = loadable(() => import('../pages/mine_service'), { fallback: <Loader /> });
const MineCard       = loadable(() => import('../pages/mine_card'), { fallback: <Loader /> });
const MineProject    = loadable(() => import('../pages/mine_project'), { fallback: <Loader /> });
const MineFunds      = loadable(() => import('../pages/mine_funds'), { fallback: <Loader /> });
const MineProvider   = loadable(() => import('../pages/mine_provider'), { fallback: <Loader /> });

const Signup         = loadable(() => import('../pages/signup'), { fallback: <Loader /> });
const Signin         = loadable(() => import('../pages/signin'), { fallback: <Loader /> });

const PublishProject = loadable(() => import('../pages/publish_project'), { fallback: <Loader /> });
const PublishFunds   = loadable(() => import('../pages/publish_funds'), { fallback: <Loader /> });
const PublishService = loadable(() => import('../pages/publish_service'), { fallback: <Loader /> });
const PublishMember  = loadable(() => import('../pages/publish_member'), { fallback: <Loader /> });

export default [{
    key: "根目录",
    path: LOCAL_URL['ROOT'],
    component: (props) => <Redirect to={{ pathname: LOCAL_URL["HOME"], search: props.location.search }} />,
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
            path: LOCAL_URL['SERVICE_DETAIL'] + '/:id',
            component: (props) => <ServiceDetail {...props} />,
            exact: true,
            children: []
        }]
    }]
}, {
    key: "资讯",
    path: LOCAL_URL['NEWS'],
    exact: false,
    children: [{
        key: "资讯首页",
        path: LOCAL_URL['NEWS'],
        exact: false,
        children: [{
            key: "主页",
            path: LOCAL_URL['NEWS'],
            component: (props) => <News {...props} />,
            exact: true,
            children: []
        }, {
            key: "资讯详情页",
            path: LOCAL_URL['NEWS_DETAIL'] + '/:id',
            component: (props) => <NewsDetail {...props} />,
            exact: true,
            children: []
        }]
    }]
}, {
    key: "个人中心",
    path: LOCAL_URL['MINE'],
    exact: false,
    children: [{
        key: "个人中心首页",
        path: LOCAL_URL['MINE'],
        exact: false,
        children: [{
            key: "主页",
            path: LOCAL_URL['MINE'],
            component: (props) => <Mine {...props} />,
            exact: true,
            children: []
        }, {
            key: "金融服务",
            path: LOCAL_URL['MINE_FINANCIAL'],
            component: (props) => <MineFinancial {...props} />,
            exact: true,
            children: []
        }, {
            key: "我的服务",
            path: LOCAL_URL['MINE_SERVICE'],
            component: (props) => <MineService {...props} />,
            exact: true,
            children: []
        }, {
            key: "名片管理",
            path: LOCAL_URL['MINE_CARD'],
            component: (props) => <MineCard {...props} />,
            exact: true,
            children: []
        }, {
            key: "项目管理",
            path: LOCAL_URL['MINE_PROJECT'],
            component: (props) => <MineProject {...props} />,
            exact: true,
            children: []
        }, {
            key: "资金管理",
            path: LOCAL_URL['MINE_FUNDS'],
            component: (props) => <MineFunds {...props} />,
            exact: true,
            children: []
        }, {
            key: "服务商管理",
            path: LOCAL_URL['MINE_PROVIDER'],
            component: (props) => <MineProvider {...props} />,
            exact: true,
            children: []
        }]
    }]
}, {
    key: "注册页面",
    path: LOCAL_URL['SIGNUP'],
    component: (props) => <Signup {...props} />,
    exact: false,
    children: []
}, {
    key: "登录页面",
    path: LOCAL_URL['SIGNIN'],
    component: (props) => <Signin {...props} />,
    exact: false,
    children: []
}, {
    key: "发布页面",
    path: LOCAL_URL['PUBLISH'],
    exact: false,
    children: [{
        key: "发布项目",
        path: LOCAL_URL['PUBLISH_PROJECT'],
        component: (props) => <PublishProject {...props} />,
        exact: true,
        children: []
    }, {
        key: "发布资金",
        path: LOCAL_URL['PUBLISH_FUNDS'],
        component: (props) => <PublishFunds {...props} />,
        exact: true,
        children: []
    }, {
        key: "发布服务商",
        path: LOCAL_URL['PUBLISH_SERVICE'],
        component: (props) => <PublishService {...props} />,
        exact: true,
        children: []
    }, {
        key: "申请会员",
        path: LOCAL_URL['PUBLISH_MEMBER'],
        component: (props) => <PublishMember {...props} />,
        exact: true,
        children: []
    }]
}]
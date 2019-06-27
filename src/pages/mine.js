import React, { Fragment, Component} from 'react';

import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL } = config;

const user = {
    name: '她在岛屿写日记',
    avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=AVATAR',
    scores: '152',
    sex: '女',
    phone: '18679183994'
}

export default class extends Component {

    toRenderUserPanel = (user) => {
        if (!user) {
            return (
                <Fragment>
                    <img src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561547251987&di=e63f4f0adfe4ffffa7ed7fa8c0fc9580&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa12f24e688c1cda3ff4cc453f3486a88adaf08cc2cdb-tQvJqX_fw658' alt='placeholder+image' />
                    <p className="user-name">你好，年轻人</p>
                    <a className="apply-to-volunteer" href={LOCAL_URL['VOLUNTEER_APPLY']}>申请成为志愿者</a>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <img src={user.avatar} alt='placeholder+image' />
                    <p className="user-name">{user.name}<i className="iconfont iconaixin"></i></p>
                    <div className="user-scores">
                        <p>{user.scores}</p>
                        <p><a href={LOCAL_URL['SCORES']}>我的积分</a></p>
                    </div>
                </Fragment>
            )
        }
    }

    toRenderUserFunction = (user) => {
        if (!user) {
            return (
                <div className="my-order">
                    <p className="order-type-title">
                        <span>我的订单</span>
                        <a>查看全部</a>
                    </p>
                    <div className="order-type-list">
                        <div className="order-type-item">
                            <i className="iconfont iconjilu"></i>
                            <p>待派单</p>
                        </div>
                        <div className="order-type-item">
                            <i className="iconfont iconjilu"></i>
                            <p>待接单</p>
                        </div>
                        <div className="order-type-item">
                            <i className="iconfont iconjilu"></i>
                            <p>待确认</p>
                        </div>
                        <div className="order-type-item">
                            <i className="iconfont iconjilu"></i>
                            <p>待结单</p>
                        </div>
                        <div className="order-type-item">
                            <i className="iconfont iconjilu"></i>
                            <p>已结单</p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Fragment>
                    <a href={LOCAL_URL['ORDER_WANTDO']}>
                        <i className="iconfont iconxiadan"></i>
                        <span>我的需求单</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </a>
                    <a href={LOCAL_URL['ORDER_TODO']}>
                        <i className="iconfont iconwodedingdan"></i>
                        <span>我的任务单</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </a>
                    <a href={LOCAL_URL['SUGGESTION']}>
                        <i className="iconfont icontousuyujianyi"></i>
                        <span>志愿者建议</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </a>
                </Fragment>
            )
        }
    }

    render() {
        return (
            <div className="hdz-mine">
                <div className="user-info-container">
                    <div className="user-info">
                        <div className="user-info-panel">
                            {this.toRenderUserPanel(user)}
                        </div>
                    </div>
                    <a className="user-setting" href={LOCAL_URL['SETTING']}><i className="iconfont iconshezhicopy"></i></a> 
                </div>
                <div className="hdz-block-space"></div>
                <div className="user-function">
                    {this.toRenderUserFunction(user)}
                </div>
            </div>
        )
    }
}

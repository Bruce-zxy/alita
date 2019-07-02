import React, { Fragment, Component, useContext, useEffect } from 'react';

import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL, DEFAULT_AVATAR } = config;

const user = {
    name: '她在岛屿写日记',
    avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=AVATAR',
    scores: '152',
    sex: '女',
    phone: '18679183994'
}


export default () =>  {

    const shopContext = useContext(ShopContext);
    const user = shopContext.user;
    useEffect(() => {
        shopContext.updateUserInfo()
    }, []);
    
    const toRenderUserPanel = (user) => {
        if (!user || !user.isVolunteer) {
            return (
                <Fragment>
                    <img src={DEFAULT_AVATAR} alt='图片已失效' />
                    <p className="user-name">你好，年轻人</p>
                    {user && user.status === '待审核' ? (
                        <a className="apply-to-volunteer" href='javascript:;'>审核中，请等待</a>
                    ) : (
                        <a className="apply-to-volunteer" href={LOCAL_URL['VOLUNTEER_APPLY']}>申请成为志愿者</a>
                    )}
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <img src={user.avatar || DEFAULT_AVATAR} alt='图片已失效' />
                    <p className="user-name">{user.nickname}<i className="iconfont iconaixin"></i></p>
                    <div className="user-scores">
                        <p>{user.points}</p>
                        <p><a href={LOCAL_URL['SCORES']}>我的积分</a></p>
                    </div>
                </Fragment>
            )
        }
    }

    const toRenderUserFunction = (user) => {
        if (!user || !user.isVolunteer) {
            return (
                <div className="my-order">
                    <p className="order-type-title">
                        <span>我的订单</span>
                        <a href={`${LOCAL_URL['ORDER_WANTDO']}`}>查看全部</a>
                    </p>
                    <div className="order-type-list">
                        <a className="order-type-item" href={`${LOCAL_URL['ORDER_WANTDO']}`}>
                            <i className="iconfont iconjilu"></i>
                            <p>待派单</p>
                        </a>
                        <a className="order-type-item" href={`${LOCAL_URL['ORDER_WANTDO']}`}>
                            <i className="iconfont iconjilu"></i>
                            <p>待接单</p>
                        </a>
                        <a className="order-type-item" href={`${LOCAL_URL['ORDER_WANTDO']}`}>
                            <i className="iconfont iconjilu"></i>
                            <p>待确认</p>
                        </a>
                        <a className="order-type-item" href={`${LOCAL_URL['ORDER_WANTDO']}`}>
                            <i className="iconfont iconjilu"></i>
                            <p>待结单</p>
                        </a>
                        <a className="order-type-item" href={`${LOCAL_URL['ORDER_WANTDO']}`}>
                            <i className="iconfont iconjilu"></i>
                            <p>已结单</p>
                        </a>
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

        
    return (
        <div className="hdz-mine">
            <div className="user-info-container">
                <div className="user-info">
                    <div className="user-info-panel">
                        {toRenderUserPanel(user)}
                    </div>
                </div>
                {user && <a className="user-setting" href={LOCAL_URL['SETTING']}><i className="iconfont iconshezhicopy"></i></a>} 
            </div>
            <div className="hdz-block-space"></div>
            <div className="user-function">
                {toRenderUserFunction(user)}
            </div>
        </div>
    )
}

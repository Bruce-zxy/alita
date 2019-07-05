import React, { Fragment, Component, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
const COMMON_ORDER_STATUS = ['待派单', '待接单', '待确认', '待结单', '已作废']

export default () =>  {

    const shopContext = useContext(ShopContext);
    const user = shopContext.user;
    
    const toRenderUserPanel = (user) => {
        if (!user || !user.isVolunteer) {
            return (
                <Fragment>
                    <img src={DEFAULT_AVATAR} alt='图片已失效' />
                    <p className="user-name">{user ? user.nickname : "未设置"}</p>
                    {user && user.status === '待审核' ? (
                        <a className="apply-to-volunteer" href='javascript:;'>审核中，请等待</a>
                    ) : (
                        <Link className="apply-to-volunteer" to={LOCAL_URL['VOLUNTEER_APPLY']}>申请成为志愿者</Link>
                    )}
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <img src={user.avatar || DEFAULT_AVATAR} alt='图片已失效' />
                    <p className="user-name">{user.nickname || '未设置'}<i className="iconfont iconaixin"></i></p>
                    <div className="user-scores">
                        <p>{user.points}</p>
                        <p><Link to={LOCAL_URL['SCORES']}>我的积分</Link></p>
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
                        <Link to={`${LOCAL_URL['ORDER_WANTDO']}`}>查看全部</Link>
                    </p>
                    <div className="order-type-list">
                        {COMMON_ORDER_STATUS.map((status, i) => (
                            <Link className="order-type-item" to={`${LOCAL_URL['ORDER_WANTDO']}?tab=${i+1}`} key={i+1}>
                                <i className="iconfont iconjilu"></i>
                                <p>{status}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        } else {
            return (
                <Fragment>
                    <Link to={LOCAL_URL['ORDER_WANTDO']}>
                        <i className="iconfont iconxiadan"></i>
                        <span>我点的单</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </Link>
                    <Link to={LOCAL_URL['ORDER_TODO']}>
                        <i className="iconfont iconwodedingdan"></i>
                        <span>我接的单</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </Link>
                    <Link to={LOCAL_URL['SUGGESTION']}>
                        <i className="iconfont icontousuyujianyi"></i>
                        <span>志愿者建议</span>
                        <i className="iconfont iconjiantouyou"></i>
                    </Link>
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
                {user && <Link className="user-setting" to={LOCAL_URL['SETTING']}><i className="iconfont iconshezhicopy"></i></Link>} 
            </div>
            <div className="hdz-block-space"></div>
            <div className="user-function">
                {toRenderUserFunction(user)}
            </div>
        </div>
    )
}

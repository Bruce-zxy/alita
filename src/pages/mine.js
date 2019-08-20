import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";

import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, DEFAULT_AVATAR, IDENTITY_MAPS } from '../config/common';
import "../style/mine.scss";

export default withApollo((props) => {

    const token = localStorage.getItem('u_token');
    const [user, updateUser] = useState({});

    const toLogout = () => {
        localStorage.clear();
        window.location.reload();        
    }

    useEffect(() => {
        try {
            updateUser(JSON.parse(localStorage.getItem('u_user')));
        } catch (error) {
            global.TNT(error);
        }
        if (token) {
            toFetchCurrentUser(props.client).then((user) => {
                if (user) {
                    updateUser(user);
                }
            })
        }
    }, [])

    if (token) {
        const { id, account, avatar, realname, vip, phone, idcard, address, company, identity, profile, status } = user;
        return (
            <div className="hdz-lvyoto-mine">

                <div className="mine-bottom"></div>

                <Link to="javascript:;" className="mine-setting" style={{ display: "none" }}><i className="iconfont iconshezhi"></i></Link>

                <div className="mine-card">
                    <img src={avatar || DEFAULT_AVATAR} alt='placeholder+image' />
                    <div className="mine-cart-info">
                        <p>
                            <span>{realname || '暂无昵称'}</span>
                            <span><i className="iconfont iconkuozhanVIP"></i>{vip || 0}</span>
                        </p>
                        <p>{company || '暂无公司'}</p>
                    </div>
                </div>

                <Link to={`${LOCAL_URL['PUBLISH_MEMBER']}`} className="upgrade-vip">{vip ? "查看资料" : "升级VIP"}</Link>

                <div className="mine-function">
                    <Link to={`${LOCAL_URL['MINE_FINANCIAL']}`} className="mine-function-item">
                        <i className="iconfont iconjinrong icon"></i>
                        <span>金融服务</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    <Link to={`${LOCAL_URL['MINE_SERVICE']}`} className="mine-function-item">
                        <i className="iconfont iconfuwu-active icon"></i>
                        <span>我的申请</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    <Link to={`${LOCAL_URL['MINE_CARD']}`} className="mine-function-item">
                        <i className="iconfont iconmingpian2 icon"></i>
                        <span>名片管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    {IDENTITY_MAPS[identity] === '项目方' || <Link to={`${LOCAL_URL['MINE_PROJECT']}`} className="mine-function-item">
                        <i className="iconfont iconproject-o icon"></i>
                        <span>项目管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>}
                    {IDENTITY_MAPS[identity] === '资金方' || <Link to={`${LOCAL_URL['MINE_FUNDS']}`} className="mine-function-item">
                        <i className="iconfont iconzijin icon"></i>
                        <span>资金管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>}
                    {/* IDENTITY_MAPS[identity] === '服务商' || <Link to={`${LOCAL_URL['MINE_PROVIDER']}`} className="mine-function-item">
                        <i className="iconfont iconproject-o icon"></i>
                        <span>服务商管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link> */}

                    <div className="to-logout" onClick={toLogout}>退出登录</div>
                </div>

            </div>
        )
    } else {
        return <Redirect to={{
            pathname: LOCAL_URL["SIGNIN"],
            search: props.location.search,
            state: { referrer: props.location }
        }} />
    }
});
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";

import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, DEFAULT_AVATAR, IDENTITY_MAPS } from '../config/common';
import "../style/mine.scss";

export default withApollo((props) => {

    const token = localStorage.getItem('u_token');
    const u_user = localStorage.getItem('u_user');
    const [user, updateUser] = useState({});
    const user_status = [
        '点击下方按钮可升级成为VIP',
        '您的升级申请正在审核中，请耐心等待',
        '您的升级申请已经被拒绝，可重新申请',
        '您的升级申请已通过，点击可查看资料'
    ]

    const toLogout = () => {
        localStorage.clear();
        window.location.reload();        
    }

    useEffect(() => {
        if (u_user) {
            try {
                updateUser(JSON.parse(u_user));
            } catch (error) {
                global.TNT(error);
            }
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
                    <img src={avatar || DEFAULT_AVATAR} alt='avatar' />
                    <div className="mine-cart-info">
                        <p>
                            <span>{realname || '暂无昵称'}</span>
                            <span><i className="iconfont iconkuozhanVIP"></i>{vip || 0}</span>
                        </p>
                        <p>{company || '暂无公司'}</p>
                    </div>
                </div>

                <p className="mine-status">{user_status[status]}</p>
                <Link to={`${LOCAL_URL['PUBLISH_MEMBER']}`} className="upgrade-vip">{status === 1 ? '查看资料' : vip === 0 ? "升级VIP" : "修改资料"}</Link>
                {
                    "investor" === user.identity
                    &&
                    3 === user.status ? (
                        <Link to={`${LOCAL_URL['PUBLISH_FUNDS']}`} className="upgrade-vip">发布投资需求</Link>
                    ) : (
                        ''
                    )
                }
                {
                    "financer" === user.identity
                    &&
                    3 === user.status ? (
                        <Link to={`${LOCAL_URL['PUBLISH_PROJECT']}`} className="upgrade-vip">发布融资需求</Link>
                    ) : (
                        ''
                    )
                }

                <div className="mine-function">
                    <Link to={`${LOCAL_URL['MINE_FINANCIAL']}`} className="mine-function-item">
                        <i className="iconfont iconjinrong icon"></i>
                        <span>金融服务</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    <Link to={`${LOCAL_URL['MINE_SERVICE']}`} className="mine-function-item">
                        <i className="iconfont iconfuwu-active icon"></i>
                        <span>我的投递</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    <Link to={`${LOCAL_URL['MINE_CARD']}`} className="mine-function-item">
                        <i className="iconfont iconmingpian2 icon"></i>
                        <span>名片管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>
                    {IDENTITY_MAPS[identity] === '项目方' && vip === 1 && status !== 1 && <Link to={`${LOCAL_URL['MINE_PROJECT']}`} className="mine-function-item">
                        <i className="iconfont iconproject-o icon"></i>
                        <span>项目管理</span>
                        <i className="iconfont iconyoubian"></i>
                    </Link>}
                    {IDENTITY_MAPS[identity] === '资金方' && vip === 1 && status !== 1 && <Link to={`${LOCAL_URL['MINE_FUNDS']}`} className="mine-function-item">
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
        return <Redirect 
            to={{
                pathname: LOCAL_URL["SIGNIN"],
                search: props.location.search,
                state: { referrer: props.location }
            }} 
        />
    }
});
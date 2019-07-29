import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import { LOCAL_URL } from '../config/common';
import "../style/mine.scss";

export default (props) => {
    


    return (
        <div className="hdz-lvyoto-mine">

            <div className="mine-bottom"></div>

            <Link to="javascript:;" className="mine-setting"><i className="iconfont iconshezhi"></i></Link>

            <div className="mine-card">
                <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                <div className="mine-cart-info">
                    <p>
                        <span>小通通</span>
                        <span><i className="iconfont iconkuozhanVIP"></i>0</span>
                    </p>
                    <p>律师事务所</p>
                </div>
            </div>

            <Link to="javascript:;" className="upgrade-vip">升级VIP</Link>

            <div className="mine-function">
                <Link to={`${LOCAL_URL['MINE_FINANCIAL']}`} className="mine-function-item">
                    <i className="iconfont iconjinrong icon"></i>
                    <span>金融服务</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to={`${LOCAL_URL['MINE_SERVICE']}`} className="mine-function-item">
                    <i className="iconfont iconfuwu-active icon"></i>
                    <span>我的服务</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to={`${LOCAL_URL['MINE_CARD']}`} className="mine-function-item">
                    <i className="iconfont iconmingpian2 icon"></i>
                    <span>名片管理</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to={`${LOCAL_URL['MINE_PROJECT']}`} className="mine-function-item">
                    <i className="iconfont iconproject-o icon"></i>
                    <span>项目管理</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to={`${LOCAL_URL['MINE_FUNDS']}`} className="mine-function-item">
                    <i className="iconfont iconzijin icon"></i>
                    <span>资金管理</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
            </div>
            
        </div>
    )
};
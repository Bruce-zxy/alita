import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import "../style/mine.scss";

export default (props) => {
    


    return (
        <div className="hdz-lvyoto-mine">
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
                <Link to="javascript:;" className="mine-function-item">
                    <i className="iconfont iconjinrong"></i>
                    <span>金融服务</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to="javascript:;" className="mine-function-item">
                    <i className="iconfont iconfuwu-active"></i>
                    <span>我的服务</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
                <Link to="javascript:;" className="mine-function-item">
                    <i className="iconfont iconmingpian2"></i>
                    <span>名片管理</span>
                    <i className="iconfont iconyoubian"></i>
                </Link>
            </div>
            
        </div>
    )
};
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

export default (props) => {

    const list = [{
        company: "江西风景独好传播运营有限责任公司（风景独好公司）",
        tags: ['宣传机构'],
        location: "江西",
        create: "2019-07-01 11:20:11",
        avatar: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
        concat: "江旅国旅",
        phone: "0791-86120203"
    }, {
        company: "江西风景独好传播运营有限责任公司（风景独好公司）",
        tags: ['宣传机构'],
        location: "江西",
        create: "2019-07-01 11:20:11",
        avatar: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
        concat: "江旅国旅",
        phone: "0791-86120203"
    }, {
        company: "江西风景独好传播运营有限责任公司（风景独好公司）",
        tags: ['宣传机构'],
        location: "江西",
        create: "2019-07-01 11:20:11",
        avatar: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
        concat: "江旅国旅",
        phone: "0791-86120203"
    }, {
        company: "江西风景独好传播运营有限责任公司（风景独好公司）",
        tags: ['宣传机构'],
        location: "江西",
        create: "2019-07-01 11:20:11",
        avatar: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
        concat: "江旅国旅",
        phone: "0791-86120203"
    }, {
        company: "江西风景独好传播运营有限责任公司（风景独好公司）",
        tags: ['宣传机构'],
        location: "江西",
        create: "2019-07-01 11:20:11",
        avatar: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
        concat: "江旅国旅",
        phone: "0791-86120203"
    }]

    return (
        <div className="hdz-business-card">
            <div className="business-card-list">
                {list && list.map((item, i) => (
                    <div className="business-card-item" key={i}>

                        <div className="card-top">
                            <p>{item.create}</p>
                            <div className="business-card-content">
                                <img src={item.avatar} alt='placeholder+image' />
                                <div className="business-card-intro">
                                    <p>{item.company}</p>
                                    <p>
                                        {item.tags && item.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                                        <span>所在地：{item.location}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="card-bottom">
                            <i className="iconfont iconyonghu"></i>
                            <span>{item.concat}</span>
                            <i className="iconfont icondianhua"></i>
                            <span>{item.phone}</span>
                        </p>

                        <Link to="javascript:;" className="card-category">项目详情</Link>

                    </div>
                ))}
            </div>
        </div>
    )
}
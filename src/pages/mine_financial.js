import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import { LOCAL_URL } from '../config/common';
import "../style/mine.scss";

const data = [{
    name: "江旅成员通",
    tags: ['供应链金融产品'],
    date: "2019-07-01 11:20:11",
    status: "待审核",
    icon: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
    execution: ['取消']
}, {
    name: "江旅成员通",
    tags: ['供应链金融产品'],
    date: "2019-07-01 11:20:11",
    status: "待审核",
    icon: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
    execution: ['取消']
}, {
    name: "江旅成员通",
    tags: ['供应链金融产品'],
    date: "2019-07-01 11:20:11",
    status: "待审核",
    icon: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
    execution: ['取消']
}, {
    name: "江旅成员通",
    tags: ['供应链金融产品'],
    date: "2019-07-01 11:20:11",
    status: "待审核",
    icon: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image",
    execution: ['取消', '执行']
}]

export default (props) => {

    return (
        <div className="hdz-financial-service">
            <div className="service-list">
                {data.map((item, i) => (
                    <div className="service-item">
                        <p>{item.date}</p>
                        <div className="service-intro">
                            <img src={item.icon} alt='placeholder+image' />
                            <div className="service-name">
                                <p>{item.name}</p>
                                <p>{item.tags && item.tags.slice(0,1).map((tag, j) => <span key={j}>{tag}</span>)}</p>
                            </div>
                            <div className="service-status">{item.status}</div>
                            <div className="service-execution">{item.execution && item.execution.slice(0,2).map((execute, k) => <span key={k}>{execute}</span>)}</div>
                        </div>
                    </div>
                ))}
                <Link to="javascript:;" className="service-apply">去申请</Link>
            </div>
        </div>
    )
}
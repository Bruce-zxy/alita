import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";

import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

const ServiceList = (props) => {
    const { list } = props;

    if (list) {
        return (
            <div className="service-list">
                {list.map((item, i) => (
                    <div className="service-item" key={i}>
                        <p>{item.delivery}</p>
                        <div className="service-content">
                            <img src={item.image} alt='placeholder+image' />
                            <div className="service-intro">
                                <p>{item.name}{item.tags && item.tags.slice(0, 1).map((tag, j) => <span key={j}>{tag}</span>)}</p>
                                <p>发布时间：{item.publish}</p>
                                <p>
                                    <i className="iconfont iconyonghu"></i>
                                    <span>{item.concat}</span>
                                    <i className="iconfont icondianhua"></i>
                                    <span>{item.phone}</span>
                                </p>
                            </div>
                        </div>
                        <Link to="javascript:;" className="service-category">项目详情</Link>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="service-list none">暂无数据</div>
        )
    }

}

export default withApollo((props) => {

    const list = [{
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目'],
        publish: "2019-07-01 11:20:11",
        delivery: "2019-07-01 11:20:11",
        concat: "刘廷军",
        phone: "18507085223",
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }]

    const data = [{
        title: "全部",
        className: "my-service",
        content: <ServiceList list={list} />
    }, {
        title: "项目",
        className: 'my-service',
        content: <ServiceList list={list} />
    }, {
        title: "资金",
        className: 'my-service',
        content: <ServiceList list={list} />
    }]

    return (
        <div className="hdz-my-service" id="my-service">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
})
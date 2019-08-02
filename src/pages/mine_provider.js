import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

const ProviderList = (props) => {
    const { list } = props;

    if (list) {
        return (
            <div className="provider-list">
                {list.map((item, i) => (
                    <div className="provider-item" key={i}>
                        <p>
                            <span>{item.publish}</span>
                            <span>{item.status}</span>
                        </p>
                        <div className="provider-content">
                            <img src={item.image} alt='placeholder+image' />
                            <div className="provider-intro">
                                <p>{item.name}</p>
                                <p data-location={`所在地：${item.location}`}>{item.tags && item.tags.map((tag, j) => <span key={j}>{tag}</span>)}</p>
                            </div>
                        </div>
                        <Link to="javascript:;" className="provider-category">编辑服务商</Link>
                    </div>
                ))}
                <div className="provider-tips">审核未通过理由：完善资料并审核通过之后，系统将自动给您升级VIP等级并生成一张名片，名片可以和其他会员交换。</div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
            </div>
        )
    } else {
        return (
            <div className="provider-list none">暂无数据</div>
        )
    }
}

export default (props) => {

    const list = [{
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['宣传机构'],
        publish: "2019-07-01 11:20:11",
        location: "江西",
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }]

    const data = [{
        title: "全部",
        className: "my-provider",
        content: <ProviderList list={list} />
    }, {
        title: "审核中",
        className: 'my-provider',
        content: <ProviderList list={list} />
    }, {
        title: "已通过",
        className: 'my-provider',
        content: <ProviderList list={list} />
    }, {
        title: "未通过",
        className: 'my-provider',
        content: <ProviderList list={list} />
    }]

    return (
        <div className="hdz-provider-management" id="my-provider">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_SERVICE']} className="publish-provider">发布<br/>服务商</Link>
        </div>
    )
}
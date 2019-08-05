import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

const ProjectList = (props) => {
    const { list } = props;

    if (list) {
        return (
            <div className="project-list">
                {list.map((item, i) => (
                    <div className="project-item" key={i}>
                        <p>
                            <span>{item.publish}</span>
                            <span>{item.status}</span>
                        </p>
                        <div className="project-content">
                            <img src={item.image} alt='placeholder+image' />
                            <div className="project-intro">
                                <p>{item.name}</p>
                                <p>{item.tags && item.tags.map((tag, j) => <span key={j}>{tag}</span>)}</p>
                                <p>&yen;{item.price}万元</p>
                            </div>
                        </div>
                        <Link to="javascript:;" className="project-category">编辑项目</Link>
                    </div>
                ))}
                <div className="project-tips">审核未通过理由：完善资料并审核通过之后，系统将自动给您升级VIP等级并生成一张名片，名片可以和其他会员交换。</div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
            </div>
        )
    } else {
        return (
            <div className="project-list none">暂无数据</div>
        )
    }
}

export default (props) => {

    const list = [{
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }, {
        name: "云南旅游大交通项目债权融资2200万元",
        tags: ['项目', '旅游大交通'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
    }]

    const data = [{
        title: "全部",
        className: "my-project",
        content: <ProjectList list={list} />
    }, {
        title: "审核中",
        className: 'my-project',
        content: <ProjectList list={list} />
    }, {
        title: "已通过",
        className: 'my-project',
        content: <ProjectList list={list} />
    }, {
        title: "未通过",
        className: 'my-project',
        content: <ProjectList list={list} />
    }]

    return (
        <div className="hdz-project-management" id="my-project">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_PROJECT']} className="publish-project">发布<br/>项目</Link>
        </div>
    )
}
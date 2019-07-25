import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh, Carousel } from 'antd-mobile';
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import DetailPanel from '../components/DetailPanel';
import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';


export default () => {

    const [carousel, setCarousel] = useState(0)
    
    const temp = [{
        id: 1,
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    }, {
        id: 2,
        image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    }]
    const view = 10;

    return (
        <div className="hdz-home-detail">
            <div className="home-detail-carousel">
                <Carousel 
                    className="hdz-swiper-body" 
                    autoplay 
                    infinite
                    dots={false}
                    beforeChange={(from, to) => setCarousel({ carousel: to })}
                >
                    {temp && temp.map(item => (
                        <a className="hdz-swiper-link" key={item.id}>
                            <img className="hdz-swiper-image" src={item.image}/>
                        </a>
                    ))}
                </Carousel>
                <p className="hadz-swiper-title">
                    <span>浏览量：{view}次</span>
                    <span>{carousel*1+1}/{temp.length}</span>
                </p>
            </div>
            <div className="home-detail-title">
                <p className="detail-title">浙江安之曼酒店项目股权融资5000万元用于基础设施修建</p>
                <p className="detail-subtitle">
                    <span>&yen;5000万元</span>
                    <span>所在地区：浙江</span>
                </p>
            </div>
            <div className="hdz-block-small-space"></div>
            <div className="home-detail-kv">
                <p className="detail-kv">
                    <span>所属行业</span>
                    <span>旅游大交通</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
            </div>
            <div className="hdz-block-small-space"></div>
            <div className="home-detail-intro">
                <div className="project-intro">
                    <div>
                        <p>12%-15%</p>
                        <p>资金方占股比例</p>
                    </div>
                    <div>
                        <p>扩张期</p>
                        <p>项目所处阶段</p>
                    </div>
                    <div>
                        <p>5年</p>
                        <p>最短退出年限</p>
                    </div>
                </div>
                <p className="detail-kv">
                    <span>投资退出方式</span>
                    <span>管理层回购</span>
                </p>
            </div>
            <div className="hdz-block-small-space"></div>
            <DetailPanel title="可提供资料">
                <div className="project-information">
                    <div>
                        <i className="iconfont iconjhs"></i>
                        <span>项目/商业计划书</span>
                    </div>
                    <div>
                        <i className="iconfont iconjiangpai"></i>
                        <span>公司证件</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                </div>
            </DetailPanel>
            <div className="hdz-block-small-space"></div>
            
            <DetailPanel title="项目介绍" content="北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全。"/>
            <div className="hdz-block-small-space"></div>
            
            <DetailPanel title="融资用途" content="北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全。"/>
            <div className="hdz-block-small-space"></div>

            <TabPanel />

            <DetailPanel title="会员名片">
                <div className="member-info">
                    <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                    <div className="menber-detail">
                        <p>李**</p>
                        <p>所在公司：******酒店</p>
                    </div>
                </div>
            </DetailPanel>

            <div className="hdz-block-large-space"></div>
        </div>
    )
};
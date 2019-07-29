import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';
import Carousel from '../components/Carousel';
import { LOCAL_URL } from '../config/common';

import '../style/news.scss';

const NewsList = (props) => {

    const { list } = props;

    const [thisState, setState] = useState({
        refreshing: false,
    });


    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    return (
        <PullToRefresh
            className="hdz-pull-refresh"
            damping={100}
            direction="up"
            refreshing={thisState.refreshing}
            onRefresh={() => {
                toChangeStateFactor('refreshing')((refreshing => refreshing = true));
                setTimeout(() => {
                    toChangeStateFactor('refreshing')((refreshing => refreshing = false));
                }, 1000);
            }}
        >
            <div className="news-list-container">
                <div className="news-list">
                    <Carousel
                        className="news-carousel"
                        list={[{
                            title: "江西省旅游集团深入开展“姓党、姓国、姓公”主题教育大学习大讨论活动动员会议1",
                            image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
                        }, {
                            title: "江西省旅游集团深入开展“姓党、姓国、姓公”主题教育大学习大讨论活动动员会议2",
                            image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
                        }, {
                            title: "江西省旅游集团深入开展“姓党、姓国、姓公”主题教育大学习大讨论活动动员会议3",
                            image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
                        }]}
                        dots={false}
                    />
                    {list && list.map((item, i) => (
                        <Link className="news-item" key={i} to={`${LOCAL_URL['NEWS_DETAIL']}/${item.id}`}>
                            <div className="news-info">
                                <p>{item.title}</p>
                                <p>
                                    <span>作者：{item.author}</span>
                                    <span>{item.date}</span>
                                </p>
                            </div>
                            <img src={item.image} alt='placeholder' />
                        </Link>
                    ))}
                </div>
            </div>
        </PullToRefresh>
    )
}

export default (props) => {

    const list = [{
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }, {
        title: 'MOKUMOKU模式中国首发 融创莫干溪谷领跑“乡村国际”',
        author: '陈延特',
        date: "2019-07-01",
        image: "http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image"
    }]
    
    const data = [{
        title: "行业快讯",
        className: 'lvyoto-news',
        content: <NewsList list={list} />
    }, {
        title: "江旅资讯",
        className: 'lvyoto-news',
        content: <NewsList list={list} />
    }, {
        title: "投融研报",
        className: 'lvyoto-news',
        content: <NewsList list={list} />
    }, {
        title: "投融学堂",
        className: 'lvyoto-news',
        content: <NewsList list={list} />
    }, {
        title: "通知公告",
        className: 'lvyoto-news',
        content: <NewsList list={list} />
    }]

    return (
        <div className="hdz-lvyoto-news" id="news">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" swipable={false} clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
};
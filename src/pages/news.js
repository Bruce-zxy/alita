import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { CondOperator } from '@nestjsx/crud-request';

import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import * as moment from 'moment';

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';
import Carousel from '../components/Carousel';

import { buildingQuery } from '../utils/global';
import { Q_GET_ARTICLES, Q_GET_PRODUCTS } from '../gql';

import { LOCAL_URL } from '../config/common';

import '../style/news.scss';

const defaultVariables = {
    page: 0,
    limit: 1000,
    join: [{ field: 'category' }],
    // filter: [{ field: 'category.title', operator: CondOperator.EQUALS, value: "江旅资讯" }],
    sort: [{ field: 'sort', order: 'DESC' }, { field: 'create_at', order: 'DESC' }],
};


const NewsList = (props) => {

    const { list, refreshing, onFetchMore } = props;

    return (
        <PullToRefresh
            className="hdz-pull-refresh"
            damping={100}
            direction="up"
            refreshing={refreshing}
            onRefresh={onFetchMore}
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
                                <p>作者：{item.author}&nbsp;&nbsp;{moment(item.create_at).format('YYYY-MM-DD')}</p>
                            </div>
                            <img src={item.cover} alt='placeholder' />
                        </Link>
                    ))}
                </div>
            </div>
        </PullToRefresh>
    )
}

export default withApollo((props) => {

    const { client } = props;

    const [thisState, setState] = useState({
        refreshing: false,
        index: 0,
        data: []
    });
    useEffect(() => {
        
        defaultVariables.page = thisState.index;
        
        client.mutate({
            mutation: Q_GET_ARTICLES,
            variables: {
                queryString: buildingQuery(defaultVariables)
            },
            update: (proxy, { data }) => {
                let list = thisState.data;
                if (data && data.queryArticle && data.queryArticle.data) {
                    list = list.concat(data.queryArticle.data);
                }
                setState({
                    ...thisState,
                    refreshing: false,
                    data: list
                });
            }
        });
    }, [thisState.index]);


    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    console.log(thisState);
    
    const onFetchMore = () => {
        setState({
            ...thisState,
            index: thisState.index + 1,
            refreshing: true
        });
        return true;
    }

    const data = [{
        title: "行业快讯",
        className: 'lvyoto-news',
        content: <NewsList list={thisState.data} refreshing={thisState.refreshing} onFetchMore={onFetchMore} />
    }, {
        title: "江旅资讯",
        className: 'lvyoto-news',
        content: <NewsList list={thisState.data} refreshing={thisState.refreshing} onFetchMore={onFetchMore} />
    }, {
        title: "投融研报",
        className: 'lvyoto-news',
        content: <NewsList list={thisState.data} refreshing={thisState.refreshing} onFetchMore={onFetchMore} />
    }, {
        title: "投融学堂",
        className: 'lvyoto-news',
        content: <NewsList list={thisState.data} refreshing={thisState.refreshing} onFetchMore={onFetchMore} />
    }, {
        title: "通知公告",
        className: 'lvyoto-news',
        content: <NewsList list={thisState.data} refreshing={thisState.refreshing} onFetchMore={onFetchMore} />
    }]

    return (
        <div className="hdz-lvyoto-news" id="news">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" swipable={false} clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
});
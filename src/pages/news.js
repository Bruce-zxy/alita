import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import { CondOperator } from '@nestjsx/crud-request';
import { ActivityIndicator } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import Carousel from '../components/Carousel';

import { buildingQuery } from '../utils/global';
import { Q_GET_ARTICLES } from '../gql';

import { LOCAL_URL } from '../config/common';

import '../style/news.scss';

const NewsList = withApollo((props) => {

    const { category, carousel, client } = props;

    const defaultVariables = {
        page: 0,
        limit: 10,
        join: [{ field: 'category' }],
        filter: [{ field: 'category.title', operator: CondOperator.EQUALS, value: category }],
        sort: [{ field: 'create_at', order: 'DESC' }, { field: 'sort', order: 'DESC' }],
    };

    const [thisState, setState] = useState({
        hasMore: true,
        data: [],
        page: 0
    });

    const toSetState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }))
    }

    const toLoadMore = async () => {

        let data = [];
        if (thisState.page === 0) {
            data = [];
        } else {
            data = [].concat(thisState.data);
        }

        const this_page = thisState.page + 1;
        const res = await client.query({
            query: Q_GET_ARTICLES,
            variables: {
                queryString: buildingQuery({ ...defaultVariables, page: this_page }),
                metadataRoot: '地区'
            }
        });

        if (res.data && res.data.queryArticle) {
            const { data: { queryArticle } } = res;

            if (this_page >= queryArticle.pageCount) {
                toSetState({
                    data: data.concat(queryArticle.data),
                    area_data: res.data.metadataDescendantsTree,
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryArticle.data),
                    area_data: res.data.metadataDescendantsTree,
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    global.TNT(thisState.data);

    return (

        <div className="news-list">
            <InfiniteScroll
                loadMore={toLoadMore}
                hasMore={thisState.hasMore}
                loader={<div key={0} style={{ margin: "1vh auto", display: "flex", justifyContent: "center" }}><ActivityIndicator /></div>}
                useWindow={false}
            >
                <Carousel
                    className="news-carousel"
                    list={carousel}
                    dots={false}
                />
                {thisState.data.map((item, i) => (
                    <Link className="news-item" key={i} to={`${LOCAL_URL['NEWS_DETAIL']}/${item.id}`}>
                        <div className="news-info">
                            <p>{item.title}</p>
                            <p>作者：{item.author}&nbsp;&nbsp;{moment(item.create_at).format('YYYY-MM-DD')}</p>
                        </div>
                        <img src={item.cover} alt='placeholder' />
                    </Link>
                ))}
            </InfiniteScroll>
        </div>
    )
})

export default withApollo(({ client }) => {

    const [carousel, setCarousel] = useState([]);

    const defaultVariables = {
        page: 1,
        limit: 4,
        sort: [{ field: 'sort', order: 'DESC' }],
    };

    useEffect(() => {
        client.mutate({
            mutation: Q_GET_ARTICLES,
            variables: {
                queryString: buildingQuery({ ...defaultVariables }),
                metadataRoot: '地区'
            },
            update: (proxy, { data }) => {
                if (data && data.queryArticle) {
                    setCarousel(data.queryArticle.data.map(item => ({
                        id: item.id,
                        title: item.title,
                        image: item.cover,
                        link: LOCAL_URL['NEWS_DETAIL'] + `/${item.id}`
                    })))
                }
            }
        });
    }, [])

    const data = [{
        title: "行业快讯",
        className: 'lvyoto-news',
        content: <NewsList category={"行业快讯"} carousel={carousel}/>
    }, {
        title: "江旅资讯",
        className: 'lvyoto-news',
        content: <NewsList category={"江旅资讯"} carousel={carousel}/>
    }, {
        title: "投融研报",
        className: 'lvyoto-news',
        content: <NewsList category={"投融研报"} carousel={carousel}/>
    }, {
        title: "投融学堂",
        className: 'lvyoto-news',
        content: <NewsList category={"投融学堂"} carousel={carousel}/>
    }, {
        title: "政策公告",
        className: 'lvyoto-news',
        content: <NewsList category={"通知公告"} carousel={carousel}/>
    }]

    return (
        <div className="hdz-lvyoto-news" id="news">
            <TabPanel data={data} current="行业快讯" activeColor="#0572E4" commonColor="#999" swipable={false} clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
});
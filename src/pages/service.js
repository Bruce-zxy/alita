/* eslint-disable no-unused-expressions */
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ActivityIndicator } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import { withApollo } from "react-apollo";
import { CondOperator } from '@nestjsx/crud-request';

import { buildingQuery } from '../utils/global';
import { Q_GET_PROVIDERS } from '../gql';

import Loader from '../components/Loader';
import { LOCAL_URL, COLOR_ARRAY } from '../config/common';

import '../style/service.scss';

const defaultVariables = {
    page: 0,
    limit: 10,
    join: [{ field: 'category' }, { field: 'area' }, { field: 'creator' }],
    sort: [{ field: 'create_at', order: 'DESC' }],
};

export default withApollo((props) => {

    const { client } = props;

    const [thisState, setState] = useState({
        time: 1,
        category: '',
        area: '',

        hasMore: true,
        data: [],
        category_data: [],
        area_data: [],
        page: 0
    });

    const toSetState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }))
    }

    const toShowFilterModal_1 = () => {
        const category = thisState.category_data.map(cate => ({ text: cate.title, onPress: () => toSetState({ category: cate.title, page: 0 }) }))
        Modal.operation([
            ...category,
            { text: '清除排序', onPress: () => toSetState({ category: '', page: 0 }) },
        ])
    }
    const toShowFilterModal_2 = () => {
        const area = thisState.area_data.map(are => ({ text: are.title, onPress: () => toSetState({ area: are.title, page: 0 }) }))
        Modal.operation([
            ...area,
            { text: '清除排序', onPress: () => toSetState({ area: '', page: 0 }) },
        ])
    }
    

    useEffect(() => {

        if (!thisState.category && !thisState.area) {
            delete defaultVariables.filter;
        } else {
            defaultVariables.filter = [];
            thisState.category ? defaultVariables.filter.push({ field: "category.title", operator: CondOperator.EQUALS, value: thisState.category }) : '';
            thisState.area ? defaultVariables.filter.push({ field: "area.title", operator: CondOperator.EQUALS, value: thisState.area }) : '';
        }

        defaultVariables.sort = [{
            field: 'create_at',
            order: thisState.time % 3 - 1 === 0 ? 'DESC' : 'ASC'
        }];

        toLoadMore();
    }, [thisState.time, thisState.area, thisState.category]);

    const toLoadMore = async () => {
        
        let data = [];
        if (thisState.page === 0) {
            data = [];
        } else {
            data = [].concat(thisState.data);
        }

        const this_page = thisState.page + 1;
        const res = await client.query({
            query: Q_GET_PROVIDERS,
            fetchPolicy: "no-cache",
            variables: {
                queryString: buildingQuery({ ...defaultVariables, page: this_page }),
                metadataRoot: '地区'
            }
        });

        if (res.data && res.data.queryProvider) {
            const { data: { queryProvider } } = res;

            if (this_page >= queryProvider.pageCount) {
                toSetState({
                    data: data.concat(queryProvider.data),
                    area_data: res.data.metadataDescendantsTree,
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryProvider.data),
                    area_data: res.data.metadataDescendantsTree,
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }


    return (
        <div className="hdz-service-container">
            <div className="hdz-lvyoto-service">
                <div className="lvyoto-filter-bar">
                    <div className={`publish-time state-${thisState.time % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ time: thisState.time + 1, page: 0 })}>
                        <span>发布时间</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`financing-amount state-${thisState.category % 3 ? 'active' : 'none'}`} onClick={toShowFilterModal_1}>
                        <span>机构筛选</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`filter-factor state-${thisState.area ? 'active' : 'none'}`} onClick={toShowFilterModal_2}>
                        <span>地区筛选</span>
                        <i className="iconfont iconshaixuan-tianchong"></i>
                    </div>
                </div>
                <div className="service-list">
                    <InfiniteScroll
                        loadMore={toLoadMore}
                        hasMore={thisState.hasMore}
                        loader={<div key={0} style={{ margin: "1vh auto", display: "flex", justifyContent: "center" }}><ActivityIndicator /></div>}
                        useWindow={false}
                    >
                        {thisState.data.map((item, i) => (
                            <Link key={i} className="service-item" to={`${LOCAL_URL['SERVICE_DETAIL']}/${item.id}`}>
                                <img src={item.logo} alt='LOGO' />
                                <div className="service-info">
                                    <p>{item.name}</p>
                                    <p>{item.slogan}</p>
                                    <p>
                                        {item.category ? <span className="service-tags">{item.category.title}</span> : <span></span>}
                                        <span className="service-location">所在地：{item.area ? item.area.title : '无'}</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                        <div className="hdz-block-large-space"></div>
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
})
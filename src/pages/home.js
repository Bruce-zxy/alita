import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ActivityIndicator } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import { withApollo } from "react-apollo";
import { CondOperator } from '@nestjsx/crud-request';

import { buildingQuery } from '../utils/global';
import { Q_GET_PROJECTS } from '../gql';

import { LOCAL_URL, IF_MODE_ENUM } from '../config/common';

import '../style/home.scss';

const defaultVariables = {
    page: 0,
    limit: 10,
    filter: [{ field: "status", operator: CondOperator.IN, value: "following,finished" }],
    sort: [{ field: 'create_at', order: 'DESC' }],
};

export default withApollo((props) => {

    const { client } = props;

    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        category: '',

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

    const toShowFilterModal = () => {
        Modal.operation([
            { text: '按【股权融资】筛选', onPress: () => toSetState({ category: 'equity', page: 0 }) },
            { text: '按【债权融资】筛选', onPress: () => toSetState({ category: 'claim', page: 0 }) },
            { text: '清除排序', onPress: () => toSetState({ category: '', page: 0 }) },
        ])
    }

    useEffect(() => {
        if (thisState.category) {
            defaultVariables.filter = [
                { field: "status", operator: CondOperator.IN, value: "following,finished" },
                { field: "category", operator: CondOperator.EQUALS, value: thisState.category }
            ];
        } else {
            defaultVariables.filter = [{ field: "status", operator: CondOperator.IN, value: "following,finished" }];
        }
        defaultVariables.sort = [{
            field: 'amount',
            order: thisState.amount % 3 - 1 === 0 ? 'ASC' : 'DESC'
        }, {
            field: 'create_at',
            order: thisState.time % 3 - 1 === 0 ? 'ASC' : 'DESC'
        }];

        toLoadMore();
    }, [thisState.time, thisState.amount, thisState.category]);

    const toLoadMore = async () => {

        let data = [];
        if (thisState.page === 0) {
            data = [];
        } else {
            data = [].concat(thisState.data);
        }
        
        const this_page = thisState.page + 1;
        const res = await client.query({
            query: Q_GET_PROJECTS,
            variables: {
                queryString: buildingQuery({ ...defaultVariables, page: this_page })
            }
        });


        if (res.data && res.data.queryProject) {
            const { data: { queryProject } } = res;
            
            if (this_page >= queryProject.pageCount) {
                toSetState({
                    data: data.concat(queryProject.data),
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryProject.data),
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    return (
        <div className="hdz-home-container">
            <div className="hdz-lvyoto-home">
                <div className="lvyoto-filter-bar">
                    <div className={`publish-time state-${thisState.time % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ time: thisState.time + 1, page: 0 })}>
                        <span>发布时间</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`financing-amount state-${thisState.amount % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ amount: thisState.amount + 1, page: 0 })}>
                        <span>融资金额</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`filter-factor state-${thisState.category ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                        <span>筛选</span>
                        <i className="iconfont iconshaixuan-tianchong"></i>
                    </div>
                </div>
                <div className="lvyoto-home-list">
                    <InfiniteScroll
                        loadMore={toLoadMore}
                        hasMore={thisState.hasMore}
                        loader={<div key={0} style={{ margin: "1vh auto", display: "flex", justifyContent: "center" }}><ActivityIndicator/></div>}
                        useWindow={false}
                    >
                        {thisState.data.map((item, i) => (
                            <Link className="lvyoto-home-item" key={item.id} to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>
                                <img src={item.cover} alt='placeholder' />
                                <div className="item-info">
                                    <p>{item.title}</p>
                                    <p>
                                        {item.category ? <span className="financing">{IF_MODE_ENUM[item.category.toUpperCase()]}</span> : ''}
                                        {item.industry ? <span className="industry">{item.industry.title}</span> : ''}
                                    </p>
                                    <p>
                                        <span className="price">{item.amount}万元</span>
                                        <span className="province">{item.area ? item.area.title : '无'}</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    )
});
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query, ApolloConsumer } from "react-apollo";
import { CondOperator } from '@nestjsx/crud-request';
import { buildingQuery } from '../utils/global';
import { Q_GET_PROJECTS } from '../gql';

import Loader from '../components/Loader';
import { LOCAL_URL, IF_MODE_ENUM } from '../config/common';

import '../style/home.scss';

const defaultVariables = {
    page: 0,
    limit: 1000,
    filter: [{ field: "status", operator: CondOperator.IN, value: "following,finished" }],
    sort: [{ field: 'create_at', order: 'DESC' }],
};

export default () => {
    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        category: '',
        refreshing: false,
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    const toShowFilterModal = () => {
        Modal.operation([
            { text: '按【股权融资】排序', onPress: () => toChangeStateFactor('category')(category => category = 'equity') },
            { text: '按【债权融资】排序', onPress: () => toChangeStateFactor('category')(category => category = 'claim') },
            { text: '清除排序', onPress: () => toChangeStateFactor('category')(category => category = '') },
        ])
    }

    const toRenderContentByApolloClient = ({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
        // if (networkStatus === 4) return <Loader />;
        // if (loading) return <Loader />;
        if (error) return `【Error】 ${error.message}`;

        global.TNT('【当前状态】', thisState, data);

        const { time, amount, category, refreshing } = thisState;
        let list = [];
        if (data && data.queryProject && data.queryProject.data.length) {
            list = [].concat(data.queryProject.data);
            // 按时间排序，1为正序，2为倒序
            if (time % 3 !== 0) {
                let handler = time % 3 - 1 === 0 ? ((a, b) => new Date(a.time) - new Date(b.time)) : ((a, b) => new Date(b.time) - new Date(a.time));
                list = list.sort(handler);
            }
            // 按金额排序，1为正序，2为倒序
            if (amount % 3 !== 0) {
                let handler = amount % 3 - 1 === 0 ? ((a, b) => a.amount - b.amount) : ((a, b) => b.amount - a.amount);
                list = list.sort(handler);
            }
            if (category) {
                list = list.filter((item) => item.category === category);
            }
        }

        global.TNT('【排序后】：', list);

        return (
            <div className="hdz-lvyoto-home">
                <div className="lvyoto-filter-bar">
                    <div className={`publish-time state-${time%3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('time')(time => time += 1)}>
                        <span>发布时间</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`financing-amount state-${amount%3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('amount')(amount => amount += 1)}>
                        <span>融资金额</span>
                        <i className="iconfont iconpaixu"></i>
                    </div>
                    <div className={`filter-factor state-${category ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                        <span>筛选</span>
                        <i className="iconfont iconshaixuan-tianchong"></i>
                    </div>
                </div>

                <PullToRefresh
                    className="hdz-pull-refresh"
                    damping={100}
                    direction="up"
                    refreshing={refreshing}
                    onRefresh={() => {
                        // toChangeStateFactor('refreshing')((refreshing => refreshing = true));

                        // defaultVariables.page += 1;
                        // const queryString = buildingQuery(defaultVariables);

                        // fetchMore({
                        //     query: Q_GET_PROJECTS,
                        //     variables: {
                        //         queryString: queryString
                        //     },
                        //     updateQuery: (previousResult, { fetchMoreResult }) => {
                        //         if (!fetchMoreResult) return previousResult;
                        //         const { queryProject } = fetchMoreResult;
                                
                        //         // toChangeStateFactor('refreshing')((refreshing => refreshing = false));
                        //         console.log('【？？？】', previousResult.queryProject.data, queryProject.data);
                        //         return {
                        //             queryProject: {
                        //                 ...queryProject,
                        //                 data: previousResult.queryProject.data.concat(queryProject.data)
                        //             }
                        //         };
                        //     }
                        // });
                    }}
                >
                    <div className="lvyoto-home-list" key={list.length}>
                        {list.map((item, i) => (
                            <Link className="lvyoto-home-item" key={item.id} to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>
                                <img src={item.cover} alt='placeholder' />
                                <div className="item-info">
                                    <p>{item.title}</p>
                                    <p>
                                        {item.category ? <span className="financing">{IF_MODE_ENUM[item.category.toUpperCase()]}</span> : '' }
                                        {item.industry ? <span className="industry">{item.industry.title}</span> : ''}
                                    </p>
                                    <p>
                                        <span className="price">{item.amount}万元</span>
                                        <span className="province">{item.area ? item.area.title : '无'}</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="hdz-block-large-space" onClick={() => document.querySelector('.hdz-pull-refresh .lvyoto-home-item').scrollIntoView({ behavior: "smooth" })}></div>
                </PullToRefresh>
            </div>
        )
    }



    return (
        <div className="hdz-home-container">
            <Query
                query={Q_GET_PROJECTS}
                variables={{ queryString: buildingQuery(defaultVariables) }}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
            
        </div>
    )
};
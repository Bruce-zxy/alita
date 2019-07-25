import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query, ApolloConsumer } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import { LOCAL_URL } from '../config/common';

const GET_DATA_GQL = gql`{
    rates (currency: "USD") {
        currency 
        rate 
    }
}`

export default () => {
    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        financing: '',
        refreshing: false,
    })

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    const toShowFilterModal = () => {
        Modal.operation([
            { text: '按【股权融资】排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '股权融资') },
            { text: '按【债权融资】排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '债权融资') },
            { text: '清除排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '') },
        ])
    }

    const toRenderContentByApolloClient = ({ loading, error, data, refetch, networkStatus, startPolling, stopPolling }) => {
        if (networkStatus === 4) return <Loader />;
        if (loading) return <Loader />;
        if (error) return `【Error】 ${error.message}`;

        global.TNT('【当前状态】', thisState);

        const { time, amount, financing, refreshing } = thisState;
        let list = [];
        if (data.rates.length) {
            list = [].concat(data.rates);
            // 按时间排序，1为正序，2为倒序
            if (time % 3 !== 0) {
                let handler = time % 3 - 1 === 0 ? ((a, b) => a.time - b.time) : ((a, b) => b.time - a.time);
                list = list.sort(handler);
            }
            // 按金额排序，1为正序，2为倒序
            if (amount % 3 !== 0) {
                let handler = amount % 3 - 1 === 0 ? ((a, b) => a.time - b.time) : ((a, b) => b.time - a.time);
                list = list.sort(handler);
            }
            if (financing) {
                list = list.filter((item) => item.financing === financing);
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
                    <div className={`filter-factor state-${financing ? 'active' : 'none'}`} onClick={toShowFilterModal}>
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
                        toChangeStateFactor('refreshing')((refreshing => refreshing = true));
                        setTimeout(() => {
                            toChangeStateFactor('refreshing')((refreshing => refreshing = false));
                        }, 1000);
                    }}
                >
                    <div className="lvyoto-home-list">
                        {data && data.rates && data.rates.slice(0,10).map((item, i) => (
                            <Link className="lvyoto-home-item" key={i} to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>
                                <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                                <div className="item-info">
                                    <p>云南旅游大交通项目债权融资2200万元云南旅游大交通项目债权融资2200万元云南旅游大交通项目债权融资2200万元</p>
                                    <p>
                                        <span className="financing">债权融资</span>
                                        <span className="industry">旅游大交通</span>
                                        <span className="industry">旅游大交通</span>
                                        <span className="industry">旅游大交通</span>
                                    </p>
                                    <p>
                                        <span className="price">2200万元</span>
                                        <span className="province">云南</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="hdz-block-large-space" onClick={() => document.querySelector('.hdz-pull-refresh .lvyoto-home-item').scrollIntoView(true)}></div>
                </PullToRefresh>
            </div>
        )
    }

    return (
        <div className="hdz-home-container">
            <Query
                query={GET_DATA_GQL}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
            
        </div>
    )
};
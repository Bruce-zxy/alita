import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import { LOCAL_URL, COLOR_ARRAY } from '../config/common';

import '../style/service.scss';

const GET_DATA_GQL = gql`{
    rates (currency: "USD") {
        currency 
        rate 
    }
}`


export default (props) => {

    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        financing: '',
        refreshing: false,
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    const toShowFilterModal = () => {
        Modal.operation([
            { text: '按【股权投资】排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '股权投资') },
            { text: '按【债权投资】排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '债权投资') },
            { text: '清除排序', onPress: () => toChangeStateFactor('financing')(financing => financing = '') },
        ])
    }

    const toRenderContentByApolloClient = ({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
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

            global.TNT('【排序后】：', list);


            return (
                <div className="hdz-lvyoto-service">
                    <div className="lvyoto-filter-bar">
                        <div className={`publish-time state-${time % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('time')(time => time += 1)}>
                            <span>发布时间</span>
                            <i className="iconfont iconpaixu"></i>
                        </div>
                        <div className={`financing-amount state-${amount % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('amount')(amount => amount += 1)}>
                            <span>服务金额</span>
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
                        <div className="service-list">
                            {list.slice(0, 20).map((item, i) => (
                                <Link key={i} className="service-project" to={`${LOCAL_URL['SERVICE_DETAIL']}/${item.id}`}>
                                    <p className="project-name">北京企业资金1000万元投江西旅游酒店项目北京企业资金1000万元投江西旅游酒店项目{i}</p>
                                    <p className="project-tags">
                                        <span className="financing">债权投资</span>
                                        <span className="industry">旅游大交通2</span>
                                        <span className="industry">旅游大交通</span>
                                        <span className="industry">旅游大交通</span>
                                    </p>
                                    <div className="project-intro">
                                        <div>
                                            <p>&yen;1000万元</p>
                                            <p>投资金额</p>
                                        </div>
                                        <div>
                                            <p>成长期</p>
                                            <p>投资阶段</p>
                                        </div>
                                        <div>
                                            <p>未知</p>
                                            <p>资金类型</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <div className="hdz-block-large-space" onClick={() => document.querySelector('.hdz-pull-refresh .financing-project').scrollIntoView({ behavior: "smooth" })}></div>
                    </PullToRefresh>
                </div>
            )
        }

    }


    return (
        <div className="hdz-service-container">
            <Query
                query={GET_DATA_GQL}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
        </div>
    )
}
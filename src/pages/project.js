import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';
import { LOCAL_URL, COLOR_ARRAY } from '../config/common';

import '../style/project.scss';

const GET_DATA_GQL = gql`{
    rates (currency: "USD") {
        currency 
        rate 
    }
}`

const LookingFunds = () => {
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

    return (
        <Query
            query={GET_DATA_GQL}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
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
                        <div className="looking-funds">
                            <div className="lvyoto-filter-bar">
                                <div className={`publish-time state-${time % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('time')(time => time += 1)}>
                                    <span>发布时间</span>
                                    <i className="iconfont iconpaixu"></i>
                                </div>
                                <div className={`financing-amount state-${amount % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('amount')(amount => amount += 1)}>
                                    <span>资金金额</span>
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
                                <div className="financing-project-list">
                                    {list.slice(0, 10).map((item, i) => (
                                        <Link key={i} className="financing-project" to={`${LOCAL_URL['PROJECT_FUNDS']}/${item.id}`}>
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

            }}
        </Query>

    )
}

const JLFinancial = () => {
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

    return (
        <Query
            query={GET_DATA_GQL}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
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
                        <div className="jl-financial">
                            <div className="lvyoto-filter-bar">
                                <div className={`publish-time state-${time % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('time')(time => time += 1)}>
                                    <span>发布时间</span>
                                    <i className="iconfont iconpaixu"></i>
                                </div>
                                <div className={`financing-amount state-${amount % 3 ? 'active' : 'none'}`} onClick={() => toChangeStateFactor('amount')(amount => amount += 1)}>
                                    <span>金融金额</span>
                                    <i className="iconfont iconpaixu"></i>
                                </div>
                                <div className={`filter-factor state-${financing ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                                    <span>筛选</span>
                                    <i className="iconfont iconshaixuan-tianchong"></i>
                                </div>
                            </div>
                            <div className="financial-list">
                                {list.slice(0, 5).map((item, i) => (
                                    <div className="financial-item" style={{ backgroundColor: COLOR_ARRAY[i%5] }} key={i}>
                                        <div className="finnacial-item-left">
                                            <p>江旅定采通</p>
                                            <p>你采购 我付款</p>
                                            <p>
                                                <Link to={`${LOCAL_URL['PROJECT_FINANCING']}/${item.id}`}>查看详情</Link>
                                            </p>
                                        </div>
                                        <i className="iconfont iconcaiwu"></i>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            }}
        </Query>
    )
}

export default (props) => {
    
    const data = [{
        title: "找资金",
        className: 'project-looking-funds',
        content: <LookingFunds />
    }, {
        title: "江旅金融",
        className: 'project-jl-financial',
        content: <JLFinancial />
    }]

    return (
        <div className="hdz-lvyoto-project" id="project">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
};
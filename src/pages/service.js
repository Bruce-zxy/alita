import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import { buildingQuery } from '../utils/global';
import { Q_GET_PRODUCTS } from '../gql';

import Loader from '../components/Loader';
import { LOCAL_URL, COLOR_ARRAY } from '../config/common';

import '../style/service.scss';

const defaultVariables = {
    page: 0,
    limit: 1000,
    // join: [{ field: 'category' }],
    // sort: [{ field: 'sort', order: 'DESC' }, { field: 'create_at', order: 'DESC' }],
};

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
        if (data && data.queryProduct && data.queryProduct.data.length) {
            list = [].concat(data.queryProduct.data);
            // 按时间排序，1为正序，2为倒序
            if (time % 3 !== 0) {
                let handler = time % 3 - 1 === 0 ? ((a, b) => new Date(a.time) - new Date(b.time)) : ((a, b) => new Date(b.time) - new Date(a.time));
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
                                <Link key={i} className="service-item" to={`${LOCAL_URL['SERVICE_DETAIL']}/${item.id}`}>
                                    <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                                    <div className="service-info">
                                        <p>江西省旅游产业担保有限责任公司</p>
                                        <p>（旅游担保公司）</p>
                                        <p>
                                            <span className="service-tags">运营机构</span>
                                            <span className="service-location">所在地：江西</span>
                                        </p>
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
                query={Q_GET_PRODUCTS}
                variables={{ queryString: buildingQuery(defaultVariables) }}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
        </div>
    )
}
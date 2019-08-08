import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import { buildingQuery } from '../utils/global';
import { Q_GET_PROVIDERS } from '../gql';

import Loader from '../components/Loader';
import { LOCAL_URL, COLOR_ARRAY } from '../config/common';

import '../style/service.scss';

const defaultVariables = {
    page: 0,
    limit: 1000,
    join: [{ field: 'category' }, { field: 'area' }, { field: 'creator' }],
    sort: [{ field: 'create_at', order: 'DESC' }],
};

export default (props) => {

    let category_arr = [];
    let area_arr = [];

    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        area: '',
        refreshing: false,
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    const toShowFilterModal = () => {
        Modal.operation([
            { text: '按【股权投资】排序', onPress: () => toChangeStateFactor('area')(area => area = '股权投资') },
            { text: '按【债权投资】排序', onPress: () => toChangeStateFactor('area')(area => area = '债权投资') },
            { text: '清除排序', onPress: () => toChangeStateFactor('area')(area => area = '') },
        ])
    }

    const toRenderContentByApolloClient = ({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
        if (networkStatus === 4) return <Loader />;
        if (loading) return <Loader />;
        if (error) return `【Error】 ${error.message}`;
        global.TNT('【当前状态】', thisState);

        console.log(data);
        
        if (data) {
            const { queryProvider, providerCategoryTrees, metadataDescendantsTree } = data;
            const { time, amount, area, refreshing } = thisState;
            let list = [];
            category_arr = providerCategoryTrees.map(item => item.title);
            area_arr = metadataDescendantsTree.map(item => item.title);

            if (queryProvider && queryProvider.data.length) {
                list = [].concat(queryProvider.data);
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
                if (area) {
                    list = list.filter((item) => item.area === area);
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
                                <span>机构筛选</span>
                                <i className="iconfont iconpaixu"></i>
                            </div>
                            <div className={`filter-factor state-${area ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                                <span>地区筛选</span>
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
                                {list.map((item, i) => (
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
                            </div>
                            <div className="hdz-block-large-space"></div>
                        </PullToRefresh>
                    </div>
                )
            }
        }
    }

    return (
        <div className="hdz-service-container">
            <Query
                query={Q_GET_PROVIDERS}
                variables={{ queryString: buildingQuery(defaultVariables), metadataRoot: "地区" }}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
        </div>
    )
}
/* eslint-disable no-unused-expressions */
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { withApollo } from 'react-apollo';
import { CondOperator } from '@nestjsx/crud-request';
import { ActivityIndicator } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';

import { buildingQuery } from '../utils/global';
import { Q_GET_CAPITALS, Q_GET_PRODUCTS } from '../gql';

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';
import { LOCAL_URL, COLOR_ARRAY, ICON_ARRAY, IFT_MODE_ENUM } from '../config/common';

import '../style/project.scss';

const LookingFunds = withApollo((props) => {

    const { client } = props;

    const defaultVariables = {
        page: 0,
        limit: 10,
        join: [{ field: 'creator' }, { field: 'industry' }, { field: 'area' }, { field: 'stage' }, { field: 'type' }],
        sort: [{ field: 'create_at', order: 'DESC' }],
    };
    
    const [thisState, setState] = useState({
        time: 1,
        amount: '',
        industry: '',

        hasMore: true,
        data: [],
        industry_data: [],
        page: 0
    });

    const toSetState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }))
    }

    const toShowFilterModal = () => {
        const area = thisState.industry_data.map(are => ({ text: are.title, onPress: () => toSetState({ industry: are.title, page: 0 }) }))
        Modal.operation([
            ...area,
            { text: '清除筛选', onPress: () => toSetState({ industry: '', page: 0 }) },
        ])
    }

    useEffect(() => {

        if (!thisState.industry) {
            delete defaultVariables.filter;
        } else {
            defaultVariables.filter = [];
            thisState.industry ? defaultVariables.filter.push({ field: "industry.title", operator: CondOperator.EQUALS, value: thisState.industry }) : '';
        }

        defaultVariables.sort = [{
            field: 'amount',
            order: thisState.amount % 3 - 1 === 0 ? 'DESC' : 'ASC'
        }, {
            field: 'create_at',
            order: thisState.time % 3 - 1 === 0 ? 'DESC' : 'ASC'
        }];

        toLoadMore();
    }, [thisState.time, thisState.area, thisState.industry]);

    const toLoadMore = async () => {

        let data = [];
        if (thisState.page === 0) {
            data = [];
        } else {
            data = [].concat(thisState.data);
        }

        const this_page = thisState.page + 1;
        const res = await client.query({
            query: Q_GET_CAPITALS,
            variables: {
                queryString: buildingQuery({ ...defaultVariables, page: this_page })
            }
        });


        if (res.data && res.data.queryCapital) {
            const { data: { queryCapital, metadataTrees } } = res;
            const industry = metadataTrees[metadataTrees.findIndex((item => item.title === '行业'))].children;

            if (this_page >= queryCapital.pageCount) {
                toSetState({
                    data: data.concat(queryCapital.data),
                    industry_data: industry,
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryCapital.data),
                    industry_data: industry,
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    return (
        <div className="looking-funds">
            <div className="lvyoto-filter-bar">
                <div className={`publish-time state-${thisState.time % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ time: thisState.time += 1, page: 0 })}>
                    <span>发布时间</span>
                    <i className="iconfont iconpaixu"></i>
                </div>
                <div className={`financing-amount state-${thisState.amount % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ amount: thisState.amount + 1, page: 0 })}>
                    <span>资金金额</span>
                    <i className="iconfont iconpaixu"></i>
                </div>
                <div className={`filter-factor state-${thisState.industry ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                    <span>行业筛选</span>
                    <i className="iconfont iconshaixuan-tianchong"></i>
                </div>
            </div>
            <div className="financing-project-list">
                <InfiniteScroll
                    loadMore={toLoadMore}
                    hasMore={thisState.hasMore}
                    loader={<div key={0} style={{ margin: "1vh auto", display: "flex", justifyContent: "center" }}><ActivityIndicator /></div>}
                    useWindow={false}
                >
                    {thisState.data.map((item, i) => (
                        <Link key={i} className="financing-project" to={`${LOCAL_URL['PROJECT_FUNDS']}/${item.id}`}>
                            <p className="project-name">{item.title}{i}</p>
                            <p className="project-tags">
                                {item.category ? <span className="financing">{IFT_MODE_ENUM[item.category.toUpperCase()]}</span> : ''}
                                {item.industry.length ? item.industry.map(industry => (<span className="industry">{industry.title}</span>)) : ''}
                            </p>
                            <div className="project-intro">
                                <div>
                                    <p>&yen;{item.amount}万元</p>
                                    <p>投资金额</p>
                                </div>
                                <div>
                                    <p>{item.stage.length ? item.stage.map(stage => stage.title).join(',') : '未知'}</p>
                                    <p>投资阶段</p>
                                </div>
                                <div>
                                    <p>{item.type.length ? item.type.map(type => type.title).join(',') : '未知'}</p>
                                    <p>资金类型</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="hdz-block-large-space"></div>
                </InfiniteScroll>
            </div>
        </div>
    )

})

const JLFinancial = () => {

    const defaultVariables = {
        page: 0,
        limit: 1000
    };

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
            query={Q_GET_PRODUCTS}
            variables={{ queryString: buildingQuery(defaultVariables) }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
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
                        let handler = time % 3 - 1 === 0 ? ((a, b) => new Date(a.create_at) - new Date(b.create_at)) : ((a, b) => new Date(b.create_at) - new Date(a.create_at));
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
                                {list.map((item, i) => (
                                    <div className="financial-item" style={{ backgroundColor: COLOR_ARRAY[i%5] }} key={i}>
                                        <div className="finnacial-item-left">
                                            <p>{item.name}</p>
                                            <p>{item.slogan}</p>
                                            <p>
                                                <Link to={`${LOCAL_URL['PROJECT_FINANCING']}/${item.id}?index=${i}`}>查看详情</Link>
                                            </p>
                                        </div>
                                        <i className={`iconfont ${ICON_ARRAY[i % ICON_ARRAY.length]}`}></i>
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
    const { location, history } = props;
    const params_str = location.search.split("?")[1];
    const params = {};
    if (params_str) {
        params_str.split('&').forEach(str => {
            let [key, val] = str.split('=');
            params[key] = val;
        })
    }

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
            <TabPanel data={data} current={data[params.index] ? data[params.index].title : data[0].title} activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => history.push(`${location.pathname}?index=${to}`)} />
        </div>
    )
};
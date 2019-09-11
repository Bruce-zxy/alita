/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd-mobile';
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
import SUCCESS_IFT from '../images/successful_investment.png';

const LookingFunds = withApollo((props) => {

    const { client } = props;

    let metadata = [];
    let industry_data = [];

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        industry_data = metadata[metadata.findIndex(data => data.title === '行业')].children;
    } catch (err) {
        console.error(err.message);
    }

    const defaultVariables = {
        page: 0,
        limit: 10,
        join: [{ field: 'creator' }, { field: 'industry' }, { field: 'area' }, { field: 'stage' }, { field: 'type' }],
        filter: [{ field: "status", operator: CondOperator.IN, value: "checked,finished" }],
        sort: [{ field: 'create_at', order: 'DESC' }],
    };
    
    const [thisState, setState] = useState({
        time: 1,
        amount: '',
        industry: '',

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
        const area = industry_data.map(are => ({ text: are.title, onPress: () => toSetState({ industry: are.title, page: 0 }) }))
        Modal.operation([
            ...area,
            { text: '清除筛选', onPress: () => toSetState({ industry: '', page: 0 }) },
        ])
    }



    useEffect(() => {

        if (thisState.industry) {
            defaultVariables.filter = [
                { field: "status", operator: CondOperator.IN, value: "checked,finished" },
                { field: "industry.title", operator: CondOperator.EQUALS, value: thisState.industry }
            ];
        } else {
            defaultVariables.filter = [{ field: "status", operator: CondOperator.IN, value: "checked,finished" }];
        }

        defaultVariables.sort = [];
        if (thisState.amount % 3 !== 0) {
            defaultVariables.sort.push({
                field: 'amount',
                order: thisState.amount % 3 - 1 === 0 ? 'DESC' : 'ASC'
            })
        }
        if (thisState.time % 3 !== 0) {
            defaultVariables.sort.push({
                field: 'create_at',
                order: thisState.time % 3 - 1 === 0 ? 'DESC' : 'ASC'
            });
        }
        if (!defaultVariables.sort.length) {
            defaultVariables.sort.push({ field: 'create_at', order: 'DESC' });
        }

        toLoadMore();
    }, [thisState.time, thisState.amount, thisState.industry]);

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
            fetchPolicy: "no-cache",
            variables: {
                queryString: buildingQuery({ ...defaultVariables, page: this_page })
            }
        });

        if (res.data && res.data.queryCapital) {
            const { data: { queryCapital } } = res;

            if (this_page >= queryCapital.pageCount) {
                toSetState({
                    data: data.concat(queryCapital.data),
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryCapital.data),
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    global.TNT(thisState.data);

    return (
        <div className="looking-funds">
            <div className="lvyoto-filter-bar">
                <div className={`publish-time state-${thisState.time % 3 ? 'active' : 'none'}`} onClick={() => toSetState({ time: thisState.time + 1, page: 0 })}>
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
                        <Link key={i} className="financing-project" to={`${LOCAL_URL['FINANCE_FUNDS']}/${item.id}`}>
                            <p className="project-name">{item.title}</p>
                            <p className="project-tags">
                                {item.category ? <span className="financing">{IFT_MODE_ENUM[item.category.toUpperCase()]}</span> : ''}
                                {item.industry && item.industry.length ? item.industry.map(industry => (<span className="industry" key={industry.title}>{industry.title}</span>)) : ''}
                            </p>
                            <div className="project-intro">
                                <div>
                                    <p>&yen;{item.amount}万元</p>
                                    <p>投资金额</p>
                                </div>
                                <div>
                                    <p>{item.area ? item.area.title : '未知'}</p>
                                    <p>所在地区</p>
                                </div>
                                <div>
                                    <p>{item.type && item.type.length ? item.type.map(type => type.title).join(',') : '未知'}</p>
                                    <p>资金类型</p>
                                </div>
                            </div>
                            {item.status === 'finished' && (<div className="successful-investment" style={{ backgroundImage: `url(${SUCCESS_IFT}` }}></div>)}
                        </Link>
                    ))}
                    <div className="hdz-block-large-space"></div>
                </InfiniteScroll>
            </div>
        </div>
    )

})

const JLFinancial = withApollo((props) => {

    const { client } = props

    const defaultVariables = {
        page: 0,
        limit: 10,
        join: [{ field: 'category' }],
    };

    const [thisState, setState] = useState({
        time: 1,
        category: '',

        hasMore: true,
        data: [],
        category_data: [],
        page: 0
    });

    const toSetState = (obj) => {
        setState((prevState) => ({
            ...prevState,
            ...obj
        }))
    }

    const toShowFilterModal = () => {
        const category = thisState.category_data.map(category => ({ text: category.title, onPress: () => toSetState({ category: category.title, page: 0 }) }))
        Modal.operation([
            ...category,
            { text: '清除筛选', onPress: () => toSetState({ area: '', page: 0 }) },
        ]);
    }

    useEffect(() => {

        if (!thisState.category) {
            delete defaultVariables.filter;
        } else {
            defaultVariables.filter = [];
            thisState.category ? defaultVariables.filter.push({ field: "category.title", operator: CondOperator.EQUALS, value: thisState.category }) : '';
        }

        defaultVariables.sort = [{
            field: 'create_at',
            order: thisState.time % 3 - 1 === 0 ? 'DESC' : 'ASC'
        }];

        toLoadMore();
    }, [thisState.time, thisState.category]);

    const toLoadMore = async () => {

        let data = [];
        if (thisState.page === 0) {
            data = [];
        } else {
            data = [].concat(thisState.data);
        }

        const this_page = thisState.page + 1;
        const res = await client.query({
            query: Q_GET_PRODUCTS,
            fetchPolicy: "no-cache",
            variables: { queryString: buildingQuery({ ...defaultVariables, page: this_page }) }
        });

        if (res.data && res.data.queryProduct) {
            const { data: { queryProduct } } = res;

            if (this_page >= queryProduct.pageCount) {
                toSetState({
                    data: data.concat(queryProduct.data),
                    category_data: res.data.productCategoryTrees,
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryProduct.data),
                    category_data: res.data.productCategoryTrees,
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    global.TNT(thisState.data);

    return (
        <div className="jl-financial">
            <div className="lvyoto-filter-bar">
                <div className={`publish-time state-${thisState.time % 3 ? 'active' : 'none'}`} onClick={() => toSetState({time: thisState.time + 1, page: 0 })}>                             <span>发布时间</span>
                    <i className="iconfont iconpaixu"></i>
                </div>
                <div className={`filter-factor state-${thisState.category ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                    <span>筛选</span>
                    <i className="iconfont iconshaixuan-tianchong"></i>
                </div>
            </div>
            <div className="financial-list">
                <InfiniteScroll
                    loadMore={toLoadMore}
                    hasMore={thisState.hasMore}
                    loader={<div key={0} style={{ margin: "1vh auto", display: "flex", justifyContent: "center" }}><ActivityIndicator /></div>}
                    useWindow={false}
                >
                    {thisState.data.map((item, i) => (
                        <Link className="financial-item" to={`${LOCAL_URL['FINANCE_FINANCING']}/${item.id}?index=${i}`} style={{ backgroundColor: COLOR_ARRAY[i%5] }} key={i}>
                            <div className="finnacial-item-left">
                                <p>{item.name}</p>
                                <p>{item.slogan}</p>
                                <p>
                                    <a>查看详情</a>
                                </p>
                            </div>
                            <i className={`iconfont ${ICON_ARRAY[i % ICON_ARRAY.length]}`}></i>
                        </Link>
                    ))}
                </InfiniteScroll>
            </div>
        </div>
    )
})

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
            <TabPanel data={data} current={data[params.index] ? data[params.index].title : data[0].title} activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => global.TNT(props) || window.history.pushState({}, '', `${location.pathname}?index=${to}`)} />
        </div>
    )
};
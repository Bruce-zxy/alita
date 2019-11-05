/* eslint-disable no-unused-expressions */
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ActivityIndicator, Picker } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import { withApollo } from "react-apollo";
import { CondOperator } from '@nestjsx/crud-request';

import { buildingQuery, toGetLevel, toTransformAreaTreeProps, toGetParentArrayByChildNode } from '../utils/global';
import { Q_GET_PROVIDERS } from '../gql';

import Loader from '../components/Loader';
import { LOCAL_URL } from '../config/common';

import '../style/service.scss';

const defaultVariables = {
    page: 0,
    limit: 10,
    join: [{ field: 'category' }, { field: 'area' }, { field: 'creator' }],
    filter: [{ field: "status", operator: CondOperator.IN, value: "checked,finished,waiting,following" }],
    sort: [{ field: 'sort', order: 'DESC' }],
};

export default withApollo((props) => {

    const { client } = props;

    let metadata = [];
    let area_origin_set = [];
    let area_set = [];

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children;
        area_set = toTransformAreaTreeProps(area_origin_set, { key: 'title', value: 'title', children: 'children' });
    } catch (err) {
        console.error(err.message);
    }

    const [thisState, setState] = useState({ 
        time: 1,
        category: '',
        area: [],

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

    const toShowFilterModal_1 = () => {
        const category = thisState.category_data.map(cate => ({ text: cate.title, onPress: () => toSetState({ category: cate.title, page: 0 }) }))
        Modal.operation([
            ...category,
            { text: '清除排序', onPress: () => toSetState({ category: '', page: 0 }) },
        ])
    }

    useEffect(() => {

        if (!thisState.category && !thisState.area.length) {
            defaultVariables.filter = [];
        } else {
            defaultVariables.filter = [];
            thisState.category ? defaultVariables.filter.push({ field: "category.title", operator: CondOperator.EQUALS, value: thisState.category }) : '';
            thisState.area.length ? defaultVariables.filter.push({ field: "area.title", operator: CondOperator.EQUALS, value: thisState.area.pop() }) : '';
            defaultVariables.filter.push({ field: "status", operator: CondOperator.IN, value: "checked,finished,waiting,following" });
        }
        defaultVariables.filter.push({ field: "status", operator: CondOperator.IN, value: "checked,finished,waiting,following" });

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
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: false
                });
            } else {
                toSetState({
                    data: data.concat(queryProvider.data),
                    category_data: res.data.providerCategoryTrees,
                    page: this_page,
                    hasMore: true
                })
            }
        }
    }

    global.TNT(thisState.data)

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
                    <div className={`filter-factor state-${thisState.area.length ? 'active' : 'none'}`} onClick={() => 'toShowFilterModal_2'}>
                        <Picker
                            title="选择地区"
                            dismissText="清除"
                            onDismiss={() => toSetState({ area: [], page: 0 })}
                            onOk={(val) => toSetState({ area: val, page: 0 })}
                            value={thisState.area}
                            cascade={area_set && area_set[0] && area_set[0].children}
                            cols={toGetLevel(area_set)}
                            data={area_set}
                        >
                            <span>地区筛选</span>
                        </Picker>
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
                                        <span className="service-location">所在省份：{item.area ? (toGetParentArrayByChildNode(area_origin_set, { id: item.area.id }) || []).shift().title : '无'}</span>
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
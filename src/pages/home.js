import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, ActivityIndicator, Toast } from 'antd-mobile';
import InfiniteScroll from 'react-infinite-scroller';
import { withApollo } from "react-apollo";
import Draggable from 'react-draggable';
import { CondOperator } from '@nestjsx/crud-request';

import { buildingQuery, toGetParentArrayByChildNode } from '../utils/global';
import { Q_GET_PROJECTS } from '../gql';

import { LOCAL_URL, IF_MODE_ENUM } from '../config/common';

import '../style/home.scss';
import SUCCESS_IF from '../images/successful_financing.png';

const defaultVariables = {
    page: 0,
    limit: 10,
    join: [{field: "area"}],
    filter: [{ field: "status", operator: CondOperator.IN, value: "checked,finished,waiting,following" }],
    sort: [{ field: 'create_at', order: 'ASC' }],
};

export default withApollo((props) => {

    const { client, history } = props;

    let metadata = [];
    let area_origin_set = [];
    let industry_data = [];
    let user = {};

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children;
        industry_data = metadata[metadata.findIndex(data => data.title === '行业')].children;
        user = JSON.parse(localStorage.getItem('u_user'));
    } catch (err) {
        window.location.reload();
        console.error(err.message);
    }

    const [thisState, setState] = useState({
        time: 1,
        amount: 0,
        category: '',
        industry: '',
        area: '',

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
        let category = [
            { text: '按【股权融资】筛选', onPress: () => toSetState({ category: 'equity', page: 0 }) },
            { text: '按【债权融资】筛选', onPress: () => toSetState({ category: 'claim', page: 0 }) }
        ];
        Modal.operation([
            ...category,
            { text: '清除筛选', onPress: () => toSetState({ category: '', page: 0 }) },
        ])
    }

    const toShowAreaFilterModal = () => {
        const area = area_origin_set.sort((a, b) => a.title === '江西省' ? -1 : 1).map(are => ({ text: are.title, onPress: () => toSetState({ area: are, page: 0 }) }))
        Modal.operation([
            ...area,
            { text: '清除筛选', onPress: () => toSetState({ area: '', page: 0 }) },
        ])
    }

    const toShowIndustryFilterModal = () => {
        const area = industry_data.map(are => ({ text: are.title, onPress: () => toSetState({ industry: are.title, page: 0 }) }))
        Modal.operation([
            ...area,
            { text: '清除筛选', onPress: () => toSetState({ industry: '', page: 0 }) },
        ])
    }

    useEffect(() => {
        defaultVariables.filter = [{ field: "status", operator: CondOperator.IN, value: "checked,finished,waiting,following" }];
        if (thisState.category) {
            defaultVariables.filter.push({ field: "category", operator: CondOperator.EQUALS, value: thisState.category });
        }
        if (thisState.industry) {
            defaultVariables.filter.push({ field: "industry.title", operator: CondOperator.EQUALS, value: thisState.industry });
        }
        if (thisState.area) {
            defaultVariables.filter.push({ field: "area_path", operator: CondOperator.CONTAINS, value: thisState.area.title });
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
    }, [thisState.time, thisState.amount, thisState.category, thisState.industry, thisState.area]);

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
            fetchPolicy: "no-cache",
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

    const toPublish = () => {
        if (!user) {
            Toast.info('请先登录账号再发布');
            history.push(LOCAL_URL['SIGNIN']);
        } else if (user && user.vip === 0) {
            Toast.info('请先升级账号会员再发布');
            history.push(LOCAL_URL['PUBLISH_MEMBER']);
        } else {
            history.push(LOCAL_URL['PUBLISH_PROJECT']);
        }
    }

    global.TNT(thisState.data);

    return (
        <div className="hdz-home-container">
            <div className="hdz-lvyoto-home">
                <div className="lvyoto-filter-bar">
                    <div className={`filter-factor state-${thisState.industry ? 'active' : 'none'}`} onClick={toShowIndustryFilterModal}>
                        <span>所属行业</span>
                        <i className="iconfont iconshaixuan-tianchong"></i>
                    </div>
                    <div className={`filter-factor state-${thisState.area ? 'active' : 'none'}`} onClick={toShowAreaFilterModal}>
                        <span>所属地区</span>
                        <i className="iconfont iconshaixuan-tianchong"></i>
                    </div>
                    <div className={`filter-factor state-${thisState.category ? 'active' : 'none'}`} onClick={toShowFilterModal}>
                        <span>融资方式</span>
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
                                        <span className="province">{item.area ? (toGetParentArrayByChildNode(area_origin_set, { id: item.area.id }) || []).shift().title : '无'}</span>
                                    </p>
                                </div>
                                {item.status === 'finished' && (<div className="successful-financing" style={{ backgroundImage: `url(${SUCCESS_IF}` }}></div>) }
                            </Link>
                        ))}
                    </InfiniteScroll>
                </div>
                {!user || user.vip === 0 || user.identity === 'financer' ? (
                    <Draggable bounds="body">
                        <span className="publish-project" onClick={toPublish}>发布<br />项目</span>
                    </Draggable>
                ) : ''}
            </div>
        </div>
    )
});
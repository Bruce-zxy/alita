import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

const FundsList = (props) => {
    const { list } = props;

    if (list) {
        return (
            <div className="funds-list">
                {list.map((item, i) => (
                    <div className="funds-item" key={i}>
                        <p>
                            <span>{item.publish}</span>
                            <span>{item.status}</span>
                        </p>
                        <p>{item.name}</p>
                        <p>{item.tags && item.tags.map((tag, j) => <span key={j}>{tag}</span>)}</p>

                        <div className="project-intro">
                            <div>
                                <p>&yen;{item.price}万元</p>
                                <p>投资金额</p>
                            </div>
                            <div>
                                <p>{item.period}</p>
                                <p>投资阶段</p>
                            </div>
                            <div>
                                <p>{item.category}</p>
                                <p>资金类型</p>
                            </div>
                        </div>

                        <Link to="javascript:;" className="funds-category">编辑资金</Link>
                    </div>
                ))}
                <div className="funds-tips">审核未通过理由：完善资料并审核通过之后，系统将自动给您升级VIP等级并生成一张名片，名片可以和其他会员交换。</div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
            </div>
        )
    } else {
        return (
            <div className="funds-list none">暂无数据</div>
        )
    }
}

export default (props) => {

    const list = [{
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }, {
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }, {
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }, {
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }, {
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }, {
        name: "北京企业资金1000万元投江西旅游酒店项目",
        tags: ['股权投资', '酒店与民俗，旅行社'],
        publish: "2019-07-01 11:20:11",
        price: 2200,
        status: '审核中',
        period: '成长期',
        category: '企业资金，PE投资',
    }]

    const data = [{
        title: "全部",
        className: "my-funds",
        content: <FundsList list={list} />
    }, {
        title: "审核中",
        className: 'my-funds',
        content: <FundsList list={list} />
    }, {
        title: "已通过",
        className: 'my-funds',
        content: <FundsList list={list} />
    }, {
        title: "未通过",
        className: 'my-funds',
        content: <FundsList list={list} />
    }]

    return (
        <div className="hdz-funds-management" id="my-funds">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_FUNDS']} className="publish-funds">发布<br/>资金</Link>
        </div>
    )
}
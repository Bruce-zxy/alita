import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, IFT_MODE_ENUM, PROJECT_STATUS_ENUM_CN } from '../config/common';

import "../style/mine.scss";

const FundsList = (props) => {
    if (props.list.length) {
        return (
            <div className="funds-list">
                {props.list.map((item, i) => (
                    <Link className="funds-item" key={i} to={`${LOCAL_URL['PROJECT_FUNDS']}/${item.id}`}>
                        <p>
                            <span>{item.publish}</span>
                            <span>{item.status}</span>
                        </p>
                        <p>{item.name}</p>
                        <p>{item.tags && item.tags.map((tag, j) => tag && <span key={j}>{tag}</span>)}</p>

                        <div className="project-intro">
                            <div>
                                <p>&yen;{item.price}万元</p>
                                <p>投资金额</p>
                            </div>
                            <div>
                                <p>{item.stage.length ? item.stage.map(item => item.title).join('，') : '未知'}</p>
                                <p>投资阶段</p>
                            </div>
                            <div>
                                <p>{item.type.length ? item.type.map(item => item.title).join('，') : '未知'}</p>
                                <p>资金类型</p>
                            </div>
                        </div>

                        <Link to={`${LOCAL_URL['PUBLISH_FUNDS']}?id=${item.id}`} className="funds-category">编辑资金</Link>
                    </Link>
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

export default withApollo((props) => {

    const [user, updateUser] = useState(null);

    useEffect(() => {
        toFetchCurrentUser(props.client).then((user) => {
            if (user) {
                updateUser(user);
            }
        })
    }, []);

    const list = user && user.capitals ? user.capitals.map(capital => ({
        id: capital.id,
        name: capital.title,
        tags: [capital.cetegory ? IFT_MODE_ENUM[capital.cetegory.toUpperCase()] : '', capital.industry && capital.industry.length ? capital.industry.map(industry => industry.title).join('，') : ''],
        publish: moment(capital.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        price: capital.amount,
        status: PROJECT_STATUS_ENUM_CN[capital.status] || '未知',
        period: capital.stage && capital.stage.length ? capital.stage.map(stage => stage.title).join(',') : '未知',
        category: capital.type && capital.type.length ? capital.type.map(type => type.title).join(',') : '未知'
    })) : []

    const data = [{
        title: "全部",
        className: "my-funds",
        content: <FundsList list={list} />
    }, {
        title: "审核中",
        className: 'my-funds',
        content: <FundsList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['pending'])} />
    }, {
        title: "已通过",
        className: 'my-funds',
        content: <FundsList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['checked'])} />
    }, {
        title: "未通过",
        className: 'my-funds',
        content: <FundsList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['rejected'])} />
    }]

    return (
        <div className="hdz-funds-management" id="my-funds">
            <TabPanel data={data} current="全部" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_FUNDS']} className="publish-funds">发布<br/>资金</Link>
        </div>
    )
})
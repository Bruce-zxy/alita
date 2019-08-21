import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, IF_MODE_ENUM, PROJECT_STATUS_ENUM_CN } from '../config/common';

import "../style/mine.scss";

const ProjectList = (props) => {
    if (props.list.length) {
        return (
            <div className="project-list">
                {props.list.map((item, i) => (
                    <Link className="project-item" key={i} to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>
                        <p>
                            <span>{item.publish}</span>
                            <span>{item.status}</span>
                        </p>
                        <div className="project-content">
                            <img src={item.image} alt='cover' />
                            <div className="project-intro">
                                <p>{item.name}</p>
                                <p>{item.tags && item.tags.map((tag, j) => tag && <span key={j}>{tag}</span>)}</p>
                                <p>&yen;{item.price}万元</p>
                            </div>
                        </div>
                        <Link to={`${LOCAL_URL['PUBLISH_PROJECT']}?id=${item.id}`} className="project-category">编辑项目</Link>
                    </Link>
                ))}
                <div className="project-tips">审核未通过理由：完善资料并审核通过之后，系统将自动给您升级VIP等级并生成一张名片，名片可以和其他会员交换。</div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
                <div className="hdz-block-large-space"></div>
            </div>
        )
    } else {
        return (
            <div className="project-list none">暂无数据</div>
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

    const toSetVal = (val) => (key) => (def) => val ? val[key] : def;

    const list = user && user.projects ? user.projects.map(project => ({
        id: project.id,
        name: project.title,
        tags: [project.category ? IF_MODE_ENUM[project.category.toUpperCase()] : '', toSetVal(project.industry)('title')(null)],
        publish: moment(project.create_at*1).format('YYYY-MM-DD HH:mm:ss'),
        price: project.amount,
        status: PROJECT_STATUS_ENUM_CN[project.status] || '未知',
        image: project.cover
    })) : []

    const data = [{
        title: "全部",
        className: "my-project",
        content: <ProjectList list={list} />
    }, {
        title: "审核中",
        className: 'my-project',
        content: <ProjectList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['pending'])} />
    }, {
        title: "已通过",
        className: 'my-project',
        content: <ProjectList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['checked'])} />
    }, {
        title: "未通过",
        className: 'my-project',
        content: <ProjectList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['rejected'])} />
    }]

    return (
        <div className="hdz-project-management" id="my-project">
            <TabPanel data={data} current="全部" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_PROJECT']} className="publish-project">发布<br/>项目</Link>
        </div>
    )
})
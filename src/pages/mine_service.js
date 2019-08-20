import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, IF_MODE_ENUM } from '../config/common';

import "../style/mine.scss";

const ServiceList = (props) => {
    const { list } = props;

    if (list) {
        return (
            <div className="service-list">
                {list.map((item, i) => (
                    <div className="service-item" key={i}>
                        <p>{item.delivery}</p>
                        <div className="service-content">
                            <img src={item.image} alt='placeholder+image' />
                            <div className="service-intro">
                                <p>{item.name}{item.tags && item.tags.slice(0, 1).map((tag, j) => <span key={j}>{tag}</span>)}</p>
                                <p>发布时间：{item.publish}</p>
                                <p>
                                    <i className="iconfont iconyonghu"></i>
                                    <span>{item.concat}</span>
                                    <i className="iconfont icondianhua"></i>
                                    <span>{item.phone}</span>
                                </p>
                            </div>
                        </div>
                        <Link to="javascript:;" className="service-category">项目详情</Link>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="service-list none">暂无数据</div>
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

    const project_list = user && user.apply_projects ? user.apply_projects.map(project => ({
        name: project.project.title,
        tags: [IF_MODE_ENUM[project.project.category.toUpperCase()]],
        publish: moment(project.project.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        delivery: moment(project.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        concat: project.project.creator.realname,
        phone: project.project.creator.phone,
        image: project.project.cover
    })) : [];

    const data = [{
        title: "项目",
        className: 'my-service',
        content: <ServiceList list={project_list} />
    }, {
        title: "资金",
        className: 'my-service',
        content: <ServiceList list={project_list} />
    }]

    return (
        <div className="hdz-my-service" id="my-service">
            <TabPanel data={data} current="项目" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
})
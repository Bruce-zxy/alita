import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import Loader from '../components/Loader';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, IF_MODE_ENUM, IFT_MODE_ENUM } from '../config/common';

import "../style/mine.scss";

const FundsList = (props) => {
    if (props.list.length) {
        return (
            <div className="service-list">
                {props.list.map((item, i) => (
                    <div key={i} className="financing-project">
                        <p className="project-name"><Link to={`${LOCAL_URL['FINANCE_FUNDS']}/${item.id}`}>{item.title}</Link></p>
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
                                <p>{item.stage && item.stage.length ? item.stage.map(stage => stage.title).join(',') : '未知'}</p>
                                <p>投资阶段</p>
                            </div>
                            <div>
                                <p>{item.type && item.type.length ? item.type.map(type => type.title).join(',') : '未知'}</p>
                                <p>资金类型</p>
                            </div>
                        </div>
                        <p className="card-bottom">
                            <i className="iconfont iconyonghu"></i>
                            <span>{item.contact}</span>
                            <i className="iconfont icondianhua"></i>
                            <span><a href={`tel:${item.phone}`}>{item.phone}</a></span>
                        </p>
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

const ProjectList = (props) => {
    if (props.list.length) {
        return (
            <div className="service-list">
                {props.list.map((item, i) => (
                    <div className="service-item" key={i}>
                        <p>{item.delivery}</p>
                        <div className="service-content">
                            <img src={item.image} alt='cover' />
                            <div className="service-intro">
                                <p><a href={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>{item.name}</a>{item.tags && item.tags.slice(0, 1).map((tag, j) => <span key={j}>{tag}</span>)}</p>
                                <p>发布时间：{item.publish}</p>
                                <p>
                                    <i className="iconfont iconyonghu"></i>
                                    <span>{item.concat}</span>
                                    <i className="iconfont icondianhua"></i>
                                    <span><a href={`tel:${item.phone}`}>{item.phone}</a></span>
                                </p>
                            </div>
                        </div>
                        <Link to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`} className="service-category">项目详情</Link>
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

    const funds_list = user && user.apply_capitals ? user.apply_capitals.map(capital => ({ ...capital.capital })) : [];
    
    const project_list = user && user.apply_projects ? user.apply_projects.map(project => ({
        id: project.project.id,
        name: project.project.title,
        tags: [IF_MODE_ENUM[project.project.category.toUpperCase()]],
        publish: moment(project.project.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        delivery: moment(project.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        concat: project.project.contact,
        phone: project.project.phone,
        image: project.project.cover
    })) : [];

    const data = [{
        title: "项目",
        className: 'my-service',
        content: <ProjectList list={project_list} />
    }, {
        title: "资金",
        className: 'my-service',
        content: <FundsList list={funds_list} />
    }]

    return (
        <div className="hdz-my-service" id="my-service">
            <TabPanel data={data} current="项目" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => global.TNT(`from ${from} to ${to}`)} />
            {!user && <Loader />}
        </div>
    )
})
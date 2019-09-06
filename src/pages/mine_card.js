import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import Loader from '../components/Loader';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL } from '../config/common';

import "../style/mine.scss";

export default withApollo((props) => {

    const [user, updateUser] = useState(null);

    useEffect(() => {
        toFetchCurrentUser(props.client).then((user) => {
            if (user) {
                updateUser(user);
            }
        })
    }, []);

    const list = user && user.apply_providers ? user.apply_providers.map(provider => ({
        id: provider.provider.id,
        company: provider.provider.name || '未知',
        tags: [provider.provider.category.title],
        location: provider.provider.area.title || '未知',
        create: moment(provider.create_at*1).format('YYYY-MM-DD HH:mm:ss'),
        logo: provider.provider.logo,
        concat: provider.provider.creator.realname || '未知',
        phone: provider.provider.creator.phone || '未知'
    })) : [];

    return (
        <div className="hdz-business-card">
            <div className="business-card-list">
                {list.length ? list.map((item, i) => (
                    <div className="business-card-item" key={i}>

                        <div className="card-top">
                            <Link to={`${LOCAL_URL['SERVICE_DETAIL']}/${item.id}`} >
                                <p>{item.create}</p>
                                <div className="business-card-content">
                                    <img src={item.logo} alt='logo' />
                                    <div className="business-card-intro">
                                        <p>{item.company}</p>
                                        <p>
                                            {item.tags && item.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                                            <span>所在地：{item.location}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <p className="card-bottom">
                            <i className="iconfont iconyonghu"></i>
                            <span>{item.concat}</span>
                            <i className="iconfont icondianhua"></i>
                            <span><a href={`tel:${item.phone}`}>{item.phone}</a></span>
                        </p>

                        <Link to={`${LOCAL_URL['SERVICE_DETAIL']}/${item.id}`} className="card-category">服务商详情</Link>

                    </div>
                )) : <div style={{ textAlign: "center" }}>暂无数据</div>}
                {!user && <Loader />}
            </div>
        </div>
    )
})
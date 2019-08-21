import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import { LOCAL_URL } from '../config/common';
import Loader from '../components/Loader';
import { toFetchCurrentUser } from '../utils/global';
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

    const data = user && user.apply_products ? user.apply_products.map(product => ({
        id: product.product.id,
        name: product.product.name,
        tags: [product.product.category.title],
        date: moment(product.create_at * 1).format('YYYY-MM-DD HH:mm:ss'),
        icon: product.product.cover,
        // status: "待审核",
        // execution: ['取消', '执行']
    })) : [];

    return (
        <div className="hdz-financial-service">
            <div className="service-list">
                {data.map((item, i) => (
                    <Link className="service-item" to={`${LOCAL_URL['PROJECT_FINANCING']}/${item.id}`}>
                        <p>{item.date}</p>
                        <div className="service-intro">
                            <img src={item.icon} alt='icon' />
                            <div className="service-name">
                                <p>{item.name}</p>
                                <p>{item.tags && item.tags.slice(0,1).map((tag, j) => <span key={j}>{tag}</span>)}</p>
                            </div>
                            {/* <div className="service-status">{item.status}</div>
                            <div className="service-execution">{item.execution && item.execution.slice(0,2).map((execute, k) => <span key={k}>{execute}</span>)}</div> */}
                        </div>
                    </Link>
                ))}
                <Link to={`${LOCAL_URL['PROJECT']}?index=1`} className="service-apply">去申请</Link>
                {!user && <Loader />}
            </div>
        </div>
    )
})
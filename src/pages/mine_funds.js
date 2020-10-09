import React, { useState, useEffect, Fragment } from 'react';
import { Modal, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { withApollo } from "react-apollo";
import * as moment from 'moment';

import TabPanel from '../components/TabPanel';
import { toFetchCurrentUser } from '../utils/global';
import { LOCAL_URL, IFT_MODE_ENUM, PROJECT_STATUS_ENUM_CN, PROJECT_STATUS_ENUM } from '../config/common';
import { M_APPROVAL_CAPITAL } from '../gql';

import "../style/mine.scss";

const FundsList = withApollo((props) => {
    const toApprovalProject = async (target) => {
        const { data } = await props.client.mutate({
            mutation: M_APPROVAL_CAPITAL,
            variables: {
                data: {
                    id: target.id,
                    status: PROJECT_STATUS_ENUM.FINISHED
                }
            }
        });
        if (data && data.result) {
            Toast.success('操作成功！');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            Toast.fail('操作失败！');
        }
    }
    const toCompleteProject = (target) => (e) => {
        e.stopPropagation();
        Modal.alert(`我已投资完成，不需要再联系。`, '是否确认完成此次申请？', [
            { text: '取消', onPress: () => global.TNT('已取消') },
            { text: '确认', onPress: () => toApprovalProject(target) },
        ])
    }
    if (props.list.length) {
        
        return (
            <div className="funds-list">
                {props.list.map((item, i) => (
                    <Fragment>
                        <Link className="funds-item" key={i} to={`${LOCAL_URL['FINANCE_FUNDS']}/${item.id}`}>
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
                                    <p>{item.area_path.split(' ')[0]}</p>
                                    <p>投资地区</p>
                                </div>
                                <div>
                                    <p>{item.category}</p>
                                    <p>资金类型</p>
                                </div>
                            </div>

                            {item.status === '已通过' ? (
                                <>
                                <Link to={`${LOCAL_URL['PUBLISH_FUNDS']}?id=${item.id}`} className="funds-editor">编辑资金</Link>
                                <a onClick={toCompleteProject(item)} className="funds-category">完成资金</a> 
                                </>
                            ) : item.status === '已完成' ? (
                                ''
                            ) : (
                                <Link to={`${LOCAL_URL['PUBLISH_FUNDS']}?id=${item.id}`} className="funds-editor">编辑资金</Link>
                            )}
                        </Link>
                        {item.status === PROJECT_STATUS_ENUM_CN['rejected'] && <div className="funds-tips">审核未通过理由：{item.reason}</div>}
                    
                    </Fragment>
                ))}
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
})

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
        category: capital.type && capital.type.length ? capital.type.map(type => type.title).join(',') : '未知',
        reason: capital.reason,
        area_path: capital.area_path
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
    }, {
        title: "已完成",
        className: 'my-funds',
        content: <FundsList list={list.filter(item => item.status === PROJECT_STATUS_ENUM_CN['finished'])} />
    }]

    return (
        <div className="hdz-funds-management" id="my-funds">
            <TabPanel data={data} current="全部" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => global.TNT(`from ${from} to ${to}`)} />
            <Link to={LOCAL_URL['PUBLISH_FUNDS']} className="publish-funds">发布<br/>资金</Link>
        </div>
    )
})
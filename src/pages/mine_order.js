import React, { Fragment, Component } from 'react';
import { Tabs } from 'antd-mobile';
// import { createForm } from 'rc-form';
// import moment from 'moment';
import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL } = config;

const ACTIVE_COLOR = '#FF6F70';
const FULL_STATE_CN = ['待派单', '待接单', '待确认', '待结单', '已结单', '已取消'];
const FULL_STATE_EN = ['PENNDING', 'WAITING', 'TO_BE_CONFIRMED', 'TO_BE_CLOSED', 'CLOSED', 'CANCEL'];
const CAN_BE_CANCELED_STATE = ['待派单', '待接单', '待确认', '待结单'];
const CAN_BE_CONFIRMED_STATE = ['待确认', '待结单'];

const order_list = [{
    id: 1,
    date: '2019-06-15',
    tags: ['理论政策宣讲', '教育素质提升'],
    title: '“获泽习语”志愿服务',
    image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    state: '已结单'
}, {
    id: 2,
    date: '2019-06-15',
    tags: ['理论政策宣讲', '教育素质提升'],
    title: '“获泽习语”志愿服务',
    image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    state: '待派单'
}, {
    id: 3,
    date: '2019-06-15',
    tags: ['理论政策宣讲', '教育素质提升'],
    title: '“获泽习语”志愿服务',
    image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    state: '待接单'
}, {
    id: 4,
    date: '2019-06-15',
    tags: ['理论政策宣讲', '教育素质提升'],
    title: '“获泽习语”志愿服务',
    image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    state: '待确认'
}, {
    id: 5,
    date: '2019-06-15',
    tags: ['理论政策宣讲', '教育素质提升'],
    title: '“获泽习语”志愿服务',
    image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
    state: '已取消'
}]

const tabs = [{
    title: '全部'
}, {
    title: '待派单'
}, {
    title: '待接单'
}, {
    title: '待确认'
}, {
    title: '待结单'
}, {
    title: '已结单'
}];

const service_details = {
    id: 1,
    title: '“多彩文艺”志愿服务',
    tags: ['文化文明'],
    state: '待派单',
    images: ['http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'],
    description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
    notice: '<p>1、教练正在鼓励和帮助孩子们在冰面上保持平衡和基本动作。</p><p>2、考虑到孩子们的特殊性, 华星冰上中心特意使用整个冰球馆让他们参观体验, 面对上千平米的室内冰场, 孩子们充满了兴奋与好奇。</p>'
}

export default class extends Component {

    toRenderOrderListTabContent = (type) => (data) => (
        <div className="mine-order-list">
            {data.sort((a,b) => new Date(b.date) - new Date(a.date)).map((item, i) => [
                <div className={`mine-order-item ${FULL_STATE_EN[FULL_STATE_CN.findIndex((state) => state === item.state)]}`} key={item.id}>
                    <p className="order-date" >{item.date}</p>
                    <div className="order-info">
                        <div className="order-image">
                            <img src={item.image} alt="order-images" />
                        </div>
                        <div className="order-content">
                            <a className="order-title" href={`${LOCAL_URL['ORDER']}/${type}/${item.id}`}>{item.title}</a>
                            <p className="order-tags">
                                {item.tags && item.tags.map((tag, j) => (
                                    <span key={j}>{tag}</span>
                                ))}
                            </p>
                            <p className="order-functions">
                                {CAN_BE_CANCELED_STATE.includes(item.state) && <span>取消订单</span>}
                                {type === 'wantdo' && CAN_BE_CONFIRMED_STATE.includes(item.state) && <span className="confirm">确认</span>}
                            </p>
                        </div>
                    </div>
                    <span className="order-state">{item.state}</span>
                </div>,
                <div className="hdz-block-space" key={i}></div>
            ])}
        </div>
    )

    toRenderOrderList = (type) => {
        const list = order_list;
        return (
            <Tabs tabs={tabs}
                tabBarActiveTextColor={ACTIVE_COLOR}
                tabBarUnderlineStyle={{ borderColor: ACTIVE_COLOR }}
                renderTabBar={(props) => <Tabs.DefaultTabBar {...props} page={tabs.length} />}
            >
                {this.toRenderOrderListTabContent(type)(list)}

                <div className="mine-order-list">
                    Content of 2 tab
                </div>
                <div className="mine-order-list">
                    Content of 3 tab
                </div>
                <div className="mine-order-list">
                    Content of 4 tab
                </div>
                <div className="mine-order-list">
                    Content of 5 tab
                </div>
                <div className="mine-order-list">
                    Content of 6 tab
                </div>
            </Tabs>
        )
    }

    toRenderOrderDetails = (type, id) => {
        const details = service_details;
        return (
            <div className="hdz-mine-order-details">
                <div className="order-details-state">
                    <p>{details.state} <i className="iconfont iconjiantouyou"></i></p>
                </div>
                <div className="order-details-header">
                    <p className="order-title">{details.title}</p>
                    <p className="order-tags">
                        {details.tags && details.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </p>
                    <p className="order-images">
                        {details.images && details.images.map((image) => (
                            <img src={image} alt="order-images" key={image} />
                        ))}
                    </p>
                </div>
                <div className="hdz-block-space"></div>
                <div className="order-details-intro">
                    <p>服务详情</p>
                    <div>{details.description}</div>
                </div>
                <div className="hdz-block-space"></div>
                <div className="order-details-notice">
                    <p>订单信息</p>
                    <div dangerouslySetInnerHTML={{ __html: details.notice }}></div>
                </div>
            </div>
        )
    }

    render() {
        const { match: { params: { type,id } } } = this.props;
        console.log(type, id);
        
        return (
            <div className="hdz-mine-order">
                {id ? this.toRenderOrderDetails(type) : this.toRenderOrderList(type, id)}
            </div>
        )
    }
}
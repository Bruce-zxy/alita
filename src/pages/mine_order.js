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

export default class extends Component {

    toRenderOrderList = (type) => (data) => (
        <div className="mine-order-list">
            {data.sort((a,b) => new Date(b.date) - new Date(a.date)).map((item, i) => [
                <div className={`mine-order-item ${FULL_STATE_EN[FULL_STATE_CN.findIndex((state) => state === item.state)]}`} key={item.id}>
                    <p className="order-title">{item.date}</p>
                    <div className="order-info">
                        <div className="order-image">
                            <img src={item.image} alt="order-images" />
                        </div>
                        <div className="order-content">
                            <p>{item.title}</p>
                            <p>
                                {item.tags && item.tags.map((tag, j) => (
                                    <span key={j}>{tag}</span>
                                ))}
                            </p>
                            <p>
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

    render() {
        const { match: { params: { type } } } = this.props;
        console.log(type);
        
        const list = order_list;
        return (
            <div className="hdz-mine-order">
                <Tabs tabs={tabs}
                    tabBarActiveTextColor={ACTIVE_COLOR}
                    tabBarUnderlineStyle={{ borderColor: ACTIVE_COLOR }}
                    renderTabBar={(props) => <Tabs.DefaultTabBar {...props} page={tabs.length} />}
                >
                    {this.toRenderOrderList(type)(list)}


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
            </div>
        )
    }
}
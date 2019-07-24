import React, { Fragment, Component, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Toast, Modal } from 'antd-mobile';
import _ from 'lodash';
import * as moment from 'moment';

import ShopContext from '../context/shop';

import config from '../lib/config';
import superFetch from '../lib/api';
import { getSearch } from '../lib/persistance';

const { LOCAL_URL } = config;

const ACTIVE_COLOR = '#FF6F70';
const COMMON_ORDER_STATUS = ['全部', '待派单', '待接单', '待确认', '待结单', '已作废']
const VOLUNTEER_ORDER_STATUS = ['全部', '待接单', '待确认', '待结单', '已结单', '已作废']

// const order_list = [{
//     id: 1,
//     date: '2019-06-15',
//     tags: ['理论政策宣讲', '教育素质提升'],
//     title: '“获泽习语”志愿服务',
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
//     state: '已结单'
// }, {
//     id: 2,
//     date: '2019-06-15',
//     tags: ['理论政策宣讲', '教育素质提升'],
//     title: '“获泽习语”志愿服务',
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
//     state: '待派单'
// }, {
//     id: 3,
//     date: '2019-06-15',
//     tags: ['理论政策宣讲', '教育素质提升'],
//     title: '“获泽习语”志愿服务',
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
//     state: '待接单'
// }, {
//     id: 4,
//     date: '2019-06-15',
//     tags: ['理论政策宣讲', '教育素质提升'],
//     title: '“获泽习语”志愿服务',
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
//     state: '待确认'
// }, {
//     id: 5,
//     date: '2019-06-15',
//     tags: ['理论政策宣讲', '教育素质提升'],
//     title: '“获泽习语”志愿服务',
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
//     state: '已取消'
// }]

// const tabs = [{
//     title: '全部'
// }, {
//     title: '待派单'
// }, {
//     title: '待接单'
// }, {
//     title: '待确认'
// }, {
//     title: '待结单'
// }, {
//     title: '已结单'
// }];

// const service_details = {
//     id: 1,
//     title: '“多彩文艺”志愿服务',
//     tags: ['文化文明'],
//     state: '待派单',
//     images: ['http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效'],
//     description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
//     notice: '<p>1、教练正在鼓励和帮助孩子们在冰面上保持平衡和基本动作。</p><p>2、考虑到孩子们的特殊性, 华星冰上中心特意使用整个冰球馆让他们参观体验, 面对上千平米的室内冰场, 孩子们充满了兴奋与好奇。</p>'
// }

class MineOrder extends Component {
    constructor(props) {
        super(props);
        const params = getSearch();
        const tab_index_obj = _.find(params, (o) => !!o['tab']);
        const tab_index = tab_index_obj && !isNaN(tab_index_obj.tab) ? tab_index_obj.tab : 0;
        this.state = { tab_index };
    }

    orderHandler = (action) => (flow) => () => {
        Modal.alert('操作确认', `是否确定对此进行【${action}】操作?`, [{ 
                text: '取消', 
                onPress: () => {} 
            }, { 
                text: '确认', 
                onPress: async () => {
                    const res = await superFetch.post('/flow/dispatch', {
                        action,
                        flow,
                        option: this.props.operator
                    });

                    if (res instanceof Error || !res) {
                        Toast.fail('操作失败！');
                    }else {
                        this.props.toRefreshOrderInfo();
                        Toast.success('操作成功！');
                    }   
                }
            }
        ])
    }

    toRenderOrderListTabContent = (type) => (list) => (tabs) => (tab) => {
        const { service } = this.props;
        const data_set = list.sort((a,b) => new Date(a.create_at) - new Date(b.create_at)).map(item => {
            const item_service = _.find(service, { id: item.target });
            return {
                ...item,
                date: moment(item.create_at).format('YYYY-MM-DD HH:mm:ss'),
                actions: item.ExecutableTasks,
                tags: item_service ? [item_service.category.name] : [],
                title: item_service ? item_service.title : '',
                image: item_service ? item_service.coverPath : '',
                state: item.state,
            }
        });
        const data_use = data_set.filter(item => tab.title === '全部' ? true : tab.title === item.state).sort((a, b) => new Date(b.date) - new Date(a.date));
        if (!data_use.length) {
            return (
                <div className="mine-order-list">
                    <p className="list-empty">暂无此类型订单</p>
                </div>
            )
        } else {
            return (
                <div className="mine-order-list">
                    {data_use.map((item, i) => [
                        <div className={`mine-order-item  mine-order-state-${tabs.findIndex(state => state.title === item.state)}`} key={item.id}>
                            <p className="order-date" >{item.date}</p>
                            <div className="order-info">
                                <div className="order-image">
                                    <img src={item.image} alt="order-images" />
                                </div>
                                <div className="order-content">
                                    <Link className="order-title" to={`${LOCAL_URL['ORDER']}/${type}/${item.id}`}>{item.title}</Link>
                                    <p className="order-tags">
                                        {item.tags && item.tags.map((tag, j) => (
                                            <span key={j}>{tag}</span>
                                        ))}
                                    </p>
                                    <p className="order-functions">
                                        {item.actions.map(action => <span key={action} onClick={this.orderHandler(action)(item.id)}>{action}</span>)}
                                    </p>
                                </div>
                            </div>
                            <span className="order-state">{item.state}</span>
                        </div>,
                        <div className="hdz-block-space" key={i}></div>
                    ])}
                </div>
            )
        }
    }

    toRenderOrderList = (type) => {
        const { requirements, tasks, user } = this.props;
        const { tab_index } = this.state;

        const list = type === 'todo' ? tasks : requirements;
        let tabs = [];
        if (!!user && user.isVolunteer) {
            tabs = VOLUNTEER_ORDER_STATUS.map(status => ({ title: status }));
        } else {
            tabs = COMMON_ORDER_STATUS.map(status => ({ title: status }));
        }
        // if (list.length) {
        //     tabs = [].concat(list[0].template.ex_info.flowSteps.map(item => ({ title: item.name })))
        //     tabs.unshift({ title: '全部' });
        // }
        
        return (
            <Tabs 
                tabs={tabs}
                page={tab_index*1}  // 很重要！！完全不知道为什么一定要是数字型的才能跳转！！
                tabBarActiveTextColor={ACTIVE_COLOR}
                tabBarUnderlineStyle={{ borderColor: ACTIVE_COLOR }}
                onChange={(tab, index) => this.setState({ tab_index: index })}
                renderTabBar={(props) => <Tabs.DefaultTabBar {...props} page={window.innerWidth > 350 ? 5 : 4} activeTab={tab_index} onTabClick={(tab, index) => this.setState({ tab_index: index })}/>}
            >
                {this.toRenderOrderListTabContent(type)(list || [])(tabs)}
            </Tabs>
        )
    }

    toRenderOrderDetails = (type, id) => {
        const { service, requirements, tasks, user } = this.props;
        const list = type === 'todo' ? tasks : requirements;
        const flow = _.find(list, { id: id });
        let details = {};
        if (flow) {
            details = _.find(service, { id: flow.target });
            if (details) {
                details.tags = [details.category.name];
                details.images = details.albumList.map(item => item.url);
                details.description = details.desc;
                details.state = flow.state;
            } else {
                details = {};
            }
        }
        console.log(flow);
        console.log(details);
        
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
                    <div>
                        <p className="order-number">
                            <label>订单号</label>
                            <span>{flow && flow.id}</span>
                        </p>
                        <p className="order-time">
                            <label>下单时间</label>
                            <span>{moment(flow && flow.create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </p>
                        <p className="order-state">
                            <label>订单状态</label>
                            <span>{flow && flow.state}</span>
                        </p>
                        <p className="order-title">
                            <label>服务标题</label>
                            <span>{flow && flow.ex_info && flow.ex_info.service && flow.ex_info.service.title}</span>
                        </p>
                        <p className="order-category">
                            <label>服务标题</label>
                            <span>{flow && flow.ex_info && flow.ex_info.service && flow.ex_info.service.category.name}</span>
                        </p>
                        <p className="order-name">
                            <label>申请者姓名</label>
                            <span>{flow && flow.ex_info && flow.ex_info.realName}</span>
                        </p>
                        <p className="order-name">
                            <label>申请者联系方式</label>
                            <span>{flow && flow.ex_info && flow.ex_info.phone}</span>
                        </p>
                        <p className="order-name">
                            <label>申请者联系地址</label>
                            <span>{flow && flow.ex_info && flow.ex_info.address}</span>
                        </p>
                        <p className="order-name">
                            <label>要求服务时间</label>
                            <span>{flow && flow.ex_info && flow.ex_info.date}</span>
                        </p>
                        <p className="order-name">
                            <label>其他要求</label>
                            <span>{flow && flow.ex_info && flow.ex_info.other}</span>
                        </p>
                    </div>
                </div>
                <div className="hdz-block-space-20"></div>
                <div className="hdz-block-space-20"></div>
                <div className="hdz-block-space-20"></div>
                <div className="order-details-function">
                    <Link to={`${LOCAL_URL['COMPLAINT']}?id=${flow && flow.id}&type=${type}`}>我要投诉</Link>
                    {user.isVolunteer && type === "todo" && 1/* item.actions.map(action => <span key={action} onClick={this.orderHandler(action)(item.id)}>{action}</span>) */}
                    {user && ['待派单', '待接单'].includes(details.state) && <a href="javascript:;" onClick={this.orderHandler('作废')(flow)}>取消订单</a>}
                </div>
            </div>
        )
    }

    render() {
        const { match: { params: { type, id } } } = this.props;
        return (
            <div className="hdz-mine-order">
                {id ? this.toRenderOrderDetails(type, id) : this.toRenderOrderList(type)}
            </div>
        )
    }
}

export default (props) => {
    const shopContext = useContext(ShopContext);
    
    useEffect(() => {
        if (!!shopContext.user) {
            shopContext.getOrder();
        }
    }, [])

    return (
        <Fragment>
            <MineOrder 
                {...props} 
                user={shopContext.user}
                service={shopContext.service[0] || []} 
                requirements={shopContext.requirements[0] || []} 
                tasks={shopContext.tasks[0] || []} 
                operator={shopContext.user}
                toRefreshOrderInfo={shopContext.getOrder}
            />
        </Fragment>
    )
}
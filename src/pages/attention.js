import React, { Component, Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd-mobile';
import _ from 'lodash';
import * as moment from 'moment';

import Carousel from '../components/Carousel';

import ShopContext from '../context/shop';
import config from '../lib/config';
import superFetch from '../lib/api';

const gPageUrl = config.LOCAL_URL;

// const carousel_list = [{
//     id: '1',
//     link: 'javascript:;',
//     image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=1',
//     title: '这是1个标题'
// }];

// const type_list = [{
//     id: '1',
//     type: '理论政策',
//     list: [{
//         id: 1,
//         title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
//         image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
//         description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
//         interval: '17分钟前',
//         link: ''
//     }, {
//         id: 2,
//         title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
//         image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
//         description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
//         interval: '17分钟前',
//         link: ''
//     }]
// }];


class Attention extends Component {

    constructor(props) {
        super(props);
        this.state = {
            navi_show: false,
            current: 0
        }
    }

    toShowPanel = (e) => {
        e.preventDefault();
        this.setState({ navi_show: true });
    }
    toHidePanel = (e) => {
        e.preventDefault();
        if (e.target.className === 'attention-panel-mask active' || e.target.tagName === 'SPAN') {
            this.setState({ navi_show: false });
        }
    }
    toSetCurrentTab = (index) => this.setState({ current: index })

    toRenderTabHeader = props => (
        <div className="attention-tabs">
            <Tabs.DefaultTabBar {...props} page={window.innerWidth < 350 ? 3 : 4} />
            <div className="attention-tabs-function">
                <i className="iconfont icongengduo-2" onClick={this.toShowPanel}></i>
                <i className="iconfont iconsousuo"></i>
            </div>
        </div>
    )

    toRenderTabContent = tab => {
        return (
            <div className="attention-tab-content">
                <div className="attention-swiper">
                    <Carousel list={tab.carousel || []} dots={false} infinite={false} />
                </div>
                <div className="attention-list">
                    {tab.list && tab.list.map((item, i) => (
                        <Link className="attention-item" key={i} to={item.link}>
                            <div className="attention-item-left">
                                <p className="attention-itme-title">{item.title}</p>
                                <p className="attention-itme-description">{item.description}</p>
                                <p className="attention-itme-interval">{item.interval}</p>
                            </div>
                            <div className="attention-item-right">
                                <img src={item.image} alt='图片已失效' />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
}

    render() {
        const { current, navi_show } = this.state;
        const { list } = this.props;
        const tabs = list.map(item => ({ title: item.type, ...item }));

        return (
            <div className="hdz-attention">
                <Tabs
                    tabs={tabs}
                    page={current}
                    swipeable={false}
                    tabBarActiveTextColor="#FF6F70"
                    tabBarUnderlineStyle={{ display: 'none', background: "#FFF", borderColor: "#FFF" }}
                    renderTabBar={this.toRenderTabHeader}
                    onTabClick={(tab, index) => this.toSetCurrentTab(index)}
                >
                    {this.toRenderTabContent}
                </Tabs>
                <div className={`attention-panel-mask ${navi_show ? 'active' : ''}`} onClick={this.toHidePanel}>
                    <div className="attention-panel">
                        <div className="attention-panel-title">
                            <p>频道</p>
                        </div>
                        <div className="attention-panel-content">
                            {tabs.map((item, i) => <span key={i} className={current === i ? 'active' : ''} onClick={(e) => this.toSetCurrentTab(tabs.findIndex(item => item.title === e.target.textContent))}>{item.title}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default () => {
    const shopContext = useContext(ShopContext);
    const [thisState, setState] = useState([]);
    useEffect(() => {
        (async () => {
            let list = [];
            let promise_arr = [];
            if(shopContext.category.length) {
                const category_arr = _.find(shopContext.category, { name: "频道" }).children;
                list = category_arr.sort((a,b) => a.sort - b.sort).map((item) => ({
                    id: item.id,
                    type: item.name,
                    list: []
                }));
            }
            list.forEach(item => promise_arr.push(superFetch.get(`/content/list?category=${item.id}`)));
            Promise.all(promise_arr).then((values) => {
                values.forEach((item, i) => {
                    list[i].list = item[0].length ? item[0].map(item => ({
                        ...item,
                        image: item.thumbnailPath,
                        description: item.summary,
                        interval: moment(item.publish_at).fromNow(),
                        link: `${gPageUrl['ATTENTION_DETAIL']}/${item.id}`
                    })) : [];
                    let result = _.find(shopContext.carousel[0], { token: list[i].type });
                    list[i].carousel = result ? result.carousels.map(item => ({
                        ...item,
                        title: item.desc,
                        link: 'javascript:;'
                    })) : [];
                })
                setState(list);
            })
        })();
    }, [shopContext.category[0]]);
    if(thisState.length) {
        return (
            <Fragment>
                <Attention list={thisState} key={thisState.length} />
            </Fragment>
        )
    } else {
        return <Fragment></Fragment>
    }
}
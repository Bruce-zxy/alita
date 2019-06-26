import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';

import Carousel from '../components/Carousel';

const carousel_list = [{
    id: '1',
    link: 'javascript:;',
    image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=1',
    title: '这是1个标题'
}, {
    id: '12',
    link: 'javascript:;',
    image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=2',
    title: '这是2个标题'
}, {
    id: '13',
    link: 'javascript:;',
    image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=3',
    title: '这是3个标题'
}, {
    id: '14',
    link: 'javascript:;',
    image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=4',
    title: '这是4个标题'
}];

const type_list = [{
    id: '1',
    type: '理论政策',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, {
    id: '2',
    type: '教育素质',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, {
    id: '3',
    type: '文化文明',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, { 
    id: '4',
    type: '科技科普',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, { 
    id: '5',
    type: '健身体育',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, { 
    id: '6',
    type: '培训提升',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, { 
    id: '7',
    type: '表彰激励',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, { 
    id: '8',
    type: '爱心商家',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}, {
    id: '9',
    type: '他山之石',
    list: [{
        id: 1,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }, {
        id: 2,
        title: '高考志愿填报公益讲座邀您免费来听 就在长沙晚报',
        image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=NEWS_1',
        description: '每场活动将分为三个流程，一是高考志愿填报，二是高考志愿填报，三是高考志愿填报',
        interval: '17分钟前',
        link: ''
    }]
}];




export default class extends Component {

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
            <Tabs.DefaultTabBar {...props} page={4} />
            <div className="attention-tabs-function">
                <i className="iconfont icongengduo-2" onClick={this.toShowPanel}></i>
                <i className="iconfont iconsousuo"></i>
            </div>
        </div>
    )

    toRenderTabContent = tab => console.log(tab) || (
        <div className="attention-tab-content">
            <div className="attention-swiper">
                <Carousel list={carousel_list} dots={false} infinite={false} />
            </div>
            <div className="attention-list">
                {tab.list && tab.list.map((item, i) => (
                    <a className="attention-item" key={i} href={item.link}>
                        <div className="attention-item-left">
                            <p className="attention-itme-title">{item.title}</p>
                            <p className="attention-itme-description">{item.description}</p>
                            <p className="attention-itme-interval">{item.interval}</p>
                        </div>
                        <div className="attention-item-right">
                            <img src={item.image} alt='placeholder+image' />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )

    render() {
        const { current, navi_show } = this.state;

        const tabs = type_list.map(item => ({ title: item.type, ...item }));

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
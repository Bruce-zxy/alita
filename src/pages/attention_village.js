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
                <Link to={gPageUrl['ATTENTION_SEARCH']}><i className="iconfont iconsousuo"></i></Link>
            </div>
        </div>
    )

    toRenderTabContent = tab => {
        return (
            <div className="attention-tab-content">
                <div className="attention-list">
                    {tab.list && tab.list.length > 0 ? tab.list.map((item, i) => (
                        <a className="attention-item" key={i} href={item.link}>
                            <div className="attention-item-left">
                                <p className="attention-itme-title">{item.title}</p>
                                <p className="attention-itme-description">{item.description}</p>
                                <p className="attention-itme-interval">{item.interval}</p>
                            </div>
                            <div className="attention-item-right">
                                <img src={item.image} alt='图片已失效' />
                            </div>
                        </a>
                    )) : (
                        <p className="list-empty">暂无此分类数据</p>
                    )}
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
                            <p>乡镇</p>
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
    const [thisState, setThisState] = useState([]);

    useEffect(() => {
        let list = [];
        if (shopContext.category.length && shopContext.content[1] && shopContext.carousel[1]) {
            const category_arr = _.find(shopContext.category, { name: "频道" }).children;
            const arr = _.find(category_arr, {ex_info: "village"}).children;
            list = arr.sort((a, b) => a.sort - b.sort).map((item) => ({
                id: item.id,
                type: item.name,
                list: [],
                carousel: []
            }));
            list.forEach((item, i) => {
                shopContext.content[0].forEach((content) => {
                    if (content.category.id === item.id) {
                        list[i].list.push({
                            ...content,
                            image: content.thumbnailPath,
                            description: content.summary,
                            interval: moment(content.publish_at).fromNow(),
                            link: `${gPageUrl['ATTENTION_DETAIL']}/${content.id}`
                        });
                    }
                })
                shopContext.carousel[0].forEach(carousel => {
                    if (carousel.token === item.type) {
                        list[i].carousel = carousel.carousels.map(ctn => ({
                            ...ctn,
                            title: ctn.desc,
                            link: ctn.url
                        }))
                    }
                })
            })
            console.log(list);
            
            setThisState(list);
        }
    }, [shopContext.content])
    
    return <Attention list={thisState} key={thisState.length} />;
}
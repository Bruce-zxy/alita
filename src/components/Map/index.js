import React, { Component, useState, useEffect, useContext } from 'react';
import { Carousel } from 'antd-mobile';
import { Map, MouseTool, Markers } from 'react-amap';
import * as classname from 'classname';

import config from '../../config/common';
import './index.scss'

class AMAP extends Component {
    state = {
        current: 0
    }
    // 地图事件
    map_events = {
        created: (ins) => this.MAP = ins,
        click: () => { console.log('You Clicked The Map') }
    }
    // 地图插件
    map_plugins = ['ToolBar'];
    // 地图工具事件
    tool_event = {
        created: (tool) => {
            console.log(tool)
            this.TOOL = tool;
        },
        // draw({ obj }) {
        //     AMAP.drawWhat(obj);
        // }
    }
    componentDidMount() {

    }
    onAfterChange = (from, to) => {
        if (from === to) return false;
        console.log(from, 'slide to', to);
        this.setState({
            current: 2
        })
    }

    toRenderMapSwiper = (data) => {

        return (
            data.sort((a, b) => a.order - b.order).map(val => (
                <a className="react-amap-swiper-container" key={val} href="javascript:;" >
                    {val.html ? <div dangerouslySetInnerHTML={{ __html: val.html }}></div> : (
                        <div>
                            <p className="react-amap-swiper-title">{val.name}</p>
                            <p className="react-amap-swiper-address">地址：{val.address}</p>
                            <p className="react-amap-swiper-description">{val.description}{val.description}{val.description}</p>
                        </div>
                    )}
                </a>
            ))
        )
    }

    render() {
        const { current } = this.state;
        const { className, data } = this.props;
        return (
            <div style={{ width: "100vw", height: "100vh" }}>
                <div id="react-amap-container" className={classname(className)}>
                    <Map
                        amapkey={config.AMAP.KEY}
                        event={this.map_events}
                        plugins={this.map_plugins}
                    >
                        <MouseTool events={this.tool_event} />
                        <div className="react-amap-swiper">
                            <Carousel
                                selectedIndex={current}
                                cellSpacing={10}
                                slideWidth={1}
                                autoplay={false}
                                infinite={false}
                                beforeChange={this.onAfterChange}
                            >
                                {this.toRenderMapSwiper(data)}
                            </Carousel>
                        </div>
                    </Map>
                </div>
            </div>
        )
    }
}


export default () => {
    const [thisState, thisSetState] = useState({
        data: []
    });


    useEffect(() => {
        thisSetState({
            data: [{
                order: 1,
                name: "永达徐汇",
                address: "徐家汇地铁站",
                latitude: "31.191698",
                longitude: "121.438133",
                description: "这个是永达徐汇的描述这个是永达徐汇的描述这个是永达徐汇的描述这个是永达徐汇的描述这个是永达徐汇的描述这个是永达徐汇的描述"
            }, {
                order: 2,
                name: "强生静安",
                address: "静安公园",
                latitude: "31.222492",
                longitude: "121.446501",
                html: `<p>这个是带有标签和样式的的关于强生静安的描述</p><a href="javascript:;">这个是带有标签和样式的的关于强生静安的a标签</a>`
            }, {
                order: 3,
                name: "交运宝山",
                address: "淞沪码头",
                latitude: "31.381444",
                longitude: "121.466891",
                description: "这个是交运宝山的描述这个是交运宝山的描述这个是交运宝山的描述这个是交运宝山的描述这个是交运宝山的描述这个是交运宝山的描述",
                html: `<p style={{ color: "red" }}>如果同时设置了description和html,那么html会覆盖掉description</p>`
            }]
        })
    }, [])

    return (
        <AMAP 
            // className="amap"
            data={thisState.data}
        />
    )
};
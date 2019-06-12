import React, { Component, useState, useEffect, useContext } from 'react';
import { Carousel } from 'antd-mobile';
import { Map, MouseTool, Markers } from 'react-amap';
import * as classname from 'classname';
import * as turf from '@turf/turf';

import config from '../../config/common';
import './index.scss'

// // 小数部分保留指定精度
// function toFixed(num, fix) {
//     return num.toString().split('.').map((item, i) => {
//         if (i === 1) {
//             return item[fix] > 4 ? item.slice(0, fix) * 1 + 1 : item.slice(0, fix);
//         } else {
//             return item;
//         }
//     }).join('.') * 1;
// }

// function toTransformAMapToTurf(arr, reverse) {
//     if (reverse !== false) {
//         return arr.map(item => ([item.longitude*1, item.latitude*1]));
//     } else {
//         return arr.map(item => ({ longitude: item[0], latitude: item[1] }));
//     }
// }

// // 求两地理坐标之间的距离
// function toGetGreatCircleDistance(p1, p2, unit) {
//     let from = turf.point([p1.longitude*1, p1.latitude*1]);
//     let to = turf.point([p2.longitude*1, p2.latitude*1]);
//     let options = { units: unit || 'kilometers' };
//     return turf.distance(from, to, options);
// }

// 根据地理坐标点集获取坐标中心点
function toGetCenterCoordinate(arr) {
    let features = turf.featureCollection(arr.map(item => turf.point([item.longitude*1, item.latitude*1])));
    return turf.center(features);
}

// function toGetBBoxPolygon(arr) {
//     let line = turf.lineString(toTransformAMapToTurf(arr));
//     let bbox = turf.bbox(line);
//     let bboxPolygon = turf.bboxPolygon(bbox);
//     return bboxPolygon;
// }

const Loadding = () => (
    <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
)

class AMAP extends Component {
    creation_flag = false
    state = {
        current: 0,
        map_center: null,
        map_zoom: 15
    }
    map_plugins = ['ToolBar'];
    map_events = {
        created: (ins) => {
            const { geometry: { coordinates } } = toGetCenterCoordinate(this.props.data);
            this.MAP = ins;
            this.setState({
                map_center: {
                    longitude: coordinates[0],
                    latitude: coordinates[1]
                }
            })
        }
    }
    markers_events = {
        created: () => {
            if (!this.creation_flag) {
                this.MAP.setFitView(null, true);
            } 
            this.creation_flag = true;
        },
        click: (MapsOption, marker) => {
            const { order, longitude, latitude } = marker.getExtData();
            this.setState({
                current: order - 1,
                map_center: {
                    longitude: longitude,
                    latitude: latitude
                }
            })
        },
    }

    onAfterChange = (from, to) => {
        if (from === to) return false;
        const { data } = this.props;
        const curr_marker = data.sort((a, b) => a.order - b.order)[to];
        this.setState({
            map_center: {
                longitude: curr_marker.longitude,
                latitude: curr_marker.latitude
            }
        })
    }

    toRenderMapMarker = (data) => {
        const { mode } = this.props;
        const markers = data.sort((a, b) => a.order - b.order).map(item => {
            item.draggable = mode === 'edit';
            item.position = {
                latitude: item.latitude,
                longitude: item.longitude
            }
            return item;
        });
        return (
            <Markers
                markers={markers}
                events={this.markers_events}
            />
        )
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
        const { current, map_center, map_zoom } = this.state;
        const { className, data } = this.props;
        
        return (
            <div id="react-amap-container" className={classname(className)}>
                {data.length ? (
                    <Map
                        amapkey={config.AMAP.KEY}
                        center={map_center}
                        zoom={map_zoom}
                        events={this.map_events}
                        plugins={this.map_plugins}
                        viewMode="3D"
                    >
                        <MouseTool />
                        {this.toRenderMapMarker(data)}
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
                ) : (
                    <Loadding />
                )}
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
                html: `<p style="color: red">如果同时设置了description和html,那么html会覆盖掉description</p>`
            }]
        })
    }, [])

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <AMAP 
                className="amap"
                data={thisState.data}
                mode="display"
            />
        </div>
    )
};
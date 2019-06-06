import React, { useState } from 'react';
import { Carousel } from 'antd-mobile';
import { Map, MouseTool } from 'react-amap';

import config from '../../config/common';
import './index.scss'

export default () => {
    let host = {};
    const [ this_state, this_set_state ] = useState({
        data: [1,2,3]
    })
    const map_plugins = ['ToolBar'];
    const toolEvents = {
        created: (tool) => {
            console.log(tool)
            host.tool = tool;
        },
        draw({ obj }) {
            host.drawWhat(obj);
        }
    }

    const onAfterChange = (from, to) => {
        console.log(from, 'slide to', to);
    }



    console.log(config)

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <div id="react-amap-container">
                <Map 
                    amapkey={config.AMAP.KEY} 
                    plugins={map_plugins}
                >
                    <MouseTool events={toolEvents} />
                    <div className="react-amap-swiper">
                        <Carousel
                            cellSpacing={10}
                            slideWidth={1}
                            autoplay={false}
                            infinite={false}
                            beforeChange={onAfterChange}
                        >
                            {this_state.data.map(val => (
                                <a className="react-amap-swiper-container" key={val} href="javascript:;" >
                                    {val}
                                </a>
                            ))}
                        </Carousel>
                    </div>
                </Map>
            </div>
        </div>
    )
}
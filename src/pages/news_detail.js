import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { TabBar } from 'antd-mobile';

import '../style/news.scss';

export default (props) => {
    


    return (
        <div className="hdz-news-detail">
            <p className="news-title">腾讯领投，马蜂窝完成2.5亿美元新融资，确立旅游行业内容巨头地位</p>
            <p className="news-intro">
                <span>作者：中国青年网</span>
                <span>2019-07-05 07:37</span>
            </p>
            <div className="news-content">
                <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                <p style={{ margin: " 4vw auto" }}>作为年轻人用得更多的旅游网站，马蜂窝旅游网于2010年起正式公司化运营，以海量内容与活跃用户为基石，快速成为中国最大的旅游社区。2015年自酒店预订起步，马蜂窝在强化内容优势的同时，不断深耕供应链，锻造服务能力，实现从社区到电商、从内容到交易的完整商业闭环，并连续四年实现GMV超100%增长，是互联网行业中为数不多的内容商业化成功样本。“‘实现每一个旅行梦想’始终是马蜂窝的使命，新注入的资金将帮助我们以更优的路径、更快的速度，做好旅游消费决策，为中国旅行者创造更具想象力的玩乐体验。”马蜂窝旅游网联合创始人、CEO陈罡表示，本轮融资后，马蜂窝将继续强化“旅游消费决策”的内容壁垒，构建以AI和数据算法为驱动的新型一站式旅游服务平台，成为中国年轻人旅游出行时的首选品牌。在。</p>
                <p style={{ margin: " 4vw auto" }}>作为年轻人用得更多的旅游网站，马蜂窝旅游网于2010年起正式公司化运营，以海量内容与活跃用户为基石，快速成为中国最大的旅游社区。2015年自酒店预订起步，马蜂窝在强化内容优势的同时，不断深耕供应链，锻造服务能力，实现从社区到电商、从内容到交易的完整商业闭环，并连续四年实现GMV超100%增长，是互联网行业中为数不多的内容商业化成功样本。“‘实现每一个旅行梦想’始终是马蜂窝的使命，新注入的资金将帮助我们以更优的路径、更快的速度，做好旅游消费决策，为中国旅行者创造更具想象力的玩乐体验。”马蜂窝旅游网联合创始人、CEO陈罡表示，本轮融资后，马蜂窝将继续强化“旅游消费决策”的内容壁垒，构建以AI和数据算法为驱动的新型一站式旅游服务平台，成为中国年轻人旅游出行时的首选品牌。在。</p>
                <img src='http://dummyimage.com/100x100/4d494d/686a82.gif&text=QRCode' alt='QRCode' style={{ display: "flex", margin: "0 auto" }} />
            </div>
        </div>
    )
};
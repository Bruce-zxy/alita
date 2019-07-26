import React from "react";

import DetailPanel from '../components/DetailPanel';

import { COLOR_ARRAY } from '../config/common';
import '../style/project.scss';
import '../style/home_detail.scss';


const FundsDetail = (props) => {

    return (
        <div className="hdz-home-detail">
            <div className="home-detail-funds">
                <p>北京企业资金1000万元投江西旅游酒店项目</p>
                <p>
                    <span><i className="iconfont iconshijian"></i>2019-05-31</span>
                    <span><i className="iconfont iconliulan"></i>浏览量：10次</span>
                </p>
                <p>
                    <span>&yen;5000万元</span>
                    <span>所在地区：江西</span>
                </p>
            </div>

            <div className="hdz-block-small-space"></div>

            <div className="home-detail-kv">
                <p className="detail-kv">
                    <span>所属行业</span>
                    <span>旅游大交通</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
                <p className="detail-kv">
                    <span>融资方式</span>
                    <span>股权融资</span>
                </p>
            </div>

            <div className="hdz-block-small-space"></div>

            <div className="home-detail-intro">
                <div className="project-intro">
                    <div>
                        <p>12%-15%</p>
                        <p>资金方占股比例</p>
                    </div>
                    <div>
                        <p>扩张期</p>
                        <p>项目所处阶段</p>
                    </div>
                    <div>
                        <p>5年</p>
                        <p>最短退出年限</p>
                    </div>
                </div>
                <p className="detail-kv">
                    <span>前期费用</span>
                    <span>无</span>
                </p>
            </div>

            <div className="hdz-block-small-space"></div>

            <DetailPanel title="可提供资料">
                <div className="project-information">
                    <div>
                        <i className="iconfont iconjhs"></i>
                        <span>项目/商业计划书</span>
                    </div>
                    <div>
                        <i className="iconfont iconjiangpai"></i>
                        <span>公司证件</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                    <div>
                        <i className="iconfont iconcaiwu"></i>
                        <span>财务资料</span>
                    </div>
                </div>
            </DetailPanel>

            <div className="hdz-block-small-space"></div>

            <DetailPanel title="项目介绍" content="北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全。" />

            <div className="hdz-block-small-space"></div>

            <DetailPanel title="会员名片">
                <div className="member-info">
                    <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                    <div className="menber-detail">
                        <p>李**</p>
                        <p>所在公司：******酒店</p>
                    </div>
                </div>
            </DetailPanel>

            <a href="javascript:;" className="apply-to">立即投递</a>

            <div className="hdz-block-large-space"></div>

        </div>
    )
}


const FinancingDetail = (props) => {

    console.log(props.match);
    



    return (
        <div className="financing-detail">
            <div className="hdz-block-large-space"></div>
            <div className="financial-item" style={{ backgroundColor: COLOR_ARRAY[2] }}>
                <div className="finnacial-item-left">
                    <p>江旅定采通</p>
                    <p>你采购 我付款</p>
                </div>
                <i className="iconfont iconcaiwu"></i>
            </div>
            <div className="hdz-home-detail">
                <DetailPanel title="产品介绍" content="北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全。" />
                <div className="hdz-block-small-space"></div>

                <DetailPanel title="产品优势" content="北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全。" />
                <div className="hdz-block-small-space"></div>

                <DetailPanel title="服务流程" content="1. 融资受理：借款人向江旅成员企业提出融资申请 2. 融资初审：江旅成员企业对借款人的相关材料进行初审并确权 3. 融资终审：江旅集团对相关材料终审并提供担保 4. 融资放款：银行受托支付给江旅成员企业 5. 代为采购：江旅成员企业集中向供应商代采，供应商向江旅成员企业提供“出货权” 6. 出货权转让：江旅成员将“出货权”转让给借款人，由终端消费者回款至指定监管账户" />
                <div className="hdz-block-small-space"></div>

                <a href="javascript:;" className="apply-to">立即投递</a>

                <div className="hdz-block-large-space"></div>
            </div>
        </div>
    )
}


export default (props) => {

    const { pathname } = props.location;
    const type = pathname.split('/')[4];

    console.log(type);
    
    switch (type) {
        case 'funds':
            return <FundsDetail {...props}/>;
        case 'financing':
            return <FinancingDetail {...props}/>;
        default:
            return <div>未找到相应的内容</div>;
    }
}
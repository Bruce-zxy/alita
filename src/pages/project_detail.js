import React, { Fragment } from "react";
import { Query, withApollo } from "react-apollo";
import { Toast } from 'antd-mobile';

import DetailPanel from '../components/DetailPanel';
import { Q_GET_CAPITAL, Q_GET_PRODUCT, M_UPDATE_USER } from '../gql';
import { toFetchCurrentUser } from '../utils/global';

import Loader from '../components/Loader';

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
                    <span>投资行业</span>
                    <span>酒店与民宿，旅行社，景区</span>
                </p>
                <p className="detail-kv">
                    <span>投资方式</span>
                    <span>股权投资</span>
                </p>
                <p className="detail-kv">
                    <span>投资类型</span>
                    <span>股权合作</span>
                </p>
                <p className="detail-kv">
                    <span>参股类型</span>
                    <span>参股合作</span>
                </p>
                <p className="detail-kv">
                    <span>资金类型</span>
                    <span>企业资金，PE投资</span>
                </p>
                <p className="detail-kv">
                    <span>投资地区</span>
                    <span>江西、北京、天津</span>
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

            {/* TEMP <a href="javascript:;" className="apply-to">立即投递</a> */}

            <div className="hdz-block-large-space"></div>

        </div>
    )
}


const FinancingDetail = withApollo(({ match, location, client }) => {

    const { search } = location;
    let params = {};
    search.split('?')[1].split('&').forEach(item => {
        const [key,val] = item.split('=');
        params[key] = val;
    });

    let curr_user = null;
    let curr_user_products = [];
    try {
        curr_user = JSON.parse(localStorage.getItem('u_user'));
        curr_user_products = curr_user.apply_products.map(pro => ({ id: pro.id }));
    } catch (error) {
        console.log('未登录');
    }

    const toSetVal = (val) => (key) => (def) => val ? val[key] : def;

    const toApply = (product) => (refetch) => async () => {
        if (curr_user) {
            const res = await client.mutate({
                mutation: M_UPDATE_USER,
                variables: {
                    id: curr_user.id,
                    data: {
                        apply_products: [...curr_user_products, { id: product.id }]
                    }
                }
            })
            if (res.data && res.data.updateUser) {
                const user = await toFetchCurrentUser(client);
                if (user.apply_products.findIndex(pro => pro.id === product.id) !== -1) {
                    Toast.success('申请成功！');
                } else {
                    Toast.fail('申请失败！');
                }
                refetch();
            }
        } else {
            Toast.fail('您尚未登录，请登陆后再申请！');
        }
    }

    return (
        <Query
            query={Q_GET_PRODUCT}
            variables={{ id: match.params.id }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
                // if (networkStatus === 4) return <Loader />;
                // if (loading) return <Loader />;
                // if (error) return `【Error】 ${error.message}`;

                if (data && data.product) {
                    let flows = [];

                    try {
                        flows = JSON.parse(data.product.flows).sort((a, b) => a.sort - b.sort);
                    } catch (error) {
                        flows = [];
                    }

                    return (
                        <div className="financing-detail">
                            <div className="hdz-block-large-space"></div>
                            <div className="financial-item" style={{ backgroundColor: COLOR_ARRAY[params.index ? params.index%5 : 0] }}>
                                <div className="finnacial-item-left">
                                    <p>江旅定采通</p>
                                    <p>你采购 我付款</p>
                                </div>
                                <i className="iconfont iconcaiwu"></i>
                            </div>
                            <div className="hdz-home-detail">
                                <DetailPanel title="产品介绍" content={data.product.introduction} />
                                <div className="hdz-block-small-space"></div>

                                <DetailPanel title="产品优势" content={data.product.advantage} />
                                <div className="hdz-block-small-space"></div>

                                <DetailPanel title="服务流程" content={flows.length ? flows.map((item, i) => <p>{i + 1}、{item.value}</p>) : ''}/>
                                <div className="hdz-block-small-space"></div>

                                {curr_user.apply_projects.findIndex(pro => pro.id === data.product.id) === -1 ? (
                                    <div className="apply-to" onClick={toApply(data.product)(refetch)}>立即投递</div>
                                ) : (
                                    <div className="apply-to finished">您已投递</div>
                                )}

                                <div className="hdz-block-large-space"></div>
                            </div>
                        </div>
                    )
                }

                return <div style={{ textAlign: "center" }}>未找到相关产品</div>
            }}
        </Query>
    )
})


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
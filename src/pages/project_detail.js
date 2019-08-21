import React, { useState, useEffect } from "react";
import { Query, withApollo } from "react-apollo";
import { Toast, Modal } from 'antd-mobile';
import * as moment from 'moment';

import DetailPanel from '../components/DetailPanel';
import { Q_GET_CAPITAL, Q_GET_PRODUCT, M_APPLY_PRODUCTS, M_APPLY_CAPITALS } from '../gql';
import { buildingQuery, toFetchCurrentUser } from '../utils/global';

import Loader from '../components/Loader';

import { COLOR_ARRAY, IFT_MODE_ENUM, DATA_ARRAY, PROJECT_STATUS_ENUM } from '../config/common';
import '../style/project.scss';
import '../style/home_detail.scss';


const FundsDetail = withApollo((props) => {

    const defaultVariables = {
        join: [
            { field: 'creator' },
            { field: 'industry' },
            { field: 'area' },
            { field: 'stage' },
            { field: 'type' },
            { field: 'equity_type' },
            { field: 'invest_type' },
            { field: 'invest_area' },
            { field: 'risk' },
            { field: 'data' },
            { field: 'ratio' }
        ],
    };

    const [currUser, setCurrUser] = useState(null);

    useEffect(() => {
        try {
            setCurrUser(JSON.parse(localStorage.getItem('u_user')));
        } catch (error) {
            console.log('未登录');
        }
    }, []);

    const toApply = (capital) => () => {
        let test = null;
        const apply = async () => {
            test.close();
            if (currUser) {
                const res = await props.client.mutate({
                    mutation: M_APPLY_CAPITALS,
                    variables: {
                        id: capital.id
                    }
                })
                if (res.data && res.data.applyCapitals) {
                    const user = await toFetchCurrentUser(props.client);
                    if (user.apply_capitals.findIndex(pro => pro.capital && (pro.capital.id === capital.id)) !== -1) {
                        Toast.success('申请成功！', 2);
                    } else {
                        Toast.fail('申请失败！', 2);
                    }
                    setCurrUser(user);
                } else {
                    Toast.fail('申请失败！', 2);
                }
            } else {
                Toast.fail('您尚未登录，请登陆后再申请！', 2);
            }
        }
        test = Modal.alert('您正在提交一个申请', '是否确认申请？', [
            { text: '取消', onPress: () => global.TNT('已取消') },
            { text: '确认', onPress: apply },
        ])
    }

    return (
        <Query
            query={Q_GET_CAPITAL}
            variables={{ id: props.match.params.id, queryString: buildingQuery(defaultVariables) }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {
                // if (networkStatus === 4) return <Loader />;
                if (loading) return <Loader />;
                // if (error) return `【Error】 ${error.message}`;

                if (data && data.capital) {
                    const { capital } = data;

                    global.TNT(capital);

                    return (
                        <div className="hdz-home-detail">
                            <div className="home-detail-funds">
                                <p>{capital.title}</p>
                                <p>
                                    <span><i className="iconfont iconshijian"></i>{capital.create_at ? moment(capital.create_at).format('YYYY-MM-DD HH:mm:ss') : '未知'}</span>
                                    <span><i className="iconfont iconliulan"></i>浏览量：{capital.views || 0}次</span>
                                </p>
                                <p>
                                    <span>&yen;{capital.amount}万元</span>
                                    <span>所在地区：{capital.area ? capital.area.title: '未知'}</span>
                                </p>
                            </div>

                            <div className="hdz-block-small-space"></div>

                            <div className="home-detail-kv">
                                <p className="detail-kv">
                                    <span>投资行业</span>
                                    <span>{capital.industry.length ? capital.industry.map(item => item.title).join('，') : '暂无'}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>投资方式</span>
                                    <span>{capital.category ? IFT_MODE_ENUM[capital.category.toUpperCase()] : '未知'}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>投资类型</span>
                                    <span>{capital.invest_type.length ? capital.invest_type.map(item => item.title).join('，') : "未知"}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>参股类型</span>
                                    <span>{capital.equity_type ? capital.equity_type.title : '未知'}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>资金类型</span>
                                    <span>{capital.type.length ? capital.type.map(item => item.title).join('，') : '未知'}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>投资地区</span>
                                    <span>{capital.invest_area.length ? capital.invest_area.map(item => item.title).join('，') : '未知'}</span>
                                </p>
                            </div>

                            <div className="hdz-block-small-space"></div>

                            <div className="home-detail-intro">
                                <div className="project-intro">
                                    <div>
                                        <p>{capital.ratio ? capital.ratio.title : '未知'}</p>
                                        <p>资金方占股比例</p>
                                    </div>
                                    <div>
                                        <p>{capital.stage.length ? capital.stage.map(item => item.title).join('，') : '未知'}</p>
                                        <p>项目所处阶段</p>
                                    </div>
                                    <div>
                                        <p>{capital.term ? capital.term.title : '未知'}</p>
                                        <p>最短退出年限</p>
                                    </div>
                                </div>
                                <p className="detail-kv">
                                    <span>前期费用</span>
                                    <span>{capital.pre_payment ? capital.pre_payment.title : '未知' }</span>
                                </p>
                            </div>

                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="可提供资料">
                                <div className="project-information">
                                    {capital.data && capital.data.length ? (
                                        capital.data.map((item, k) => (
                                            <div key={item.id}>
                                                <i className={`iconfont ${DATA_ARRAY[k % 3]}`}></i>
                                                <span>{item.title}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div>暂无可提供的资料</div>
                                    )}
                                </div>
                            </DetailPanel>

                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="项目介绍" content={capital.info || "暂无简介"} />

                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="会员名片">
                                {capital.creator ? (
                                    <div className="member-info">
                                        <img src={capital.creator.avatar} alt='AVATAR' />
                                        <div className="menber-detail">
                                            <p>{capital.creator.hideName}</p>
                                            <p>所在公司：{capital.creator.hideCompany}</p>
                                        </div>
                                    </div>
                                ) : (
                                        <div className="member-info">
                                            <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=AVATAR' alt='AVATAR' />
                                            <div className="menber-detail">
                                                <p>未知</p>
                                                <p>所在公司：暂无</p>
                                            </div>
                                        </div>
                                    )}
                            </DetailPanel>

                            {capital.status === PROJECT_STATUS_ENUM.CHECKED ? (
                                currUser && currUser.apply_capitals.findIndex(pro => pro.capital && (pro.capital.id === data.capital.id)) === -1 ? (
                                    <div className="apply-to" onClick={toApply(data.capital)}>立即投递</div>
                                ) : (
                                    <div className="apply-to finished">您已投递</div>
                                )
                            ) : (
                                <div className="apply-to finished">已结束</div>
                            )}

                            <div className="hdz-block-large-space"></div>

                        </div>
                    )
                }

                return <div style={{ textAlign: "center" }}>未找到相关产品</div>
            }}
        </Query>

    )
})


const FinancingDetail = withApollo(({ match, location, client }) => {

    const { search } = location;
    // let params = {};
    // search.split('?')[1].split('&').forEach(item => {
    //     const [key,val] = item.split('=');
    //     params[key] = val;
    // });

    const [currUser, setCurrUser] = useState(null);

    useEffect(() => {
        try {
            setCurrUser(JSON.parse(localStorage.getItem('u_user')));
        } catch (error) {
            console.log('未登录');
        }
    }, [])

    const toSetVal = (val) => (key) => (def) => val ? val[key] : def;

    const toApply = (product) => () => {
        const apply = async () => {
            if (currUser) {
                const curr_user_products = currUser.apply_products.map(pro => ({ id: pro.id }))
                const res = await client.mutate({
                    mutation: M_APPLY_PRODUCTS,
                    variables: {
                        id: product.id
                    }
                })
                if (res.data && res.data.applyProducts) {
                    const user = await toFetchCurrentUser(client);
                    if (user.apply_products.findIndex(pro => pro.product && (pro.product.id === product.id)) !== -1) {
                        Toast.success('申请成功！');
                    } else {
                        Toast.fail('申请失败！');
                    }
                    setCurrUser(user);
                } else {
                    Toast.fail('申请失败！');
                }
            } else {
                Toast.fail('您尚未登录，请登陆后再申请！');
            }
        }
        Modal.alert('您正在提交一个申请', '是否确认申请？', [
            { text: '取消', onPress: () => global.TNT('已取消') },
            { text: '确认', onPress: apply },
        ])
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

                    global.TNT(data.product);

                    return (
                        <div className="financing-detail">
                            <div className="hdz-block-large-space"></div>
                            <div className="financial-item" style={{ backgroundColor: COLOR_ARRAY[data.product.id*1 ? data.product.id*1%5 : 0] }}>
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

                                <DetailPanel title="服务流程" content={flows.length ? flows.map((item, i) => <p key={i+1}>{i + 1}、{item.value}</p>) : ''}/>
                                <div className="hdz-block-small-space"></div>

                                {currUser && currUser.apply_products.findIndex(pro => pro.product && (pro.product.id === data.product.id)) === -1 ? (
                                    <div className="apply-to" onClick={toApply(data.product)}>立即投递</div>
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

    switch (type) {
        case 'funds':
            return <FundsDetail {...props}/>;
        case 'financing':
            return <FinancingDetail {...props}/>;
        default:
            return <div>未找到相应的内容</div>;
    }
}
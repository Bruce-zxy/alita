import React, { useState, useEffect } from 'react';
import { Carousel, Toast, Modal } from 'antd-mobile';
import { Query, withApollo } from "react-apollo";

import Loader from '../components/Loader';
import DetailPanel from '../components/DetailPanel';
import TabPanel from '../components/TabPanel';

import { buildingQuery, toFetchCurrentUser, toGetParentArrayByChildNode, toSetWeChatShareConfig } from '../utils/global';
import { Q_GET_PROJECT, M_APPLY_PROJECTS } from '../gql';
import { LOCAL_URL, IF_MODE_ENUM, PROJECT_STATUS_ENUM, DATA_ARRAY, DEFAULT_AVATAR } from '../config/common';

import '../style/home_detail.scss';

const defaultVariables = {
    join: [
        { field: 'creator' }, 
        { field: 'exit_mode' }, 
        { field: 'industry' }, 
        { field: 'ratio' }, 
        { field: 'stage' }, 
        { field: 'withdrawal_year' }, 
        { field: 'data' },
        { field: 'area' },
        { field: 'risk' },
        { field: 'interest' },
        { field: 'occupancy_time' },
    ]
};

export default withApollo((props) => {
    let { match: { params: { id } }, history, client } = props;
    if (!id) {
        id = props.location.search.split("=")[1].substring(0,36);
    }
    const [currUser, setCurrUser] = useState(null);

    let metadata = [];
    let area_origin_set = [];

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children;
    } catch (err) {
        console.error(err.message);
    }

    useEffect(() => {
        try {
            setCurrUser(JSON.parse(localStorage.getItem('u_user')));
        } catch (error) {
            global.TNT('未登录');
        }
    }, [])

    const toSetVal = (val) => (key) => (def) => val && val[key] ? val[key] : def;

    const toApply = (project) => () => {
        const apply = async () => {
            if (currUser) {
                const res = await client.mutate({
                    mutation: M_APPLY_PROJECTS,
                    variables: {
                        id: project.id
                    }
                })
                if (res.data && res.data.applyProjects) {
                    const user = await toFetchCurrentUser(client);
                    if (user.apply_projects.findIndex(pro => pro.project && (pro.project.id === project.id)) !== -1) {
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
                window.location.href = (LOCAL_URL['SIGNIN']);
            }
        }
        Modal.alert('您正在提交一个申请', '是否确认申请？', [
            { text: '取消', onPress: () => global.TNT('已取消') },
            { text: '确认', onPress: apply },
        ])
    }

    const toCreatekVContent = (project) => ({
        equity: (
            <div className="home-detail-intro">
                <div className="project-intro">
                    <div>
                        <p>{toSetVal(project.ratio)('title')('未知')}</p>
                        <p>资金方占股比例</p>
                    </div>
                    <div>
                        <p>{toSetVal(project.stage)('title')('未知')}</p>
                        <p>项目所处阶段</p>
                    </div>
                    <div>
                        <p>{toSetVal(project.withdrawal_year)('title')('未知')}</p>
                        <p>最短退出年限</p>
                    </div>
                </div>
                <p className="detail-kv">
                    <span>投资退出方式</span>
                    <span>{project.exit_mode && project.exit_mode.length ? project.exit_mode.map(mode => mode.title).join('，') : '未知'}</span>
                </p>
            </div>
        ),
        claim: (
            <div className="home-detail-intro">
                <div className="project-intro">
                    <div>
                        <p>{toSetVal(project.risk)('title')('未知')}</p>
                        <p>风控要求</p>
                    </div>
                    <div>
                        <p>{toSetVal(project.interest)('title')('未知')}</p>
                        <p>承担利息</p>
                    </div>
                    <div>
                        <p>{toSetVal(project.occupancy_time)('title')('未知')}</p>
                        <p>资金占用时长</p>
                    </div>
                </div>
                <p className="detail-kv">
                    <span>还款来源</span>
                    <span>{project.payment || '未知'}</span>
                </p>
            </div>
        )
    })

    return (
        <Query
            query={Q_GET_PROJECT}
            variables={{ id: id, queryString: buildingQuery(defaultVariables) }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {

                if (loading) return <Loader />;

                

                if(data && data.project) {
                    const { project } = data;
                    const tab_data = [{
                        title: "项目进展",
                        content: project.progress || '暂无内容'
                    }, {
                        title: "团队介绍",
                        content: project.team_info || '暂无内容'
                    }, {
                        title: "项目优势",
                        content: project.advantage || '暂无内容'
                    }];

                    toSetWeChatShareConfig(project.title, project.info, project.cover);

                    global.TNT(project);

                    return (
                        <div className="hdz-home-detail">
                            <div className="home-detail-carousel">
                                <Carousel
                                    className="hdz-swiper-body"
                                    autoplay
                                    infinite
                                    dots={false}
                                >
                                    <a className="hdz-swiper-link" key={project.id}>
                                        <img className="hdz-swiper-image" src={project.cover} alt="cover" />
                                    </a>
                                </Carousel>
                                <p className="hadz-swiper-title">
                                    <span>浏览量：{project.views}次</span>
                                    <span>{1}/{1}</span>
                                </p>
                            </div>
                            <div className="home-detail-title">
                                <p className="detail-title">{project.title}</p>
                                <p className="detail-subtitle">
                                    <span>&yen;{project.amount <= 1 ? '**万元' : project.amount + '万元'}</span>
                                    <span>所在地区：{project.area ? (toGetParentArrayByChildNode(area_origin_set, { id: project.area.id }) || []).map(item => item.title).join(',') : '未知'}</span>
                                </p>
                            </div>
                            <div className="hdz-block-small-space"></div>
                            <div className="home-detail-kv">
                                <p className="detail-kv">
                                    <span>所属行业</span>
                                    <span>{toSetVal(project.industry)('title')('未知')}</span>
                                </p>
                                <p className="detail-kv">
                                    <span>融资方式</span>
                                    <span>{project.category ? IF_MODE_ENUM[project.category.toUpperCase()] : '未知'}</span>
                                </p>
                            </div>
                            <div className="hdz-block-small-space"></div>
                            {toCreatekVContent(project)[project.category]}
                            <div className="hdz-block-small-space"></div>
                            <DetailPanel title="需提供资料">
                                <div className="project-information">
                                    {project.data && project.data.length ? (
                                        project.data.map((item, k) => (
                                            <div key={item.id}>
                                                <i className={`iconfont ${DATA_ARRAY[k%3]}`}></i>
                                                <span>{item.title}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div>暂不需提供资料</div>
                                    )}
                                </div>
                            </DetailPanel>
                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="项目介绍" content={project.info || '暂无项目介绍'} />
                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="融资用途" content={project.purposes || '暂无融资用途'} />
                            <div className="hdz-block-small-space"></div>

                            <TabPanel data={tab_data} activeBold />
                            <div className="hdz-block-small-space"></div>

                            <DetailPanel title="会员名片">
                                {project.hideContact ? (
                                    <div className="member-info">
                                        <img src={project.creator && project.creator.avatar || DEFAULT_AVATAR} alt='AVATAR' />
                                        <div className="menber-detail">
                                            <p>{project.hideContact || '未知'}</p>
                                            <p>所在公司：{project.hideCompany || '暂无'}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="member-info">
                                        <img src={DEFAULT_AVATAR} alt='AVATAR' />
                                        <div className="menber-detail">
                                            <p>未知</p>
                                            <p>所在公司：暂无</p>
                                        </div>
                                    </div>
                                )}
                                
                            </DetailPanel>
                            

                            {(() => {
                                if (project.status === 'finished') {
                                    return <div className="apply-to finished">融资已结束</div>;
                                }
                                if (!project.deliverable) {
                                    return '';
                                }
                                if (currUser) {
                                    if (currUser.projects.findIndex(pro => pro.id === project.id) === -1) {
                                        return currUser.apply_projects.findIndex(pro => pro.project && (pro.project.id === project.id)) === -1 ? (
                                            <div className="apply-to" onClick={toApply(project)}>立即投递</div>
                                        ) : (
                                            <div className="apply-to finished">您已投递</div>
                                        );
                                    } else {
                                        return '';
                                    }
                                }
                                return <div className="apply-to" onClick={toApply(project)}>立即投递</div>;

                            })()}

                            <div className="hdz-block-large-space"></div>
                        </div>
                    )
                };

                return <div style={{ textAlign: "center" }}>未找到相关项目</div>
                
            }}
        </Query>
    )
});
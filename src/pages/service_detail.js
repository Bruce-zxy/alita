import React, { useState, useEffect } from 'react';
import { Modal, Toast } from 'antd-mobile';
import { Query, withApollo } from 'react-apollo';

import Loader from '../components/Loader';
import { buildingQuery, toFetchCurrentUser } from '../utils/global';
import { Q_GET_PROVIDER, M_APPLY_PROVIDERS } from '../gql';
import '../style/service.scss';


export default withApollo((props) => {
    
    const { client, match } = props
    const [currUser, setCurrUser] = useState(null);

    useEffect(() => {
        try {
            setCurrUser(JSON.parse(localStorage.getItem('u_user')));
        } catch (error) {
            console.log('未登录');
        }
    }, [])

    const toApply = (provider) => () => {
        const apply = async () => {
            if (currUser) {
                const res = await client.mutate({
                    mutation: M_APPLY_PROVIDERS,
                    variables: {
                        id: provider.id
                    }
                })
                if (res.data && res.data.applyProviders) {
                    const user = await toFetchCurrentUser(client);
                    if (user.apply_providers.findIndex(pro => pro.id === provider.id) !== -1) {
                        Toast.success('交换成功！', 2);
                    } else {
                        Toast.fail('交换失败！', 2);
                    }
                    setCurrUser(user);
                }
            } else {
                Toast.fail('您尚未登录，请登陆后再交换！', 2);
            }
        }
        Modal.alert('您正在与服务商交换名片', '是否确认交换？', [
            { text: '取消', onPress: () => global.TNT('已取消') },
            { text: '确认', onPress: apply },
        ])
    }

    return (
        <Query
            query={Q_GET_PROVIDER}
            variables={{ id: match.params.id, metadataRoot: "地区" }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {

                console.log(data);
                

                if (loading) return <Loader />;
                
                if (data && data.provider) {
                    const { provider } = data;
                    return (
                        <div className="hdz-service-detail">
                            <div className="service-detail-banner">
                                <img src={provider.logo} alt='placeholder+image' />
                            </div>
                            <div className="service-detail">
                                <img className="service-detail-logo" src={provider.logo} alt='placeholder+image' />
                                <p className="service-detail-title">{provider.name}</p>
                                <p className="service-detail-type">
                                    <i className="iconfont iconleibie"></i>
                                    <span>机构类别：{provider.category ? provider.category.title : '暂无'}</span>
                                </p>
                                <p className="service-detail-location">
                                    <i className="iconfont icondidian"></i>
                                    <span>所在地：{provider.area ? provider.area.title : '无'}</span>
                                </p>
                                <div className="service-detail-content" dangerouslySetInnerHTML={{ __html: provider.introduction }} />
                            </div>

                            {currUser && currUser.apply_providers.findIndex(pro => pro.id === provider.id) === -1 ? (
                                <div className="service-detail-apply" onClick={toApply(provider)}>交换名片</div>
                            ) : (
                                <div className="service-detail-apply finished">您已交换名片</div>
                            )}
                        </div>
                    )
                }

                return <div>暂无数据</div>

            }}
        </Query>
    )
})
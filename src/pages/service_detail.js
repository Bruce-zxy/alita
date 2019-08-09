import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';

import Loader from '../components/Loader';
import { Q_GET_PROVIDER } from '../gql';
import '../style/service.scss';


export default (props) => {
    console.log(props);
    
    const { client, match } = props
    const [data, setData] = useState(null);

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
                                <div className="service-detail-content">
                                    {provider.introduction}
                                </div>
                            </div>

                            {/* TEMP <a className="service-detail-apply" href="javascript:;">交换名片</a> */}
                        </div>
                    )
                }

                return <div>暂无数据</div>

            }}
        </Query>
    )
}
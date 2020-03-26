import React, { useEffect } from 'react';
import { Query } from "react-apollo";
import * as moment from 'moment';

import Loader from '../components/Loader';
import { toSetWeChatShareConfig, initMetadata } from '../utils/global';
import { Q_GET_ARTICLE } from '../gql';
import '../style/news.scss';
import QRCode from '../images/wechat_qr_code.png';

export default (props) => {

    let { match: { params: { id } } } = props;
    if (!id) {
        id = props.location.search.split("=")[1].substring(0,36);
    }

    useEffect(() => {
        initMetadata();
        
    }, [])

    return (
        <Query
            query={Q_GET_ARTICLE}
            variables={{ id: id }}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, fetchMore, networkStatus, startPolling, stopPolling }) => {

                if (loading) return <Loader />;

                if (data && data.article) {
                    
                    const { article } = data;

                    toSetWeChatShareConfig(article.title, article.summary, article.cover)

                    return (
                        <div className="hdz-news-detail">
                            <p className="news-title">{article.title}</p>
                            <p className="news-intro">
                                <span>作者：{article.author}</span>
                                <span>日期：{moment(article.create_at).format('YYYY-MM-DD')}</span>
                            </p>
                            <div className="news-content" dangerouslySetInnerHTML={{ __html: article.text }} />
                            <div className="qr-code" style={{ width: "90vw", height: "40vw", margin: '10vw auto 0' }}>
                                <img src={QRCode} alt='qr_code' style={{ width: "100%", height: "100%" }} />
                            </div>
                        </div>
                    )
                }

                return <div>暂无数据</div>
            }}
        </Query>
    )
};
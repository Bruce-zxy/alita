import React from 'react';
import { Query } from "react-apollo";
import * as moment from 'moment';

import Loader from '../components/Loader';
import { Q_GET_ARTICLE } from '../gql';
import '../style/news.scss';

export default (props) => {

    const { match: { params: { id } } } = props;

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

                    return (
                        <div className="hdz-news-detail">
                            <p className="news-title">{article.title}</p>
                            <p className="news-intro">
                                <span>作者：{article.author}</span>
                                <span>日期：{moment(article.create_at).format('YYYY-MM-DD HH:mm:ss')}</span>
                            </p>
                            <div className="news-content" dangerouslySetInnerHTML={{ __html: article.text }} />
                        </div>
                    )
                }

                return <div>暂无数据</div>
            }}
        </Query>
    )
};
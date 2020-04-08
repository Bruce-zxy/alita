import React, { useState, useEffect } from 'react';
import * as moment from 'moment';

import superFetch from '../lib/api';
import config from '../lib/config';

export default ({ match }) => {
    const { id } = match.params;

    const [thisState, setState] = useState({});

    useEffect(() => {
        (async () => {
            const res = await superFetch.get(`/content/${id}`);
            if (res) {
                setState({
                    ...res,
                    date: moment(res.publish_at).format('YYYY-MM-DD HH:mm:ss'),
                    html: res.text,
                });
            }
        })();
    }, []);

    const data = thisState;
    const content = !!data.content ? data.content : data.html

    if (id === 'none') {

        return <div style={{ textAlign: "center", margin: "100vw 0", color: "#999" }}>加载中...</div>;

    } else {

        if (data.title) {
            return (
                <div className="hdz-article-container">
                    <p className="article-title">{data.title}</p>
                    <div className="article-info">
                        <img src={data.avatar || config.DEFAULT_AVATAR} alt='avatar+image' />
                        <div className="author-info">
                            <p className="author-name">{data.author}</p>
                            <p className="article-date">{data.date}</p>
                        </div>
                    </div>
                    {content ? (
                        <div className="article-content" dangerouslySetInnerHTML={{ __html: content }}></div>
                    ) : (
                            <div style={{ textAlign: "center", margin: "10vw 0", color: "#999" }}>暂无文章内容</div>
                    )}
                </div>
            )
        } else {
            return <div style={{ textAlign: "center", margin: "100vw 0", color: "#999" }}>内容加载中...</div>;
        }   
    }
}

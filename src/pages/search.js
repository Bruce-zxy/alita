import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import superFetch from '../lib/api';
import { LOCAL_URL } from '../config/common';

export default ({ history }) => {

    let recent = [];
    try {
        recent = JSON.parse(localStorage.getItem('recent_search'));
    } catch (err) {
        console.error('search.js 12 ', err.message);
    }

    const [thisState, setState] = useState({
        result: [],
        recent: recent || [],
        recent_show: true,
        value: ''
    });

    const toAddKeyword = (value) => {
        const { recent } = thisState;
        const new_recent = recent.filter(item => item !== value);
        new_recent.unshift(value);
        localStorage.setItem('recent_search', JSON.stringify(new_recent));
    }

    const onSearchHandler = (value) => async () => {
        value = value || thisState.value;
        let result = [];
        if (!value.trim()) return;
        try {
            result = await superFetch.get(`/content/list?keyword=${value}&sort=publish_at&order=DESC`)
        } catch (error) {
            console.error(error.message);
        } finally {
            toAddKeyword(value);
            if (result[1]) {
                setState(Object.assign({}, thisState, { value, result: result[0], recent_show: false }));
            } else {
                setState(Object.assign({}, thisState, { value, result: [], recent_show: false }));
            }
        }
    }

    const onChangeHandler = (e) => {
        console.log(thisState.recent);
        
        const { value } = e.target;
        const recent = localStorage.getItem('recent_search');
        if (!value) {
            setState(Object.assign({}, thisState, { value, recent: JSON.parse(recent || '[]'), recent_show: true }));
        } else {
            setState(Object.assign({}, thisState, { value, recent: [], recent_show: true }));
        }
    }

    const onClearRecentSearch = () => {
        localStorage.setItem('recent_search', '');
        setState(Object.assign({}, thisState, { recent: [] }));
    }

    return (
        <div className="hdz-search">
            <div className="search-header">
                <form className="search-input-container" onSubmit={(e) => { e.preventDefault(); onSearchHandler()(); }}>
                    <i className="iconfont iconsousuo" onClick={onSearchHandler()}></i>
                    <input type="text" placeholder="请输入关键词后点击右侧搜索图标" value={thisState.value} onChange={onChangeHandler}/>
                </form>
                <div className="search-back" onClick={history.goBack}>取消</div>
            </div>
            {thisState.recent_show && (
                <div className="search-recent">
                    <div className="recent-title">
                        <i className="iconfont iconzuijin"></i>
                        <span>最近搜索</span>
                    </div>
                    <div className="recent-clear" onClick={onClearRecentSearch}>
                        <i className="iconfont iconshanchu"></i>
                        <span>清空</span>
                    </div>
                </div>
            )}
            {thisState.recent_show && (
                <div className="search-recent-list">
                    {thisState.recent.length ? thisState.recent.slice(0, 10).map((item, i) => <span key={i} onClick={onSearchHandler(item)}>{item}</span>) : (<div>暂无最近搜索内容</div>)}
                </div>
            )}
            {!thisState.recent_show && (
                <div className="search-result-container">
                    {thisState.result && thisState.result.length ? thisState.result.map(item => (
                        <Link key={item.id} className="search-result-item" to={`${LOCAL_URL['HOME_DETAIL']}/${item.id}`}>
                            <p dangerouslySetInnerHTML={{ __html: item.title.replace(thisState.value, `<span class="result-title-highlight">${thisState.value}</span>`) }}></p>
                            <p>{item.text.replace(/<\/?.+?\/?>/g, '').slice(0, 150) || '文章无内容'}</p>
                            <p><span>{item.category.name}</span></p>
                        </Link>
                    )) : (
                        <div className="list-none">找不到包含该关键词的新闻内容</div>
                    )}
                </div>
            )}

        </div>
    )
}
import React, { Component, useState, useEffect, useContext, useRef } from 'react';
import { findDomNode } from 'react-dom';
import ScrollTo from 'react-scroll-into-view'

import ShopContext from '../context/shop';

import config from '../lib/config';
import superFetch from '../lib/api';

const DEFAULT_AVATAR = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561547251987&di=e63f4f0adfe4ffffa7ed7fa8c0fc9580&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa12f24e688c1cda3ff4cc453f3486a88adaf08cc2cdb-tQvJqX_fw658';

const robot = {
    name: '实践中心',
    avatar: DEFAULT_AVATAR,
    content: `我猜您有一股脑儿的问题或不满或建议，别急，慢慢说……
    
    您的每一句话都宝贵，我听着呢！还可以留下你的联系方式，这样会更快收到我们的回复哟~
    
    `
}

export default (props) => {

    const shopContext = useContext(ShopContext);
    const [thisState, setState] = useState ([])
    const input_ref = useRef();
    let timer = null;

    useEffect(() => {
        toFetchSuggestion();
    }, [shopContext.user]);

    const toScroll = (time) => {
        timer = setTimeout(() => {
            document.querySelector('.scroll-to').click();
            clearTimeout(timer)
        }, time)
    }

    const toFetchSuggestion = async () => {
        if (shopContext.user) {
            const suggestion_customer = await superFetch.get(`/feedback/list?userId=${shopContext.user.id}`);
            if (suggestion_customer[1]) {
                setState(() => {
                    const data = suggestion_customer[0].reverse().map(item => ({
                        name: item.user ? item.user.account : '自己',
                        avatar: item.user ? item.user.avatarPath : DEFAULT_AVATAR,
                        content: item.title
                    }));
                    data.push(robot);
                    toScroll(0)
                    return data;
                });
            }
        }
    }

    const toCreateNewSuggestion = async () => {
        await superFetch.post('/feedback', { title: input_ref.current.value });
        setState((prevState) => {
            prevState.push({
                name: shopContext.user ? shopContext.user.account : '自己',
                avatar: shopContext.user ? shopContext.user.avatarPath : DEFAULT_AVATAR,
                content: input_ref.current.value
            })
            toScroll(1000);
            input_ref.current.value = '';
            return [].concat(prevState);
        })
    }

    return (
        <div className="hdz-suggestion-container">
            <div className="hdz-suggestion-list">
                {thisState.map((item, i) => (
                    <div className={`suggestion-message-${item.name === '实践中心' ? 'left' : 'right'}`} key={i}>
                        <div className="suggestion-author-info">
                            <img src={item.avatar} alt='图片已失效' />
                            <p>{item.name}</p>
                        </div>
                        <div className="suggestion-content-info" id={i === thisState.length - 1 ? 'last-one' : ''}>
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>

            <ScrollTo
                className="scroll-to"
                style={{ position: "fixed", bottom: '-50px', right: '-50px', zIndex: '-999', opacity: '0' }}
                selector="#last-one"
            >
                跳转到最新的一条数据
            </ScrollTo>

            <div className="suggestion-input">
                <input type="text" placeholder="提点建议" ref={input_ref}/>
                <span onClick={toCreateNewSuggestion}>发送</span>
            </div>
        </div>
    )
}
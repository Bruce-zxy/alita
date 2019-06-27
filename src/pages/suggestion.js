import React, { Fragment, Component } from 'react';
import { List, InputItem, DatePickerView, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL } = config;

export default class extends Component {

    state = {
        suggestion: [{
            name: '实践中心',
            avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
            content: `我猜您有一股脑儿的问题或不满或建议，别急，慢慢说……
    
    您的每一句话都宝贵，我听着呢！还可以留下你的联系方式，这样会更快收到我们的回复哟~
    
    `
        }]    
    }

    toCreateNewSuggestion = () => (
        this.setState((prevState) => {
            prevState.suggestion.push({
                name: 'test',
                avatar: 'http://dummyimage.com/800x600/E8EDF5/5593F8.gif&text=AVATAR',
                content: this.input.value
            })
            return {
                suggestion: [].concat(prevState.suggestion)
            }
        }, () => this.input.value = '')
    )

    render() {
        const { suggestion } = this.state;


        return (
            <div className="hdz-suggestion-container">
                {suggestion.map((item, i) => (
                    <div className={`suggestion-message-${!i ? 'left' : 'right'}`} key={i}>
                        <div className="suggestion-author-info">
                            <img src={item.avatar} alt='placeholder+image' />
                            <p>{item.name}</p>
                        </div>
                        <div className="suggestion-content-info">
                            {item.content}
                        </div>
                    </div>
                ))}

                <div className="suggestion-input">
                    <input type="text" placeholder="提点建议" ref={ins => this.input = ins}/>
                    <span onClick={this.toCreateNewSuggestion}>发送</span>
                </div>
            </div>
        )
    }
}
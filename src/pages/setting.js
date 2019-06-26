import React, { Fragment, Component } from 'react';

import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL } = config;

const user = {
    name: '她在岛屿写日记',
    avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=AVATAR',
    scores: '152',
    sex: '女',
    phone: '18679183994'
}

export default class extends Component {


    render() {
        return (
            <div className="hdz-setting">
                <a className="user-avatar">
                    <span>头像</span>
                    <p><img src={user.avatar} alt='placeholder+image' /></p>
                    <i className="iconfont iconjiantouyou"></i>
                </a>
                <a className="user-name" href={LOCAL_URL['NICKNAME']}>
                    <span>昵称</span>
                    <p>{user.name || '未设置'}</p>
                    <i className="iconfont iconjiantouyou"></i>
                </a>
                <a className="user-sex" href={LOCAL_URL['SEX']}>
                    <span>性别</span>
                    <p>{user.sex || '未设置'}</p>
                    <i className="iconfont iconjiantouyou"></i>
                </a>
                <a className="user-title">
                    <span>联系方式</span>
                </a>
                <a className="user-phone" href={LOCAL_URL['PHONE']}>
                    <span>手机</span>
                    <p>{user.phone || '未设置'}</p>
                    <i className="iconfont iconjiantouyou"></i>
                </a>
            </div>
        )
    }
}
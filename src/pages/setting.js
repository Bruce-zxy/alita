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

const SettingInfoLayout = ({ title, onSave, toGoBack, children }) => (
    <div className="hdz-setting-info">
        <div className="setting-info-header">
            <i className="iconfont iconjiantouzuo" onClick={toGoBack}></i>
            <p>{title}</p>
            <a href="javascript:;" onClick={onSave}>保存</a>
        </div>
        <div className="setting-info-function-area">
            {children}
        </div>
    </div>
)

export default class extends Component {

    state = {
        value: '',
    }

    onSave = (e) => {
        e.preventDefault();
        console.log(e);
    };
    

    toGoBack = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    }

    toRenderSettingInfo = (type) => {
        const { value } = this.state;
        
        switch (type) {
            case 'nickname':
                return (
                    <SettingInfoLayout title="修改昵称" onSave={this.onSave} toGoBack={this.toGoBack}>
                        <input type="text" placeholder="昵称" onChange={(e) => this.setState({ value: e.target.value })}/>
                    </SettingInfoLayout>
                )
                break;
            case 'sex':
                return (
                    <SettingInfoLayout title="修改性别" onSave={this.onSave} toGoBack={this.toGoBack}>
                        <div className={`male ${value === 'male' ? 'active' : ''}`} onClick={(e) => this.setState({ value: 'male' })}>
                            <i className="iconfont iconnan"></i>
                            <span>男</span>
                            <i className="iconfont iconxuanzhong"></i>
                        </div>
                        <div className={`female ${value === 'female' ? 'active' : ''}`} onClick={(e) => this.setState({ value: 'female' })}>
                            <i className="iconfont iconnv"></i>
                            <span>女</span>
                            <i className="iconfont iconxuanzhong"></i>
                        </div>
                    </SettingInfoLayout>
                )
                break;
            case 'phone':
                return (
                    <SettingInfoLayout title="修改手机号" onSave={this.onSave} toGoBack={this.toGoBack}>
                        <p className="user-info-phone">您的手机号：{user.phone ? user.phone.toString().replace(/(?<=[\d]{3})\d(?=[\d]{3})/g, '*') : '暂未绑定'}</p>
                        <input type="text" placeholder="请输入新的手机号" onChange={(e) => this.setState({ value: e.target.value })} />
                    </SettingInfoLayout>
                )
                break;
            default:
                return this.toRenderSettingContent();
        }
    }

    toRenderSettingContent = () => (
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

    onRenderType = (type) => {
        if (!!type) {
            return this.toRenderSettingInfo(type);
        } else {
            return this.toRenderSettingContent();
        }
    }

    render() {
        return this.onRenderType(this.props.match.params.type);
    }
}
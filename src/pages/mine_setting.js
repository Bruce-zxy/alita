import React, { useState, useContext, useEffect } from 'react';
import { Toast } from 'antd-mobile';

import config from '../lib/config';
import superFetch from '../lib/api';

import ShopContext from '../context/shop';
const { LOCAL_URL, DEFAULT_AVATAR } = config;

// const user = {
//     name: '她在岛屿写日记',
//     avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=AVATAR',
//     scores: '152',
//     gender: '女',
//     phone: '18679183994'
// }

export default ({ history, match }) => {

    const [thisState, setState] = useState({ value: '' });

    const shopContext = useContext(ShopContext);
    useEffect(() => {
        shopContext.updateUserInfo();
    }, []);
    const user = shopContext.user;


    const onSave = async (e) => {
        e.preventDefault();
        const { params: { type } } = match;
        if (!!thisState.value || thisState.value === 0) {
            user[type] = thisState.value
            const res = await shopContext.updateCurrentUserInfo(user);
            if (res instanceof Error) {
                Toast.fail('更新失败！');
            }else {
                setTimeout(() => {
                    history.goBack();
                }, 1000);
                Toast.success('更新成功！');
            }
            
        }

    };

    const toGoBack = (e) => {
        e.preventDefault();
        history.goBack();
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

    const toRenderSettingInfo = (type) => {
        const { value } = thisState;
        
        switch (type) {
            case 'nickname':
                return (
                    <SettingInfoLayout title="修改昵称" onSave={onSave} toGoBack={toGoBack}>
                        <input type="text" autoFocus placeholder={"昵称"} value={thisState.value} onChange={(e) => setState({ value: e.target.value })}/>
                    </SettingInfoLayout>
                )
                break;
            case 'gender':
                return (
                    <SettingInfoLayout title="修改性别" onSave={onSave} toGoBack={toGoBack}>
                        <div className={`male ${value === 0 ? 'active' : ''}`} onClick={(e) => setState({ value: 0 })}>
                            <i className="iconfont iconnan"></i>
                            <span>男</span>
                            <i className="iconfont iconxuanzhong"></i>
                        </div>
                        <div className={`female ${value === 1 ? 'active' : ''}`} onClick={(e) => setState({ value: 1 })}>
                            <i className="iconfont iconnv"></i>
                            <span>女</span>
                            <i className="iconfont iconxuanzhong"></i>
                        </div>
                    </SettingInfoLayout>
                )
                break;
            case 'phone':
                return (
                    <SettingInfoLayout title="修改手机号" onSave={onSave} toGoBack={toGoBack}>
                        <p className="user-info-phone">您的手机号：{!!user && user.phone ? user.phone.toString().replace(/^(\d{3})\d+(\d{3})$/, "$1*****$2") : '暂未绑定'}</p>
                        <input type="text" autoFocus placeholder="请输入新的手机号" value={thisState.value} onChange={(e) => setState({ value: e.target.value.toString().slice(0,11) })} />
                    </SettingInfoLayout>
                )
                break;
            default:
                return toRenderSettingContent();
        }
    }

    const toRenderSettingContent = (user) => !!user && (
        <div className="hdz-setting">
            <a className="user-avatar">
                <span>头像</span>
                <p><img src={user.avatar || DEFAULT_AVATAR} alt='图片已失效' /></p>
                <i className="iconfont iconjiantouyou"></i>
            </a>
            <a className="user-name" href={LOCAL_URL['NICKNAME']}>
                <span>昵称</span>
                <p>{user.nickname || '未设置'}</p>
                <i className="iconfont iconjiantouyou"></i>
            </a>
            <a className="user-sex" href={LOCAL_URL['GENDER']}>
                <span>性别</span>
                <p>{user.gender === 0 ? '男' : user.gender === 1 ? '女' : '未设置'}</p>
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

    const onRenderType = (type) => {
        if (!!type) {
            return toRenderSettingInfo(type);
        } else {
            return toRenderSettingContent(user);
        }
    }

    return onRenderType(match.params.type);
}
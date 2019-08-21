import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';

import { LOCAL_URL } from '../config/common';

import "../style/sign.scss";
import * as BG from "../images/bg.jpg";

export default (props) => {

    const CODE_INTERVAL = 60;

    const [thisState, setState] = useState({
        phone: '',
        code: '',
        password: '',
        timer: null,
        counter: CODE_INTERVAL,
        code_status: '发送验证码'
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    const toSubmitRegisterInfo = () => {
        console.log(thisState);
        

        Toast.success('恭喜，注册成功！页面将在3秒后跳转', 3);
        setTimeout(() => {
            props.history.push(LOCAL_URL['MINE'])
        }, 3000);
    }

    const toFetchCode = () => {
        let { timer, counter, code_status } = thisState;
        if (timer) {
            return false;
        } else {
            toChangeStateFactor('timer')(timer => timer = 1);
            timer = setInterval(() => {
                if (counter === 1) {
                    clearInterval(timer);
                    timer = null;
                    counter = CODE_INTERVAL;
                    code_status = `发送验证码`;
                } else {
                    counter -= 1;
                    code_status = (() => <Fragment>{counter}秒后<br />重新发送</Fragment>)();
                }
                setState(Object.assign({}, thisState, { timer, counter, code_status }));
            }, 1000);
        }
    }


    return (
        <div className="hdz-lvyoto-signup" style={{ backgroundImage: `url(${BG})` }}>
            <div className="sign-up-panel">
                <p>您好，</p>
                <p>欢迎来到旅游项目通</p>
                <div className="signup-form">
                    <p>
                        <i className="iconfont iconicon--"></i>
                        <input type="number" placeholder="请输入手机号" onChange={(e) => toChangeStateFactor('phone')(phone => phone = e.target.value)}/>
                    </p>
                    <p>
                        <i className="iconfont iconyanzhengma"></i>
                        <input type="text" placeholder="请输入验证码" onChange={(e) => toChangeStateFactor('code')(code => code = e.target.value)}/>
                        <span onClick={toFetchCode}>{thisState.code_status}</span>
                    </p>
                    <p>
                        <i className="iconfont iconmimasuo"></i>
                        <input type="password" placeholder="请输入密码" onChange={(e) => toChangeStateFactor('password')(password => password = e.target.value)}/>
                    </p>
                </div>
                <div className="to-signup" onClick={toSubmitRegisterInfo}>注册</div>
                <Link to={LOCAL_URL['HOME']} className="back-to-home"><i className="iconfont iconzuobain"></i>前往首页</Link>
            </div>
        </div>
    )
}
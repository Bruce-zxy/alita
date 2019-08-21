import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { withApollo } from "react-apollo";

import { LOCAL_URL, API_ROOT } from '../config/common';
import { Fetch } from '../utils/global';

import "../style/sign.scss";
import * as BG from "../images/bg.jpg";

const DEFAULT_PHONE = global.C4("18679183994");
const DEFAULT_PASSWD = global.C4("18679183994");
const DEFAULT_RE_PASSWD = global.C4("18679183994");

export default withApollo((props) => {

    const CODE_INTERVAL = 60;

    const [thisForm, setForm] = useState({
        phone: DEFAULT_PHONE,
        code: '',
        password: DEFAULT_PASSWD,
        re_password: DEFAULT_RE_PASSWD
    })

    const [thisState, setState] = useState({
        timer: null,
        counter: CODE_INTERVAL,
        code_status: '发送验证码',
        svg_code: '',
        svg_code_key: '',
        svg_code_dom: ''
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }
    const toChangeFormFactor = (key) => (handler) => {
        thisForm[key] = handler(thisForm[key]);
        setForm(Object.assign({}, thisForm));
    }

    const toSubmitRegisterInfo = async () => {

        const res = await Fetch(`${API_ROOT}/user/register`, {
            "phone": thisForm.phone,
            "smsCode": thisForm.code,
            "password": thisForm.password,
            "confirmPassword": thisForm.re_password
        }).then(res => res.json());

        if (res.message) {
            const { message: { error, message } } = res;
            if (error) Toast.fail(message);
        } else if (res.id) {
            Toast.success('恭喜，注册成功！页面即将跳转到登录界面！');
            props.history.push(LOCAL_URL['MINE']);
        }
        
    }

    const toFetchCode = async () => {
        let { timer, counter, code_status } = thisState;
        if (timer) {
            return false;
        } else {
            const res = await Fetch(`${API_ROOT}/verification/sms`, {
                phone: thisForm.phone,
                svgCode: thisState.svg_code,
                svgKey: thisState.svg_code_key,
                smsType: "register"
            }).then(res => res.json());
            
            if (typeof res === 'boolean') {
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
                    setState({ ...thisState, timer, counter, code_status });
                }, 1000);
            } else if (typeof res === 'object') {
                const { message: { error, message } } = res;
                if (error) Toast.fail(message);
            }
        }
    }

    const toFetchCodeSVG = () => {
        if (!global.reg_svg_flag) {
            global.reg_svg_flag = true;
            Fetch(`${API_ROOT}/verification/svg`).then(async res => {
                const { key, data } = await res.json();
                setState({
                    ...thisState,
                    svg_code_key: key,
                    svg_code_dom: data
                });
                global.reg_svg_flag = false;
            });
        }
    }

    useEffect(toFetchCodeSVG, [])

    global.TNT(thisState, thisForm);

    return (
        <div className="hdz-lvyoto-signup" style={{ backgroundImage: `url(${BG})` }}>
            <div className="sign-up-panel">
                <p>您好，</p>
                <p>欢迎来到旅游项目通</p>
                <div className="signup-form">
                    <p>
                        <i className="iconfont iconicon--"></i>
                        <input defaultValue="18679183994" type="number" placeholder="请输入手机号" onChange={(e) => toChangeFormFactor('phone')(phone => phone = e.target.value)}/>
                    </p>
                    <p>
                        <i className="iconfont iconyanzhengma1"></i>
                        <input type="text" placeholder="请输入图形验证码" onChange={(e) => toChangeStateFactor('svg_code')(svg_code => svg_code = e.target.value)} maxLength="4" />
                        <span onClick={toFetchCodeSVG} dangerouslySetInnerHTML={{ __html: thisState.svg_code_dom }}></span>
                    </p>
                    <p>
                        <i className="iconfont iconyanzhengma"></i>
                        <input type="text" placeholder="请输入短信验证码" onChange={(e) => toChangeFormFactor('code')(code => code = e.target.value)}/>
                        <span onClick={toFetchCode}>{thisState.code_status}</span>
                    </p>
                    <p>
                        <i className="iconfont iconmimasuo"></i>
                        <input defaultValue="18679183994" type="password" placeholder="请输入密码" onChange={(e) => toChangeFormFactor('password')(password => password = e.target.value)}/>
                    </p>
                    <p>
                        <i className="iconfont iconmimasuo"></i>
                        <input defaultValue="18679183993" type="password" placeholder="请再次输入密码" onChange={(e) => toChangeFormFactor('re_password')(re_password => re_password = e.target.value)} />
                    </p>
                </div>
                <div className="to-signup" onClick={toSubmitRegisterInfo}>注册</div>
                <Link to={LOCAL_URL['HOME']} className="back-to-home"><i className="iconfont iconzuobain"></i>前往首页</Link>
            </div>
        </div>
    )
})
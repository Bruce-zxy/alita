import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { withApollo } from "react-apollo";

import { LOCAL_URL, DEFAULT_USERNAME, DEFAULT_PASSWORD, API_ROOT } from '../config/common';
import { toFetchCurrentUser, Fetch } from '../utils/global';
import { M_LOGIN } from '../gql';
import "../style/sign.scss";

const DEFAULT_PHONE = global.C4("18679183994");
const DEFAULT_PASSWD = global.C4("18679183994");
const DEFAULT_RE_PASSWD = global.C4("18679183994");

const thisForm = {
    phone: DEFAULT_PHONE,
    code: '',
    password: DEFAULT_PASSWD,
    re_password: DEFAULT_RE_PASSWD
};

const StepShow = ({ index }) => {
    return (
        <div className="forgot-step-show">
            <div className={`step-tips ${index*1 === 1 ? 'active': ''}`} data-index="01">验证账号</div>
            <div className="step-divider"></div>
            <div className={`step-tips ${index*1 === 2 ? 'active': ''}`} data-index="02">重置密码</div>
            <div className="step-divider"></div>
            <div className={`step-tips ${index*1 === 3 ? 'active': ''}`} data-index="03">完成</div>
        </div>
    )
}

const ForgotFinalStep = (props) => {
    return (
        <Fragment>
            <StepShow index={props.index} />
            <div className="signin-panel">
                <div className="forgot-completed" onClick={() => props.history.push(`${LOCAL_URL['SIGNIN']}?index=0`)}>
                    <i className="iconfont iconchenggong"></i>
                    <div>修改密码成功</div>
                    <span>请点击此处返回登录页面</span>
                </div>
            </div>
        </Fragment>
    )
}

const ForgotSecondStep = (props) => {

    const { toSetPanelIndex, index } = props;

    const toNextStep = async () => {
        const { phone, code, password, re_password } = thisForm;

        const res = await Fetch(`${API_ROOT}/user/reset-password`, {
            phone: phone,
            password: password,
            confirmPassword: re_password,
            smsCode: code
        }).then(res => res.json());

        if (res.message) {
            const { message: { error, message } } = res;
            if (error) Toast.fail(message);
        } else if (res.id) {
            toSetPanelIndex(3);
        }

    }

    return (
        <Fragment>
            <StepShow index={index} />
            <div className="signin-panel">
                <p>
                    <i className="iconfont iconmimasuo"></i>
                    <input type="password" defaultValue={DEFAULT_PASSWD} placeholder="请输入新的密码" onChange={(e) => thisForm.password = e.target.value} />
                </p>
                <p>
                    <i className="iconfont iconmimasuo"></i>
                    <input type="password" defaultValue={DEFAULT_RE_PASSWD} placeholder="请再次输入新的密码" onChange={(e) => thisForm.re_password = e.target.value} />
                </p>
                <p className="signin-button" onClick={toNextStep}>下一步</p>
                <p className="signin-function">
                    <a href="javascript:;" onClick={() => toSetPanelIndex(1)}>返回</a>
                </p>
            </div>  
        </Fragment>
    )
}

const ForgotFirstStep = (props) => {

    const { toSetPanelIndex, index } = props;

    const CODE_INTERVAL = 60;

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

    const toNextStep = () => {
        toSetPanelIndex(2);
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

    const toFetchCode = async () => {
        let { timer, counter, code_status } = thisState;
        if (timer) {
            return false;
        } else {
            const res = await Fetch(`${API_ROOT}/verification/sms`, {
                phone: thisForm.phone,
                svgCode: thisState.svg_code,
                svgKey: thisState.svg_code_key,
                smsType: "password"
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

    return (
        <Fragment>
            <StepShow index={index} />
            <div className="signin-panel">
                <p>
                    <i className="iconfont iconicon--"></i>
                    <input type="text" defaultValue={DEFAULT_PHONE} placeholder="请输入注册手机号" onChange={(e) => thisForm.phone = e.target.value} />
                </p>
                <p>
                    <i className="iconfont iconyanzhengma1"></i>
                    <input type="text" placeholder="请输入图形验证码" onChange={(e) => toChangeStateFactor('svg_code')(svg_code => svg_code = e.target.value)} maxLength="4" />
                    <span onClick={toFetchCodeSVG} dangerouslySetInnerHTML={{ __html: thisState.svg_code_dom }}></span>
                </p>
                <p>
                    <i className="iconfont iconyanzhengma"></i>
                    <input type="text" placeholder="请输入验证码" onChange={(e) => thisForm.code = e.target.value} />
                    <span className="check-code" onClick={toFetchCode}>{thisState.code_status}</span>
                </p>
                <p className="signin-button" onClick={toNextStep}>下一步</p>
                <p className="signin-function">
                    <a href="javascript:;" onClick={() => toSetPanelIndex(0)}>返回</a>
                </p>
            </div>
        </Fragment>
    )
}

const Login = withApollo((props) => {

    const { client, history, location } = props;
    const token = localStorage.getItem('u_token');
    if (token) {
        history.push(LOCAL_URL['MINE']);
    }

    const DEFAULT_USER = global.C4(DEFAULT_USERNAME);
    const DEFAULT_PASS = global.C4(DEFAULT_PASSWORD);

    const [thisState, setState] = useState({
        account: DEFAULT_USER,
        password: DEFAULT_PASS
    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }
    
    const toLogin = async () => {
        
        const { account, password } = thisState;
        global.TNT(thisState, props);

        if (account && password) {
            let { data } = await client.mutate({
                mutation: M_LOGIN,
                variables: { loginData: thisState }
            });
            
            if (data && data.login && data.login.token) {
                localStorage.setItem('u_token', data.login.token);
                const user = await toFetchCurrentUser(client);
                if (user) {
                    Toast.success('登录成功！', 1);
                    if (location.pathname === LOCAL_URL['SIGNIN']) {
                        history.push(LOCAL_URL['MINE']);
                    } else {
                        window.location.reload();
                    }
                } else {
                    Toast.fail('登录失败！请联系管理员！');
                }
            } else {
                Toast.fail('登录失败！请联系管理员！');
            }
        } else {
            Toast.info('用户名密码不能为空！', 1);
        }
    }

    return (
        <div className="signin-panel">
            <p>
                <i className="iconfont iconyonghuming"></i>
                <input type="text" placeholder="请输入用户名" defaultValue={DEFAULT_USER} onChange={(e) => toChangeStateFactor('account')(account => account = e.target.value.trim())} />
            </p>
            <p>
                <i className="iconfont iconmimasuo"></i>
                <input type="password" placeholder="请输入密码" defaultValue={DEFAULT_PASS} onChange={(e) => toChangeStateFactor('password')(password => password = e.target.value.trim())} />
            </p>
            <p className="signin-button" onClick={toLogin}>登录</p>
            <p className="signin-function">
                <Link to={LOCAL_URL['SIGNUP']}>前往注册</Link>
                <a href="javascript:;" onClick={() => props.toSetPanelIndex(1)}>忘记密码</a>
            </p>
        </div>
    )
})

export default (props) => {
    const { pathname, search, state } = props.location;
    
    let params = {};
    let params_str = search.split('?')[1] || '';
    params_str.split('&').forEach(param => {
        let [key, val] = param.split('=');
        params[key] = val;
    })

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (params.index) setIndex(params.index);
    }, [search])

    const toSetPanelIndex = (i) => {
        props.history.push(`${pathname}?index=${i}`);
        setIndex(i);
    };

    global.TNT(thisForm);
    
    const panels = [
        <Login toSetPanelIndex={toSetPanelIndex} index={index} {...props} />, 
        <ForgotFirstStep toSetPanelIndex={toSetPanelIndex} index={index} {...props} />, 
        <ForgotSecondStep toSetPanelIndex={toSetPanelIndex} index={index} {...props} />, 
        <ForgotFinalStep toSetPanelIndex={toSetPanelIndex} index={index} {...props} />
    ];

    if (state && state.message) {
        Toast.fail(state.message, 2);
    }

    return (
        <div className="hdz-lvyoto-signin">
            <div className="sign-bottom"></div>
            {panels[index]}
        </div>
    )
}
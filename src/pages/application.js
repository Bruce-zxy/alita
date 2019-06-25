import React, { useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { Toast } from 'antd-mobile';
import * as _ from 'lodash';

// import ShopContext from '../context/shop';

const NAME = 'name';
const PHONE = 'phone';
const IDCARD = 'idcard';
const ADDRESS = 'address';

const toCheckoutName = ({ value }) => { 
    if (value.length < 2) {
        throw new Error('请输入您的全名！');
    }
} 
const toCheckoutPhoneNumber = ({ value }) => {
    if (value.replace('+', '').replace(/^86/, '').length !== 11) {
        throw new Error('请输入正确的11位手机号！');
    }
} 
const toCheckoutIDCard = ({ value }) => {
    if (!value.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)) {
        throw new Error('请输入正确的身份证号！');
    }
} 
const toCheckoutAddress = ({ value }) => {
    if (value.length < 6) {
        throw new Error('请输入完整的地址！');
    }
} 

const onSubmitHandler = (form) => () => {
    const form_container = ReactDom.findDOMNode(form.current);
    const input_set = Array.from(form_container.children).filter(child => child.tagName === "INPUT");
    try {
        toCheckoutName(_.find(input_set, { name: NAME }));
        toCheckoutPhoneNumber(_.find(input_set, { name: PHONE }));
        toCheckoutIDCard(_.find(input_set, { name: IDCARD }));
        toCheckoutAddress(_.find(input_set, { name: ADDRESS }));
    } catch(err) {
        return Toast.fail(err.message, 1);
    }

    // to Login Action
    console.log(input_set);
    
}

export default () => {

    const form_ref = useRef(null);

    return (
        <div className="hdz-volunteer-application">

            <div className="hdz-application-header">
                <p>申请成为志愿者</p>
                <p>APPLY TO BE A VOLUNTEER</p>
            </div>

            <div className="hdz-application-form">
                <p>请留下您的联系方式</p>
                <div className="hdz-application-form-body" ref={form_ref}>
                    <input type="text" name={NAME} placeholder="姓名（不大于6个字符）"/>
                    <input type="number" name={PHONE} placeholder="电话"/>
                    <input type="number" name={IDCARD} placeholder="身份证"/>
                    <input type="text" name={ADDRESS} placeholder="地址（请在开头带上省/市）"/>
                    <a href="javascript:;" onClick={onSubmitHandler(form_ref)}>提交申请</a>
                </div>
            </div>
      
        </div>
    )
}

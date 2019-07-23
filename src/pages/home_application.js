import React, { useRef, useContext, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Toast } from 'antd-mobile';
import * as _ from 'lodash';

import { getKeyValue } from '../lib/persistance';
import superFetch from '../lib/api';
import ShopContext from '../context/shop';

import { LOCAL_URL } from '../config/common';

const NAME = 'realName';
const PHONE = 'phone';
const IDCARD = 'idCard';
const ADDRESS = 'address';
const ORGANIZATION = 'org';

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

const onSubmitHandler = (form, shopContext) => (history) => async () => {
    
    const form_container = ReactDom.findDOMNode(form.current);
    const input_set = Array.from(form_container.children).filter(child => child.tagName === "INPUT");
    const select_set = Array.from(form_container.children).filter(child => child.tagName === "SELECT");
    const name = _.find(input_set, { name: NAME });
    const phone = _.find(input_set, { name: PHONE });
    const idcard = _.find(input_set, { name: IDCARD });
    const address = _.find(input_set, { name: ADDRESS });
    const org = _.find(select_set, { name: ORGANIZATION });
    try {
        toCheckoutName(name);
        toCheckoutPhoneNumber(phone);
        toCheckoutIDCard(idcard);
        toCheckoutAddress(address);
    } catch(err) {
        return Toast.fail(err.message, 1);
    }

    const user = Object.assign(JSON.parse(getKeyValue('current_user')), {
        [NAME]: name.value,
        [PHONE]: phone.value,
        [IDCARD]: idcard.value,
        [ADDRESS]: address.value,
        [ORGANIZATION]: org.value,
    });
    
    // to Login Action
    const result = await superFetch.post('/user/apply', user);
    
    if (result) {
        await shopContext.updateUserInfo();
        setTimeout(() => history.go(-1), 1000);
        return Toast.success('申请成功！', 1);
    } else {
        return Toast.fail('申请失败或您已经申请过了！！', 1);
    }

}

export default ({ history }) => {
    const shopContext = useContext(ShopContext);
    useEffect(() => {
        if (shopContext.user.isVolunteer) {
            window.location.href = LOCAL_URL['MINE'];
        }
    }, [])
    const form_ref = useRef(null);
    const orgs = shopContext.organizations.reduce((prev, curr) => prev.concat(curr.children), []);

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
                    <input type="text" name={IDCARD} placeholder="身份证"/>
                    <select name={ORGANIZATION} >
                        {orgs.map((organization) => (
                            <option value={organization.id} key={organization.id}>{organization.name}</option>
                        ))}
                    </select>
                    <input type="text" name={ADDRESS} placeholder="地址（请在开头带上省/市）"/>
                    <a href="javascript:;" onClick={onSubmitHandler(form_ref, shopContext)(history)}>提交申请</a>
                </div>
            </div>
      
        </div>
    )
}

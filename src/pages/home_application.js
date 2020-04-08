import React, { useRef, useContext, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { Toast, Radio, List, Picker, Flex } from 'antd-mobile';
import * as _ from 'lodash';
import arrayTreeFilter from 'array-tree-filter';

import { getKeyValue } from '../lib/persistance';
import superFetch from '../lib/api';
import ShopContext from '../context/shop';

import { LOCAL_URL } from '../config/common';
const RadioItem = Radio.RadioItem;
const NAME = 'realName';
const PHONE = 'phone';
const IDCARD = 'idCard';
const ADDRESS = 'address';
const ORGANIZATION = 'org';

const data = [
    { value: 0, label: '县级志愿者' },
    { value: 1, label: '乡村志愿者' },
  ];

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
    if (!!value && !value.match(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)) {
        throw new Error('请输入正确的身份证号！');
    }
} 
const toCheckoutAddress = ({ value }) => {
    if (value.length < 6) {
        throw new Error('请输入完整的地址！');
    }
} 

const toTransformAreaTreeProps = (data, map) => data.map(node => {
    let node_object = {
      label: node[map.key || 'key'],
      value: node[map.value || 'value']
    }
    if (node.children && node.children.length > 0) {
      node_object[map.children || 'children'] = toTransformAreaTreeProps(node.children, map);
    }
    return node_object;
});

const onSubmitHandler = (form, shopContext, value, countyValue, pickerValue) => (history) => async () => {
    
    const form_container = ReactDom.findDOMNode(form.current);
    const input_set = Array.from(form_container.children).filter(child => child.tagName === "INPUT");
    const select_set = Array.from(form_container.children).filter(child => child.tagName === "SELECT");
    const name = _.find(input_set, { name: NAME });
    const phone = _.find(input_set, { name: PHONE });
    const idcard = _.find(input_set, { name: IDCARD });
    const address = _.find(input_set, { name: ADDRESS });
    //const org = value === 0 ? _.find(select_set, { name: ORGANIZATION }) :  {value: pickerValue[pickerValue.length - 1]};
    const org = value === 0 ? countyValue[0] : pickerValue[pickerValue.length - 1];
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
        [ORGANIZATION]: org,
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
    const [value, setValue] = useState(0);
    const [visiable, setVisiable] = useState(false);
    const [pickerValue, setPickerValue] = useState(null);
    const [countyValue, setCountyValue] = useState(null);
    const form_ref = useRef(null);
    const orgs = shopContext.organizations.filter(item=>{return item.desc === 'county'}).reduce((prev, curr) => prev.concat(curr.children), []);
    const org_data = toTransformAreaTreeProps(orgs, { key: 'name', value: 'id' })
    const villages = shopContext.organizations.filter(item=>{return item.desc !== 'county'});
    const village_data = toTransformAreaTreeProps(villages, { key: 'name', value: 'id', children: 'children' });

    const onChange = (value) => {
        console.log('checkbox');
        setValue(value);
    };

    const getSel = () => {
        const value = pickerValue;
        if (!value) {
            return '';
        }
        const treeChildren = arrayTreeFilter(village_data, (c, level) => c.value === value[level]);
        return treeChildren.map(v => v.label).join(',');
    }

    return (
        <div className="hdz-volunteer-application">

            <div className="hdz-application-header">
                <p>申请成为志愿者</p>
                <p>APPLY TO BE A VOLUNTEER</p>
            </div>

            <div className="hdz-application-form">
                <p>请留下您的联系方式</p>
                <div className="hdz-application-form-body" ref={form_ref}>
                {/* <List renderHeader={() => '选择级别'}>
                    {data.map(i => (
                    <RadioItem key={i.value} checked={value === i.value} onChange={() => onChange(i.value)}>
                        {i.label}
                    </RadioItem>
                    ))}
                </List> */}
                    <Flex style={{ padding: '15px' }}>
                        <Flex.Item style={{ padding: '15px 0', color: '#888', flex: 'none' }}>选择组织类型</Flex.Item>
                        {data.map(i => (
                    
                        <Flex.Item>
                        <Radio className="my-radio" key={i.value} checked={value === i.value} onChange={() => onChange(i.value)}>{i.label}</Radio>
                        </Flex.Item>
                    ))}
                    </Flex>
                    <input type="text" name={NAME} placeholder="姓名（不大于6个字符，必填）"/>
                    <input type="number" name={PHONE} placeholder="电话（必填）"/>
                    <input type="text" name={IDCARD} placeholder="身份证"/>
                    {value === 0 ? (
                    // <select name={ORGANIZATION} >
                    //     <option value="0" key="org">请选择所在的组织</option>
                    //     {orgs.map((organization) => (
                    //         <option value={organization.id} key={organization.id}>{organization.name}</option>
                    //     ))}
                    // </select>
                    <Picker 
                        data={org_data}
                        cols={1}
                        placeholder="必选" 
                        name={ORGANIZATION} 
                        className="forss"
                        value={countyValue}
                        onChange={v => setCountyValue(v)}
                        onOk={() => setVisiable(false)}
                        onDismiss={() => setVisiable(false)}
                    >
                        <List.Item arrow="horizontal">服务分队</List.Item>
                    </Picker>
                    ) : (
                        <Picker
                            className="picker"
                            name={ORGANIZATION}
                            cols={2}
                            visible={visiable}
                            data={village_data}
                            value={pickerValue}
                            onChange={v => setPickerValue(v)}
                            onOk={() => setVisiable(false)}
                            onDismiss={() => setVisiable(false)}
                        >
                            <List.Item extra={getSel()} onClick={() => setVisiable(true)}>所在地区</List.Item>
                        </Picker>
                    )}
                    <input type="text" name={ADDRESS} placeholder="详细地址"/>
                    <a href="javascript:;" onClick={onSubmitHandler(form_ref, shopContext, value, countyValue, pickerValue)(history)}>提交申请</a>
                </div>
            </div>
      
        </div>
    )
}

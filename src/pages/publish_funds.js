import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { List, InputItem, TextareaItem, Toast, Modal, ImagePicker, Picker } from 'antd-mobile';
import { Radio, Tag } from 'antd';
import { createForm } from 'rc-form';

import TagsView from '../components/TagsView';
import { LOCAL_URL } from '../config/common';

import 'antd/es/radio/style/css';
import "../style/publish.scss";

const seasons = [
    [{
        label: '2013',
        value: '2013',
    }, {
        label: '2014',
        value: '2014',
    }], [{
        label: '春',
        value: '春',
    }, {
        label: '夏',
        value: '夏',
    }]
];

const PublishFunds = (props) => {

    const { getFieldProps, getFieldsValue, setFieldsValue, validateFields } = props.form;
    
    const [thisMap, setMap] = useState(new Map());
    const [thisFiles, setFile] = useState([]);
    const [thisType, setType] = useState(0);

    /* 【Part 1】 ↓ */
    const onErrorClick = (key) => () => {
        if (thisMap.size) {
            Toast.info(thisMap.get(key));
        }
    }
    const toCheckValidityOfValue = (key) => (reg) => (tip) => (value) => {
        if (!reg) return;
        if (reg.test(value)) {
            thisMap.delete(key);
        } else {
            thisMap.set(key, tip);
        }
        setMap(new Map(thisMap));
    }
    const toPublish = () => {
        validateFields((error, values) => {
            global.TNT(values);
            if (!!thisMap.size || !thisFiles.length || error) return Toast.fail('请按正确的格式填写表单！');;
            let k_v = {};


            Object.keys(values).forEach(key => k_v[key.toLocaleLowerCase()] = values[key])
            console.log(k_v);
            console.log(thisFiles);
        })
    }
    /* 【Part 1】 ↑ */

    /* 【Part 2】 ↓ */
    const toCreateProps = (name) => (type) => (placeholder) => (reg, tip) => (extra) => ({
        type: type,
        placeholder: placeholder,
        error: thisMap.has(name),
        onErrorClick: onErrorClick(name),
        onBlur: toCheckValidityOfValue(name)(reg)(tip),
        extra: extra
    })
    const toCreatePickerProps = (name) => (data) => ({
        data: data,
        cascade: data && !!data[0].children,
        onOk: (val) => setFieldsValue({ [name]: val })
    })
    const FIELD_1 = '标题';
    const FIELD_2 = '行业类型';
    const FIELD_3 = '投资金额';
    const FIELD_4 = '资金类型';
    const FIELD_5 = '所在地区';
    const FIELD_6 = '投资地区';
    const FIELD_7 = '投资方式';
    const FIELD_8 = '参股类型';
    const FIELD_9 = '投资阶段';
    const FIELD_10 = '投资期限';
    const FIELD_11 = '投资类型';
    const FIELD_12 = '占股比例';
    const FIELD_13 = '最低回报要求';
    const FIELD_14 = '风控要求';

    const FIELD_15 = '抵质押物类型';
    const FIELD_16 = '抵质押物折扣率';
    const FIELD_17 = '前期费用';
    const FIELD_18 = '可提供资料';
    const FIELD_19 = '项目优势';

    const FIELD_1_PROPS = toCreateProps(FIELD_1)("text")("请填写标题")(/\S/ig, "请不要留空！")();

    const FIELD_3_PROPS = toCreateProps(FIELD_3)("digit")("请填写投资金额")(/\S/ig, "请不要留空！")("万元");

    const FIELD_5_PROPS = toCreatePickerProps(FIELD_5)(seasons);

    const FIELD_8_PROPS = toCreatePickerProps(FIELD_8)(seasons);

    const FIELD_10_PROPS = toCreateProps(FIELD_10)("digit")("请输入年限")(/\S/ig, "请不要留空！")("年");

    const FIELD_12_PROPS = toCreatePickerProps(FIELD_12)(seasons);
    const FIELD_13_PROPS = toCreateProps(FIELD_13)("text")("请输入最低回报要求")(/\S/ig, "请不要留空！")();
    const FIELD_14_PROPS = toCreatePickerProps(FIELD_12)(seasons);

    const FIELD_15_PROPS = toCreatePickerProps(FIELD_12)(seasons);
    const FIELD_16_PROPS = toCreateProps(FIELD_16)("digit")("请输入折扣率")(/\S/ig, "请不要留空！")("折");
    
    const FIELD_17_PROPS = toCreatePickerProps(FIELD_17)(seasons);
    const FIELD_19_PROPS = toCreateProps(FIELD_19)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    /* 【Part 2】 ↑ */

    global.TNT(thisMap, thisFiles, thisType);

    return (
        <div className="hdz-publish-project">
            <List>
                <TextareaItem
                    {...getFieldProps(FIELD_1)}
                    {...FIELD_1_PROPS}
                    title="标题"
                    labelNumber={3}
                    autoHeight
                />
                <p className="title-remind">参考格式：寻+（省级）投资地区+（行业）项目+合作方式+（市级）资金所在地+资金主体+金额</p>

                <TagsView {...getFieldProps(FIELD_2)} className="tags-view" title="行业类型" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />
                <InputItem {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} >投资金额</InputItem>
                <TagsView {...getFieldProps(FIELD_4)} className="tags-view" title="资金类型" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />
                <Picker {...getFieldProps(FIELD_5)} {...FIELD_5_PROPS} >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                </Picker>
                <TagsView {...getFieldProps(FIELD_6)} className="tags-view" title="投资地区" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />

               <List.Item className="none-input-item">
                    <label>投资方式</label>
                    <Radio.Group {...getFieldProps(FIELD_7, { initialValue: 0, onChange: (e) => setType(e.target.value) })} >
                        <Radio value={0} >股权投资</Radio>
                        <Radio value={1} >债权投资</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType*1 === 0 ? (
                    <Fragment>
                        <Picker {...getFieldProps(FIELD_8)} {...FIELD_8_PROPS} >
                            <List.Item arrow="horizontal">参股类型</List.Item>
                        </Picker>
                        <TagsView {...getFieldProps(FIELD_9)} className="tags-view" title="投资阶段" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />
                        <InputItem {...getFieldProps(FIELD_10)} {...FIELD_10_PROPS} >投资期限</InputItem>
                        <TagsView {...getFieldProps(FIELD_11)} className="tags-view" title="投资类型" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />
                        <Picker {...getFieldProps(FIELD_12)} {...FIELD_12_PROPS} >
                            <List.Item arrow="horizontal">占股比例</List.Item>
                        </Picker>
                    </Fragment>
                ) : (
                    <Fragment>
                        <TextareaItem
                            {...getFieldProps(FIELD_13)}
                            {...FIELD_13_PROPS}
                            title="最低回报要求"
                            labelNumber={7}
                            autoHeight
                        />
                        <Picker {...getFieldProps(FIELD_14)} {...FIELD_14_PROPS} >
                            <List.Item arrow="horizontal">风控要求</List.Item>
                        </Picker>
                        <Picker {...getFieldProps(FIELD_15)} {...FIELD_15_PROPS} >
                            <List.Item arrow="horizontal">抵质押物类型</List.Item>
                        </Picker>
                        <InputItem {...getFieldProps(FIELD_16)} {...FIELD_16_PROPS} labelNumber={7} >抵质押物折扣率</InputItem>
                    </Fragment>
                )}

                <Picker {...getFieldProps(FIELD_17)} {...FIELD_17_PROPS} >
                    <List.Item arrow="horizontal">前期费用</List.Item>
                </Picker>
                <TagsView {...getFieldProps(FIELD_18)} className="tags-view" title="可提供资料" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />

                <List.Item className="none-input-item">
                    <label>项目优势</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_19)}
                        {...FIELD_19_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

            </List>

            <div className="publish-button" onClick={toPublish}>立即发布</div>
        </div>
    )
}



export default createForm()(PublishFunds);
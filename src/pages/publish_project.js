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

const PublishProject = (props) => {

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
    const FIELD_1 = 'TITLE';
    const FIELD_2 = 'PRICE';
    const FIELD_3 = 'INDUSTRY';
    const FIELD_4 = 'AREA';
    const FIELD_5 = 'FINANCING';
    const FIELD_6 = 'STAGE';
    const FIELD_7 = 'PROPORTION';
    const FIELD_8 = 'EXIT';
    const FIELD_9 = 'EXIT_WAY';
    const FIELD_10 = 'RISK_CONTROL';
    const FIELD_11 = 'BEAR_INTEREST';
    const FIELD_12 = 'CAPITAL_OCCUPATION';
    const FIELD_13 = 'BACK_ORIGINAL';
    const FIELD_14 = 'FINANCING_USE';

    const FIELD_15 = 'PROJECT_DEV';
    const FIELD_16 = 'PROJECT_INTRO';
    const FIELD_17 = 'PROVIDE_INFO';
    const FIELD_18 = 'TEAM_INTRO';
    const FIELD_19 = 'PROJECT_BENEFITS';

    const FIELD_1_PROPS = toCreateProps(FIELD_1)("text")("请填写标题")(/\S/ig, "请不要留空！")();
    const FIELD_2_PROPS = toCreateProps(FIELD_2)("digit")("请输入金额")(/\S/ig, "请不要留空！")("万元");
    const FIELD_3_PROPS = toCreatePickerProps(FIELD_3)(seasons);
    const FIELD_4_PROPS = toCreatePickerProps(FIELD_4)(seasons);

    const FIELD_6_PROPS = toCreatePickerProps(FIELD_6)(seasons);
    const FIELD_7_PROPS = toCreatePickerProps(FIELD_7)(seasons);
    const FIELD_8_PROPS = toCreatePickerProps(FIELD_8)(seasons);

    const FIELD_10_PROPS = toCreatePickerProps(FIELD_10)(seasons);
    const FIELD_11_PROPS = toCreatePickerProps(FIELD_11)(seasons);
    const FIELD_12_PROPS = toCreatePickerProps(FIELD_12)(seasons);
    const FIELD_13_PROPS = toCreateProps(FIELD_13)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    const FIELD_14_PROPS = toCreateProps(FIELD_14)("text")("请详细介绍")(/\S/ig, "请不要留空！")();

    const FIELD_15_PROPS = toCreateProps(FIELD_15)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    const FIELD_16_PROPS = toCreateProps(FIELD_16)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    
    const FIELD_18_PROPS = toCreateProps(FIELD_18)("text")("请详细介绍（非必填项）")()();
    const FIELD_19_PROPS = toCreateProps(FIELD_19)("text")("请详细介绍（非必填项）")()();
    /* 【Part 2】 ↑ */

    /* 【Part 3】 ↓ */
    const onFileChange = (files, type, index) => {
        if (files.length < thisFiles.length) {
            Modal.alert('移除图片', "是否确认要移除此张图片？", [
                { text: '取消', onPress: () => global.TNT('用户已取消！') },
                { text: '确认', onPress: () => setFile(files) },
            ])
        } else {
            if (files.length && files[0].file.size > 1024 * 1024 * 2) {
                Toast.fail(`当前图片大小【${(files[0].file.size / 1024 / 1024).toString().slice(0,5)}MB】，请上传小于【2M】的图片！`);
            } else {
                setFile(files);
            }
        }
    };
    /* 【Part 3】 ↑ */

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
                <p className="title-remind">参考格式：地区+某行业项目+融资方式+金额（附单位）</p>
                <div className="avatar-upload">
                    <p>点击上传项目封面图</p>
                    <ImagePicker
                        className="publish-image-picker"
                        length={1}
                        files={thisFiles}
                        onChange={onFileChange}
                        onFail={msg => Toast.fail(msg)}
                        selectable={!thisFiles.length}
                    />
                    <p>图片大小不超过2M</p>
                </div>
                <InputItem {...getFieldProps(FIELD_2)} {...FIELD_2_PROPS} >融资金额</InputItem>

                <Picker {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} >
                    <List.Item arrow="horizontal">所属行业</List.Item>
                </Picker>

                <Picker {...getFieldProps(FIELD_4)} {...FIELD_4_PROPS} >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                </Picker>

                <List.Item className="none-input-item">
                    <label>融资方式</label>
                    <Radio.Group {...getFieldProps(FIELD_5, { initialValue: 0, onChange: (e) => setType(e.target.value) })} >
                        <Radio value={0} >股权融资</Radio>
                        <Radio value={1} >债权融资</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType*1 === 0 ? (
                    <Fragment>
                        <Picker {...getFieldProps(FIELD_6)} {...FIELD_6_PROPS} >
                            <List.Item arrow="horizontal">所处阶段</List.Item>
                        </Picker>
                        <Picker {...getFieldProps(FIELD_7)} {...FIELD_7_PROPS} >
                            <List.Item arrow="horizontal">占股比例</List.Item>
                        </Picker>
                        <Picker {...getFieldProps(FIELD_8)} {...FIELD_8_PROPS} >
                            <List.Item arrow="horizontal">最短退出年限</List.Item>
                        </Picker>
                        <TagsView {...getFieldProps(FIELD_9)} className="tags-view" title="退出方式" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />
                    </Fragment>
                ) : (
                    <Fragment>
                        <Picker {...getFieldProps(FIELD_10)} {...FIELD_10_PROPS} >
                            <List.Item arrow="horizontal">风控要求</List.Item>
                        </Picker>
                        <Picker {...getFieldProps(FIELD_11)} {...FIELD_11_PROPS} >
                            <List.Item arrow="horizontal">承担利息</List.Item>
                        </Picker>
                        <Picker {...getFieldProps(FIELD_12)} {...FIELD_12_PROPS} >
                            <List.Item arrow="horizontal">资金占用时长</List.Item>
                        </Picker>
                        <InputItem {...getFieldProps(FIELD_13)} {...FIELD_13_PROPS} >还款来源</InputItem>
                    </Fragment>
                )}

                <List.Item className="none-input-item">
                    <label>融资用途</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_14)}
                        {...FIELD_14_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

                <List.Item className="none-input-item">
                    <label>项目发展</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_15)}
                        {...FIELD_15_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

                <List.Item className="none-input-item">
                    <label>项目介绍</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_16)}
                        {...FIELD_16_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

                <TagsView {...getFieldProps(FIELD_17)} className="tags-view" title="可提供资料" data={['首次公开发行', '买壳或借壳上市', '二次出售', '管理层回购', '破产清算']} />


                <List.Item className="none-input-item">
                    <label>团队介绍</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_18)}
                        {...FIELD_18_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

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



export default createForm()(PublishProject);
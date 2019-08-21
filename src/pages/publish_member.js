import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { List, InputItem, TextareaItem, Toast, Modal, ImagePicker, Picker } from 'antd-mobile';
import { Radio } from 'antd';
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

    const FIELD_1 = '会员身份';
    const FIELD_2 = '企业全称';
    const FIELD_3 = '统一社会信用代码';

    const FIELD_4 = '姓名';
    const FIELD_5 = '身份证号';

    const FIELD_6 = '所在地区';
    const FIELD_7 = '联系人姓名';
    const FIELD_8 = '联系电话';

    const FIELD_2_PROPS = toCreateProps(FIELD_2)("text")("请填写服务商名称")(/\S/ig, "请不要留空！")();
    const FIELD_3_PROPS = toCreateProps(FIELD_3)("text")("请填写服务商简称")(/\S/ig, "请不要留空！")();

    const FIELD_4_PROPS = toCreateProps(FIELD_4)("text")("请填写姓名")(/\S/ig, "请不要留空！")();
    const FIELD_5_PROPS = toCreateProps(FIELD_5)("text")("请填写身份证号")(/\S/ig, "请不要留空！")();

    const FIELD_6_PROPS = toCreatePickerProps(FIELD_6)(seasons);
    const FIELD_7_PROPS = toCreateProps(FIELD_7)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    const FIELD_8_PROPS = toCreateProps(FIELD_8)("text")("请详细介绍")(/\S/ig, "请不要留空！")();

    /* 【Part 2】 ↑ */

    /* 【Part 3】 ↓ */
    const onFileChange = (files, type, index) => {
        console.log(files);
        
        if (files.length < thisFiles.length) {
            Modal.alert('移除图片', "是否确认要移除此张图片？", [
                { text: '取消', onPress: () => global.TNT('用户已取消！') },
                { text: '确认', onPress: () => setFile(files) },
            ])
        } else {
            if (files.length && files[0].file.size > 1024 * 1024 * 2) {
                Toast.fail(`当前图片大小【${(files[0].file.size / 1024 / 1024).toString().slice(0, 5)}MB】，请上传小于【2M】的图片！`);
            } else {
                setFile(files);
                
                sessionStorage.set(`file_${type}`, new Buffer())
            }
        }
    };
    /* 【Part 3】 ↑ */

    useEffect(() => {
        setFile([]);
    }, [thisType])

    global.TNT(thisMap, thisFiles, thisType);

    return (
        <div className="hdz-publish-project">
            <List>

                <List.Item className="none-input-item">
                    <label>会员身份</label>
                    <Radio.Group {...getFieldProps(FIELD_1, { initialValue: 0, onChange: (e) => setType(e.target.value) })} >
                        <Radio value={0} >企业</Radio>
                        <Radio value={1} >个人</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType * 1 === 0 ? (
                    <Fragment>
                        <InputItem {...getFieldProps(FIELD_2)} {...FIELD_2_PROPS} labelNumber={5}>企业全称</InputItem>
                        <InputItem {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} labelNumber={8}>统一社会信用代码</InputItem>

                        <div className="avatar-upload">
                            <p>点击上传服务商图标</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={1}
                                files={thisFiles}
                                onChange={onFileChange}
                                onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                                selectable={!thisFiles.length}
                            />
                            <p>图片大小不超过2M</p>
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <InputItem {...getFieldProps(FIELD_4)} {...FIELD_4_PROPS} labelNumber={3}>姓名</InputItem>
                        <InputItem {...getFieldProps(FIELD_5)} {...FIELD_5_PROPS} labelNumber={5}>身份证号</InputItem>

                        <div className="avatar-upload">
                            <p>点击上传身份证正反面</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={2}
                                files={thisFiles}
                                onChange={onFileChange}
                                onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                                // onImageClick={(index, img) => console.log(img)}
                                selectable={thisFiles.length < 2}
                            />
                            <p>图片大小不超过2M</p>
                        </div>
                    </Fragment>
                )}

                <Picker {...getFieldProps(FIELD_6)} {...FIELD_6_PROPS} >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                </Picker>
                <InputItem {...getFieldProps(FIELD_7)} {...FIELD_7_PROPS} labelNumber={6}>联系人姓名</InputItem>
                <InputItem {...getFieldProps(FIELD_8)} {...FIELD_8_PROPS} labelNumber={5}>联系电话</InputItem>

            </List>
            <div className="publish-button" onClick={toPublish}>立即提交</div>
        </div>
    )
}



export default createForm()(PublishProject);
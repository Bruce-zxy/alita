import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { List, InputItem, TextareaItem, Toast, Modal, ImagePicker, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';

import TagsView from '../components/TagsView';
import { LOCAL_URL } from '../config/common';

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

    const FIELD_1 = '名称';
    const FIELD_2 = '简称';
    const FIELD_3 = '分类';
    const FIELD_4 = '机构简介';

    const FIELD_1_PROPS = toCreateProps(FIELD_1)("text")("请填写服务商名称")(/\S/ig, "请不要留空！")();
    const FIELD_2_PROPS = toCreateProps(FIELD_2)("text")("请填写服务商简称")(/\S/ig, "请不要留空！")();
    const FIELD_3_PROPS = toCreatePickerProps(FIELD_3)(seasons);
    const FIELD_4_PROPS = toCreateProps(FIELD_4)("text")("请详细介绍")(/\S/ig, "请不要留空！")();

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

    global.TNT(thisMap, thisFiles);

    return (
        <div className="hdz-publish-project">
            <List>
            
                <InputItem {...getFieldProps(FIELD_1)} {...FIELD_1_PROPS} labelNumber={3}>名称</InputItem>
                <InputItem {...getFieldProps(FIELD_2)} {...FIELD_2_PROPS} labelNumber={3}>简称</InputItem>
                <Picker {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} >
                    <List.Item arrow="horizontal">分类</List.Item>
                </Picker>
                <div className="avatar-upload">
                    <p>点击上传服务商图标</p>
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
                <List.Item className="none-input-item">
                    <label>机构简介</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_4)}
                        {...FIELD_4_PROPS}
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
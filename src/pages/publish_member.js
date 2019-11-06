import React, { Fragment, useState, useEffect, useRef } from 'react';
import { List, InputItem, TextareaItem, Toast, Modal, ImagePicker, Picker, Button } from 'antd-mobile';
import { Radio } from 'antd';
import { createForm } from 'rc-form';
// import AvatarEditor from 'react-avatar-editor';
import { withApollo } from 'react-apollo';

import { LOCAL_URL, API_ROOT } from '../config/common';
import { M_LEVEL_UP } from '../gql';
import { buildingQuery, toTransformAreaTreeProps, toGetLevel, dataURLtoBlob, Upload, toFetchCurrentUser, toGetParentArrayByChildNode } from '../utils/global';

import 'antd/es/radio/style/css';
import "../style/publish.scss";

const PublishProject = withApollo((props) => {

    const { form: { getFieldProps, getFieldsValue, setFieldsValue, validateFields }, client, history } = props;

    let area = [];
    let area_origin = [];
    let metadata = [];
    let provider_category = [];
    let provider_metadata = [];
    let user = null;
    
    try {
        user = JSON.parse(localStorage.getItem('u_user'));

        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        area_origin = metadata[metadata.findIndex(data => data.title === '地区')].children.sort((a, b) => a.title === '江西省' ? -1 : 1);
        area = toTransformAreaTreeProps(area_origin, { key: 'title', value: 'id', children: 'children' });

        provider_metadata = JSON.parse(sessionStorage.getItem('provider_metadata'));
        provider_category = toTransformAreaTreeProps(provider_metadata, { key: 'title', value: 'id', children: 'children' });
    } catch (error) {
        console.error(error.message);
    }

    // const [thisImage, toCropImage] = useState(null);
    const [thisModal, setModal] = useState({});
    const [thisMap, setMap] = useState(new Map());
    const [thisAFiles, setAFile] = useState([]);
    const [thisBFiles, setBFile] = useState([]);
    const [thisPVDFiles, setPVDFile] = useState([]);
    const [thisType, setType] = useState(user.type);
    const [thisUserType, setUserType] = useState(user.identity);
    const disabled = user.status*1 === 1;
    
    // const cropedImage = useRef(null);

    useEffect(() => {
        if (thisUserType !== "provider") setPVDFile([]);
        setMap(new Map());
    }, [thisUserType]);

    useEffect(() => {
        if (thisType === "enterprise") {
            setAFile([]);
            setBFile([]);
        }
        setMap(new Map());
    }, [thisType]);
    useEffect(() => {
        if (user) {
            let k_v = {};
            let provider = user.providers ? user.providers[0] : {};

            if (user.realname) k_v.realname = user.realname;
            if (user.phone) k_v.phone = user.phone;
            if (user.area) {
                k_v.area = toGetParentArrayByChildNode(area_origin, { id: user.area.id }).map(item => item.id);
            }
            if (user.company) k_v.company = user.company;
            if (user.org_code) k_v.org_code = user.org_code;
            if (user.idcard) k_v.idcard = user.idcard;
            if (user.identity) k_v.identity = user.identity;
            if (user.type) k_v.type = user.type;

            if (provider) {
                if (provider.name) k_v.name = provider.name;
                if (provider.slogan) k_v.slogan = provider.slogan;
                if (provider.category) k_v.category = [provider.category.id];
                if (provider.introduction) k_v.introduction = provider.introduction;
            }

            if (user.type === "enterprise" && user.business_license) {
                setAFile([{ url: user.business_license }]);
            } else if (user.type === "personal" && user.idcardA) {
                setAFile([{ url: user.idcardA }]);
            }
            if (user.type === "personal" && user.idcardB) {
                setBFile([{ url: user.idcardB }]);
            }
            if (user.identity === "provider") {
                setPVDFile([{ url: provider.logo }]);
            }
            setFieldsValue(k_v);
        }
    }, [])
    

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
        validateFields(async (error, values) => {
            global.TNT(values);
            let k_v = {};
            let data = {};
            let user_constructor = { id: user.id };
            let provider_constructor = {};
            Object.keys(values).forEach(key => k_v[key.toLocaleLowerCase()] = values[key] ? values[key] : '');
            if (!!thisMap.size || error) return Toast.fail('请按正确的格式填写表单！');

            if (!k_v.realname.trim() || !k_v.realname.split('').filter(item => item.match(/[\u4e00-\u9fa5]/g)).length) {
                return Toast.fail('请正确输入真实中文姓名！');
            } else {
                user_constructor.realname = k_v.realname;
            }
            if (!k_v.phone) {
                return Toast.fail('请输入手机号！')
            } else {
                user_constructor.phone = k_v.phone;
            };
            if (!k_v.area || !k_v.area.length) {
                return Toast.fail('请选择地区！')
            } else {
                user_constructor.area = { id: k_v.area[k_v.area.length - 1] };
            }

            user_constructor.type = k_v.type;
            if (k_v.type === 'enterprise') {
                if (!k_v.company.trim()) {
                    return Toast.fail('请填写企业全称！')
                } else {
                    user_constructor.company = k_v.company;
                };;
                if (!k_v.org_code.trim()) {
                    return Toast.fail('请填写统一社会信用代码！')
                } else {
                    user_constructor.org_code = k_v.org_code;
                };;
                if (!thisAFiles.length) {
                    return Toast.fail('请上传企业营业执照！')
                } else {
                    user_constructor.business_license = thisAFiles[0].url;
                };
            } else {
                if (!k_v.idcard || (k_v.idcard.length !== 15 && k_v.idcard.length !== 18)) {
                    return Toast.fail('请填写正确的身份证号！')
                } else {
                    user_constructor.idcard = k_v.idcard;
                };
                if (!thisAFiles.length || !thisBFiles.length) {
                    return Toast.fail('请上传身份证正反面照片！')
                } else {
                    user_constructor.idcardA = thisAFiles[0].url;
                    user_constructor.idcardB = thisBFiles[0].url;
                };
            }
            
            if (k_v.identity === 'user') return Toast.fail('请选择正确的会员属性！');
            user_constructor.identity = k_v.identity;
            if (k_v.identity === "provider") {
                
                if (!k_v.name.trim()) {
                    return Toast.fail('请填写服务商全称！')
                } else {
                    provider_constructor.name = k_v.name;
                };
                // if (!k_v.slogan.trim()) {
                //     return Toast.fail('请填写服务商简称！')
                // } else {
                //     provider_constructor.slogan = k_v.slogan;
                // };
                if (!k_v.category.length) {
                    return Toast.fail('请选择服务商分类！')
                } else {
                    provider_constructor.category = { id: k_v.category[k_v.category.length - 1] };
                };
                if (!k_v.introduction.trim()) {
                    return Toast.fail('请填写服务商简介！')
                } else {
                    provider_constructor.introduction = k_v.introduction;
                };
                if (!thisPVDFiles.length) {
                    return Toast.fail('请上传服务商图标！')
                } else {
                    provider_constructor.logo = thisPVDFiles[0] && thisPVDFiles[0].url;
                };
                data.provider = provider_constructor;
            }

            data.user = user_constructor;

            const res = await client.mutate({
                mutation: M_LEVEL_UP,
                variables: { data }
            });

            if (res.data && res.data.levelUp) {
                Toast.success('升级申请成功！请等待管理员审核！');
                await toFetchCurrentUser(client);
                history.push(LOCAL_URL['MINE']);
            } else {
                Toast.fail('升级申请失败！');
            }

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
        cascade: data && data[0] && data[0].children,
        cols: toGetLevel(data),
        onOk: (val) => setFieldsValue({ [name]: val })
    })

    const FIELD_1 = 'type';
    const FIELD_2 = 'company';
    const FIELD_3 = 'org_code';
    
    // const FIELD_4 = 'realname';
    const FIELD_5 = 'idcard';
    
    const FIELD_6 = 'area';
    const FIELD_7 = 'realname';
    const FIELD_8 = 'phone';
    const FIELD_9 = 'identity';

    const FIELD_1_PVD = 'name';
    // const FIELD_2_PVD = 'slogan';
    const FIELD_3_PVD = 'category';
    const FIELD_4_PVD = 'introduction';

    const FIELD_2_PROPS = toCreateProps(FIELD_2)("text")("请填写企业全称")(/\S/ig, "请不要留空！")();
    const FIELD_3_PROPS = toCreateProps(FIELD_3)("text")("请填写统一社会信用代码")(/\S/ig, "请不要留空！")();

    // const FIELD_4_PROPS = toCreateProps(FIELD_4)("text")("请填写姓名")(/\S/ig, "请不要留空！")();
    const FIELD_5_PROPS = toCreateProps(FIELD_5)("text")("请填写身份证号")(/\S/ig, "请不要留空！")();

    const FIELD_6_PROPS = toCreatePickerProps(FIELD_6)(area);
    const FIELD_7_PROPS = toCreateProps(FIELD_7)("text")("请填写真实姓名")(/\S/ig, "请不要留空！")();
    const FIELD_8_PROPS = toCreateProps(FIELD_8)("number")("请填写联系电话")(/\S/ig, "请不要留空！")();

    const FIELD_1_PVD_PROPS = toCreateProps(FIELD_1_PVD)("text")("请填写服务商名称")(/\S/ig, "请不要留空！")();
    // const FIELD_2_PVD_PROPS = toCreateProps(FIELD_2_PVD)("text")("请填写服务商简称")(/\S/ig, "请不要留空！")();
    const FIELD_3_PVD_PROPS = toCreatePickerProps(FIELD_3_PVD)(provider_category);
    const FIELD_4_PVD_PROPS = toCreateProps(FIELD_4_PVD)("text")("请详细介绍")(/\S/ig, "请不要留空！")();

    /* 【Part 2】 ↑ */

    /* 【Part 3】 ↓ */
    // const toUploadImage = (cropedImage) => async (e) => {
    //     const formData = new FormData();
    //     const { current } = cropedImage;
    //     const fakeFile = dataURLtoBlob(current.getImageScaledToCanvas().toDataURL("image/jpeg"));
    //     fakeFile.name = thisImage.file.name;
    //     fakeFile.lastModifiedDate = new Date();
    //     formData.append('file', fakeFile);
    //     formData.append('fileName', thisImage.file.name);
    //     try {
    //         const { relativePath } = await Upload(`${API_ROOT}/storage`, formData).then(res => res.json());


    //         toCropImage(null);
    //     } catch (error) {
    //         console.error(error.message);
    //         Toast.fail('上传图片失败！');
    //     }  
    // }
    const onFileChange = (thisFiles, setFile) => async (files, type, index) => {
        if (files.length < thisFiles.length) {
            Modal.alert('移除图片', "是否确认要移除此张图片？", [
                { text: '取消', onPress: () => global.TNT('用户已取消！') },
                { text: '确认', onPress: () => setFile(files) },
            ])
        } else {
            if (files.length && files[0].file.size > 1024 * 1024 * 5) {
                Toast.fail(`当前图片大小【${(files[0].file.size / 1024 / 1024).toString().slice(0, 5)}MB】，请上传小于【10M】的图片！`);
            } else {
                const currentFile = files[files.length - 1];
                const formData = new FormData();
                formData.append('file', currentFile.file);
                const { relativePath } = await Upload(`${API_ROOT}/storage`, formData).then(res => res.json());
                if (relativePath) {
                    Toast.success('上传成功！');
                    files[files.length - 1].url = relativePath;
                    setFile(files);
                } else {
                    Toast.fail('上传失败！');
                }
                // toCropImage(files[files.length - 1])
            }
        }
    };
    /* 【Part 3】 ↑ */

    global.TNT(thisMap, thisAFiles, thisBFiles, thisPVDFiles);

    return (
        <div className="hdz-publish-project">
            <List>

                <InputItem disabled={disabled} {...getFieldProps(FIELD_7)} {...FIELD_7_PROPS} labelNumber={5}>真实姓名</InputItem>
                <InputItem disabled={disabled} {...getFieldProps(FIELD_8)} {...FIELD_8_PROPS} labelNumber={5}>联系电话</InputItem>

                <Picker disabled={disabled} {...getFieldProps(FIELD_6)} {...FIELD_6_PROPS} >
                    <List.Item disabled={disabled} arrow="horizontal">所在地区</List.Item>
                </Picker>

                <List.Item disabled={disabled} className="none-input-item" >
                    <label>会员身份</label>
                    <Radio.Group disabled={disabled} {...getFieldProps(FIELD_1, { initialValue: "enterprise", onChange: (e) => setType(e.target.value) })} >
                        <Radio value="enterprise" >企业</Radio>
                        <Radio value="personal" >个人</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType === "enterprise" ? (
                    <Fragment>
                        <InputItem disabled={disabled} {...getFieldProps(FIELD_2)} {...FIELD_2_PROPS} labelNumber={5}>企业全称</InputItem>
                        <InputItem disabled={disabled} {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} labelNumber={8}>统一社会信用代码</InputItem>

                        <div className="avatar-upload">
                            <p>点击{disabled ? '查看' : '上传'}企业营业执照</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={1}
                                files={thisAFiles}
                                onChange={onFileChange(thisAFiles, setAFile)}
                                onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                                onImageClick={(index, img) => setModal({ show: true, url: img[index].url })}
                                selectable={!disabled && !thisAFiles.length}
                                disableDelete={disabled}
                            />
                            <p>图片大小不超过5M</p>
                        </div>

                    </Fragment>
                ) : (
                    <Fragment>
                        <InputItem disabled={disabled} {...getFieldProps(FIELD_5)} {...FIELD_5_PROPS} labelNumber={5}>身份证号</InputItem>

                        <div className="avatar-upload">
                            <p>点击{disabled ? '查看' : '上传'}身份证正面</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={1}
                                files={thisAFiles}
                                onChange={onFileChange(thisAFiles, setAFile)}
                                onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                                onImageClick={(index, img) => setModal({ show: true, url: img[index].url })}
                                selectable={!disabled && thisAFiles.length < 1}
                                disableDelete={disabled}
                            />
                            <p>图片大小不超过5M</p>
                        </div>

                        <div className="avatar-upload">
                            <p>点击{disabled ? '查看' : '上传'}身份证反面</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={1}
                                files={thisBFiles}
                                onChange={onFileChange(thisBFiles, setBFile)}
                                onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                                onImageClick={(index, img) => setModal({ show: true, url: img[index].url })}
                                selectable={!disabled && thisBFiles.length < 1}
                                disableDelete={disabled}
                            />
                            <p>图片大小不超过5M</p>
                        </div>

                    </Fragment>
                )}

                <List.Item disabled={disabled} className="none-input-item" multipleLine>
                    <label>会员属性</label>
                    <Radio.Group disabled={disabled} {...getFieldProps(FIELD_9, { initialValue: "financer", onChange: (e) => setUserType(e.target.value) })} style={{ width: "calc(100% - 85px)", display: "inline-flex", flexWrap: "wrap" }} >
                        <Radio value="financer" style={{ marginBottom: "3.2vw" }}>项目方</Radio>
                        <Radio value="investor" style={{ marginBottom: "3.2vw" }}>资金方</Radio>
                        <Radio value="provider" >服务商</Radio>
                        <Radio value="user" disabled>普通用户</Radio>
                    </Radio.Group>
                </List.Item>

                {thisUserType === "provider" ? (
                    <Fragment>
                        <InputItem disabled={disabled} {...getFieldProps(FIELD_1_PVD)} {...FIELD_1_PVD_PROPS} labelNumber={3}>名称</InputItem>
                        {/* <InputItem disabled={disabled} {...getFieldProps(FIELD_2_PVD)} {...FIELD_2_PVD_PROPS} labelNumber={3}>简称</InputItem> */}
                        <Picker disabled={disabled} {...getFieldProps(FIELD_3_PVD)} {...FIELD_3_PVD_PROPS} >
                            <List.Item disabled={disabled} arrow="horizontal">分类</List.Item>
                        </Picker>
                        <div className="avatar-upload">
                            <p>点击{disabled ? '查看' : '上传'}服务商图标</p>
                            <ImagePicker
                                className="publish-image-picker"
                                length={1}
                                files={thisPVDFiles}
                                onChange={onFileChange(thisPVDFiles, setPVDFile)}
                                onFail={msg => Toast.fail(msg)}
                                onImageClick={(index, img) => setModal({ show: true, url: img[index].url })}
                                selectable={!disabled && !thisPVDFiles.length}
                                disableDelete={disabled}
                            />
                            <p>图片大小不超过5M</p>
                        </div>
                        <List.Item disabled={disabled} className="none-input-item">
                            <label>机构简介</label>
                            <TextareaItem
                                {...getFieldProps(FIELD_4_PVD)}
                                {...FIELD_4_PVD_PROPS}
                                rows={5}
                                autoHeight
                                disabled={disabled}
                            />
                        </List.Item>
                    </Fragment>
                ) : ''}

            </List>
            {!disabled && <div className="publish-button" onClick={toPublish}>立即提交</div>}
            <div className="hdz-block-large-space" style={{ background: "#FFF" }}></div>
            <div className="hdz-block-large-space" style={{ background: "#FFF" }}></div>
            {/* <Modal
                visible={thisImage && thisImage.url}
                maskClosable={false}
                transparent
            >
                <AvatarEditor 
                    ref={cropedImage}
                    image={thisImage && thisImage.url}
                    border={5}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1.2}
                    rotate={0}
                />
                <Button onClick={toUploadImage(cropedImage)}>确认上传</Button>
            </Modal> */}
            <Modal
                className="publish-image-modal"
                visible={thisModal.show}
                onClose={() => setModal({ show: false, url: thisModal.url })}
                closable
            >
                <img style={{ width: "100%" }} src={thisModal.url} alt='placeholder' />
            </Modal>
        </div>
    )
})



export default createForm()(PublishProject);
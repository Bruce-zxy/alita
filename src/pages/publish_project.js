import React, { Fragment, useRef, useState, useEffect } from 'react';
import { List, InputItem, TextareaItem, Toast, Modal, ImagePicker, Picker, Button } from 'antd-mobile';
import { Radio } from 'antd';
import { createForm } from 'rc-form';
import AvatarEditor from 'react-avatar-editor';
import { withApollo } from 'react-apollo';

import TagsView from '../components/TagsView';
import { M_PUBLISH_PROJECT, Q_GET_PROJECT, M_UPDATE_PROJECT } from '../gql';
import { LOCAL_URL, API_ROOT } from '../config/common';
import { buildingQuery, toTransformAreaTreeProps, toGetLevel, dataURLtoBlob, Upload, toFetchCurrentUser, toGetParentArrayByChildNode } from '../utils/global';

import 'antd/es/radio/style/css';
import "../style/publish.scss";

const defaultVariables = {
    join: [
        { field: 'creator' },
        { field: 'exit_mode' },
        { field: 'industry' },
        { field: 'ratio' },
        { field: 'stage' },
        { field: 'withdrawal_year' },
        { field: 'data' },
        { field: 'area' },
        { field: 'risk' },
        { field: 'interest' },
        { field: 'occupancy_time' },
    ]
};

const PublishProject = withApollo((props) => {

    const { form: { getFieldProps, getFieldsValue, setFieldsValue, validateFields }, client, history, location: { search } } = props;

    const [thisImage, toCropImage] = useState(null);
    const [thisModal, setModal] = useState({});
    const [thisMap, setMap] = useState(new Map());
    const [thisFiles, setFile] = useState([]);
    const [thisType, setType] = useState('equity');
    const cropedImage = useRef(null);
    
    let industry_set = [];
    let industry_origin_set = [];
    let area_set = [];
    let area_origin_set = [];
    let stage_set = [];
    let stage_origin_set = [];
    let ratio_set = [];
    let ratio_origin_set = [];
    let withdrawal_year_set = [];
    let withdrawal_year_origin_set = [];
    let risk_set = [];
    let risk_origin_set = [];
    let interest_set = [];
    let interest_origin_set = [];
    let occupancy_time_set = [];
    let occupancy_time_origin_set = [];
    let exit_mode_set = [];
    let exit_mode_origin_set = [];
    let data_set = [];
    let data_origin_set = [];
    
    let metadata = [];
    let user = {};
    let params = {};
    let params_str = search.split('?')[1] || '';
    params_str.split('&').forEach(param => {
        let [key, val] = param.split('=');
        params[key] = val;
    })
    
    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        user = JSON.parse(localStorage.getItem('u_user'));
        
        industry_origin_set = metadata[metadata.findIndex(data => data.title === '行业')].children;
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children;
        stage_origin_set = metadata[metadata.findIndex(data => data.title === '阶段')].children;
        ratio_origin_set = metadata[metadata.findIndex(data => data.title === '比例')].children;
        withdrawal_year_origin_set = metadata[metadata.findIndex(data => data.title === '年限')].children;
        risk_origin_set = metadata[metadata.findIndex(data => data.title === '风控')].children;
        interest_origin_set = metadata[metadata.findIndex(data => data.title === '利息')].children;
        occupancy_time_origin_set = metadata[metadata.findIndex(data => data.title === '时长')].children;
        
        exit_mode_origin_set = metadata[metadata.findIndex(data => data.title === '退出方式')].children;
        data_origin_set = metadata[metadata.findIndex(data => data.title === '可提供资料')].children;
        
        industry_set = toTransformAreaTreeProps(industry_origin_set, { key: 'title', value: 'id', children: 'children' });
        area_set = toTransformAreaTreeProps(area_origin_set, { key: 'title', value: 'id', children: 'children' });
        stage_set = toTransformAreaTreeProps(stage_origin_set, { key: 'title', value: 'id', children: 'children' });
        ratio_set = toTransformAreaTreeProps(ratio_origin_set, { key: 'title', value: 'id', children: 'children' });
        withdrawal_year_set = toTransformAreaTreeProps(withdrawal_year_origin_set, { key: 'title', value: 'id', children: 'children' });
        risk_set = toTransformAreaTreeProps(risk_origin_set, { key: 'title', value: 'id', children: 'children' });
        interest_set = toTransformAreaTreeProps(interest_origin_set, { key: 'title', value: 'id', children: 'children' });
        occupancy_time_set = toTransformAreaTreeProps(occupancy_time_origin_set, { key: 'title', value: 'id', children: 'children' });

        exit_mode_set = toTransformAreaTreeProps(exit_mode_origin_set, { key: 'title', value: 'id', children: 'children' });
        data_set = toTransformAreaTreeProps(data_origin_set, { key: 'title', value: 'id', children: 'children' });

    } catch (error) {
        console.error(error.message);
    }

    if (!user || !user.identity) {
        Toast.info('请先登录！');
        history.push(LOCAL_URL['SIGNIN']);
    }

    useEffect(() => {
        (async () => {
            if (params.id) {
                let projects = user.projects;
                let index = projects.findIndex((project => project.id === params.id));

                if (index !== -1) {
                    const { data } = await client.query({
                        query: Q_GET_PROJECT,
                        variables: { id: params.id, queryString: buildingQuery(defaultVariables) }
                    });
                    if (data) {
                        global.TNT(data.project);

                        let k_v = {};
                        let { project } = data;
                        if (project.title) k_v.title = project.title;
                        if (project.amount) k_v.amount = project.amount;
                        if (project.industry) k_v.industry = [project.industry.id];
                        if (project.area) {
                            k_v.area = toGetParentArrayByChildNode(area_origin_set, { id: project.area.id }).map(item => item.id);
                        }
                        if (project.stage) k_v.stage = [project.stage.id];
                        if (project.ratio) k_v.ratio = [project.ratio.id];
                        if (project.withdrawal_year) k_v.withdrawal_year = [project.withdrawal_year.id];
                        if (project.exit_mode) k_v.exit_mode = project.exit_mode.map(item => item.id);
                        if (project.risk) k_v.risk = [project.risk.id];
                        if (project.interest) k_v.interest = [project.interest.id];
                        if (project.occupancy_time) k_v.occupancy_time = [project.occupancy_time.id];
                        if (project.purposes) k_v.purposes = project.purposes;
                        if (project.progress) k_v.progress = project.progress;
                        if (project.info) k_v.info = project.info;
                        if (project.data) k_v.data = project.data.map(item => item.id);
                        if (project.team_info) k_v.team_info = project.team_info;
                        if (project.advantage) k_v.advantage = project.advantage;
                        if (project.company_info) k_v.company_info = project.company_info;

                        setType(project.category);
                        setFile([{ url: project.cover }]);
                        setFieldsValue(k_v);
                    } 
                }
            }
        })()
    }, []);

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
            Object.keys(values).forEach(key => k_v[key.toLocaleLowerCase()] = values[key] ? values[key] : '');
            if (!!thisMap.size || !thisFiles.length || error) return Toast.fail('请按正确的格式填写表单！');;

            if (!k_v.title) return Toast.fail('请填写项目名称！');
            if (!thisFiles.length) {
                return Toast.fail('请上传项目封面')
            } else {
                k_v.cover = thisFiles[0].url;
            };
            if (!k_v.amount) {
                return Toast.fail('请填写项目融资金额！')
            } else {
                k_v.amount *= 1;
            }
            if (!k_v.industry) {
                return Toast.fail('请选择行业类型！');
            } else {
                k_v.industry = { id: k_v.industry[k_v.industry.length - 1] }
            }
            if (!k_v.area) {
                return Toast.fail('请选择项目所在地区！');
            } else {
                k_v.area = { id: k_v.area[k_v.area.length - 1] };
            }
            if (k_v.category === 'equity') {
                if (!k_v.stage.length) {
                    return Toast.fail('请选择项目所在处阶段！');
                } else {
                    k_v.stage = { id: k_v.stage[k_v.stage.length - 1] };
                }
                if (!k_v.ratio.length) {
                    return Toast.fail('请选择项目占股比例！');
                } else {
                    k_v.ratio = { id: k_v.ratio[k_v.ratio.length - 1] };
                }
                if (!k_v.withdrawal_year.length) {
                    return Toast.fail('请选择项目最短退出年限！');
                } else {
                    k_v.withdrawal_year = { id: k_v.withdrawal_year[k_v.withdrawal_year.length - 1] };
                }
                if (!k_v.exit_mode.length) {
                    k_v.exit_mode = [];
                } else {
                    k_v.exit_mode = k_v.exit_mode.map(mode => ({ id: mode }));
                }
            } else {
                if (!k_v.risk.length) {
                    return Toast.fail('请选择项目风控要求！');
                } else {
                    k_v.risk = { id: k_v.risk[k_v.risk.length - 1] };
                }
                if (!k_v.interest.length) {
                    return Toast.fail('请选择项目所需承担的利息！');
                } else {
                    k_v.interest = { id: k_v.interest[k_v.interest.length - 1] };
                }
                if (!k_v.occupancy_time.length) {
                    return Toast.fail('请选择项目资金占用时长！');
                } else {
                    k_v.occupancy_time = { id: k_v.occupancy_time[k_v.occupancy_time.length - 1] };
                }
                if (!k_v.payment) return Toast.fail('请填写还款来源！');
            }

            if (!k_v.purposes) return Toast.fail('请填写项目融资用途！');
            if (!k_v.progress) return Toast.fail('请填写项目发展！');
            if (!k_v.info) return Toast.fail('请填写项目介绍！');
            if (!k_v.data) {
                k_v.data = [];
            } else {
                k_v.data = k_v.data.map(mode => ({ id: mode }));
            }

            global.TNT(k_v);

            const res = await client.mutate({
                mutation: params.id ? M_UPDATE_PROJECT : M_PUBLISH_PROJECT,
                variables: {
                    data: k_v
                }
            });

            if (!res.data || (!res.data.publishProject && !res.data.updateProject)) {
                return Toast.fail(`${params.id ? '更新' : '发布'}项目失败！`);
            } else {
                Toast.success(`${params.id ? '更新' : '发布'}项目成功！请等待管理员审核！`);
                await toFetchCurrentUser(client);
                history.push(LOCAL_URL['MINE']);
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
    const FIELD_1 = 'title';
    const FIELD_2 = 'amount';
    const FIELD_3 = 'industry';
    const FIELD_4 = 'area';
    const FIELD_5 = 'category';
    const FIELD_6 = 'stage';
    const FIELD_7 = 'ratio';
    const FIELD_8 = 'withdrawal_year';
    const FIELD_9 = 'exit_mode';
    const FIELD_10 = 'risk';
    const FIELD_11 = 'interest';
    const FIELD_12 = 'occupancy_time';
    const FIELD_13 = 'payment';

    const FIELD_14 = 'purposes';
    const FIELD_15 = 'progress';
    const FIELD_16 = 'info';
    const FIELD_17 = 'data';
    const FIELD_18 = 'team_info';
    const FIELD_19 = 'advantage';
    const FIELD_20 = 'company_info';

    const FIELD_1_PROPS = toCreateProps(FIELD_1)("text")("请填写项目名称")(/\S/ig, "请不要留空！")();
    const FIELD_2_PROPS = toCreateProps(FIELD_2)("digit")("请输入金额")(/\S/ig, "请不要留空！")("万元");
    const FIELD_3_PROPS = toCreatePickerProps(FIELD_3)(industry_set);
    const FIELD_4_PROPS = toCreatePickerProps(FIELD_4)(area_set);

    const FIELD_6_PROPS = toCreatePickerProps(FIELD_6)(stage_set);
    const FIELD_7_PROPS = toCreatePickerProps(FIELD_7)(ratio_set);
    const FIELD_8_PROPS = toCreatePickerProps(FIELD_8)(withdrawal_year_set);

    const FIELD_10_PROPS = toCreatePickerProps(FIELD_10)(risk_set);
    const FIELD_11_PROPS = toCreatePickerProps(FIELD_11)(interest_set);
    const FIELD_12_PROPS = toCreatePickerProps(FIELD_12)(occupancy_time_set);
    const FIELD_13_PROPS = toCreateProps(FIELD_13)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    const FIELD_14_PROPS = toCreateProps(FIELD_14)("text")("请详细介绍")(/\S/ig, "请不要留空！")();

    const FIELD_15_PROPS = toCreateProps(FIELD_15)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    const FIELD_16_PROPS = toCreateProps(FIELD_16)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    
    const FIELD_18_PROPS = toCreateProps(FIELD_18)("text")("请详细介绍（非必填项）")()();
    const FIELD_19_PROPS = toCreateProps(FIELD_19)("text")("请详细介绍（非必填项）")()();
    const FIELD_20_PROPS = toCreateProps(FIELD_20)("text")("请详细介绍（非必填项）")()();
    /* 【Part 2】 ↑ */

    /* 【Part 3】 ↓ */
    const toUploadImage = (cropedImage) => async (e) => {
        const formData = new FormData();
        const { current } = cropedImage;
        const fakeFile = dataURLtoBlob(current.getImageScaledToCanvas().toDataURL("image/jpeg"));
        fakeFile.name = thisImage.file.name;
        fakeFile.lastModifiedDate = new Date();
        formData.append('file', fakeFile);
        formData.append('fileName', thisImage.file.name);
        try {
            const { relativePath } = await Upload(`${API_ROOT}/storage`, formData).then(res => res.json());
            if (relativePath) {
                Toast.success('上传成功！');
                thisImage.url = relativePath;
                setFile([thisImage]);
                toCropImage(null);
            } else {
                Toast.fail('上传失败！');
            }
        } catch (error) {
            console.error(error.message);
            Toast.fail('上传图片失败！');
        }  
    }
    const onFileChange = (thisFiles, setFile) => async (files, type, index) => {
        if (files.length < thisFiles.length) {
            Modal.alert('移除图片', "是否确认要移除此张图片？", [
                { text: '取消', onPress: () => global.TNT('用户已取消！') },
                { text: '确认', onPress: () => setFile(files) },
            ])
        } else {
            if (files.length && files[0].file.size > 1024 * 1024 * 5) {
                Toast.fail(`当前图片大小【${(files[0].file.size / 1024 / 1024).toString().slice(0,5)}MB】，请上传小于【10M】的图片！`);
            } else {
                
                toCropImage(files[files.length - 1])
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
                        onChange={onFileChange(thisFiles, setFile)}
                        onFail={msg => Toast.fail(msg.message) || global.TNT(msg.message)}
                        onImageClick={(index, img) => setModal({ show: true, url: img[index].url })}
                        selectable={!thisFiles.length}
                    />
                    <p>图片大小不超过5M</p>
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
                    <Radio.Group {...getFieldProps(FIELD_5, { initialValue: "equity", onChange: (e) => setType(e.target.value) })} >
                        <Radio value="equity" >股权融资</Radio>
                        <Radio value="claim" >债权融资</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType === 'equity' ? (
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
                        <TagsView {...getFieldProps(FIELD_9)} className="tags-view" title="退出方式" data={exit_mode_set} limit={3} />
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

                <List.Item className="none-input-item">
                    <label>公司介绍</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_20)}
                        {...FIELD_20_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>

                <TagsView {...getFieldProps(FIELD_17)} className="tags-view" title="需提供资料" data={data_set} />


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

            <Modal
                visible={thisImage && thisImage.url}
                maskClosable={false}
                transparent
            >
                <AvatarEditor
                    ref={cropedImage}
                    image={thisImage && thisImage.url}
                    width={200}
                    height={100}
                    border={5}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1}
                />
                <Button onClick={toUploadImage(cropedImage)}>确认上传</Button>
            </Modal>
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
import React, { Fragment, useState } from 'react';
import { List, InputItem, TextareaItem, Toast, Picker } from 'antd-mobile';
import { Radio } from 'antd';
import { createForm } from 'rc-form';
import { withApollo } from 'react-apollo';

import TagsView from '../components/TagsView';
import { M_PUBLISH_CAPITAL } from '../gql';
import { LOCAL_URL } from '../config/common';
import { toTransformAreaTreeProps, toGetLevel, toFetchCurrentUser } from '../utils/global';

import 'antd/es/radio/style/css';
import "../style/publish.scss";

const PublishFunds = withApollo((props) => {

    const { form: { getFieldProps, getFieldsValue, setFieldsValue, validateFields }, client, history } = props;
    
    const [thisMap, setMap] = useState(new Map());
    const [thisType, setType] = useState('equity');

    let industry_set = [];
    let industry_origin_set = [];
    let type_set = [];
    let type_origin_set = [];
    let area_set = [];
    let area_origin_set = [];
    let equity_type_set = [];
    let equity_type_origin_set = [];
    let stage_set = [];
    let stage_origin_set = [];
    let invest_type_set = [];
    let invest_type_origin_set = [];
    let risk_set = [];
    let risk_origin_set = [];
    let ratio_set = [];
    let ratio_origin_set = [];
    let data_set = [];
    let data_origin_set = [];

    let metadata = [];

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));

        industry_origin_set = metadata[metadata.findIndex(data => data.title === '行业')].children;
        type_origin_set = metadata[metadata.findIndex(data => data.title === '资金类型')].children;
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children;
        equity_type_origin_set = metadata[metadata.findIndex(data => data.title === '参股类型')].children;
        stage_origin_set = metadata[metadata.findIndex(data => data.title === '阶段')].children;
        invest_type_origin_set = metadata[metadata.findIndex(data => data.title === '投资类型')].children;
        risk_origin_set = metadata[metadata.findIndex(data => data.title === '风控')].children;
        ratio_origin_set = metadata[metadata.findIndex(data => data.title === '比例')].children;
        data_origin_set = metadata[metadata.findIndex(data => data.title === '可提供资料')].children;

        industry_set = toTransformAreaTreeProps(industry_origin_set, { key: 'title', value: 'title', children: 'children' });
        type_set = toTransformAreaTreeProps(type_origin_set, { key: 'title', value: 'title', children: 'children' });
        area_set = toTransformAreaTreeProps(area_origin_set, { key: 'title', value: 'title', children: 'children' });
        equity_type_set = toTransformAreaTreeProps(equity_type_origin_set, { key: 'title', value: 'title', children: 'children' });
        stage_set = toTransformAreaTreeProps(stage_origin_set, { key: 'title', value: 'title', children: 'children' });
        invest_type_set = toTransformAreaTreeProps(invest_type_origin_set, { key: 'title', value: 'title', children: 'children' });
        risk_set = toTransformAreaTreeProps(risk_origin_set, { key: 'title', value: 'title', children: 'children' });
        ratio_set = toTransformAreaTreeProps(ratio_origin_set, { key: 'title', value: 'title', children: 'children' });
        data_set = toTransformAreaTreeProps(data_origin_set, { key: 'title', value: 'title', children: 'children' });

    } catch (error) {
        console.error(error.message);
    }

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
            let k_v = {};
            Object.keys(values).forEach(key => k_v[key.toLocaleLowerCase()] = values[key] ? values[key] : '');
            if (!!thisMap.size || error) return Toast.fail('请按正确的格式填写表单！');;

            if (!k_v.title) return Toast.fail('请填写资金名称！');
            if (!k_v.industry.length || k_v.industry.length >3) {
                return Toast.fail('请选择不多于3个的行业类型！');
            } else {
                k_v.industry = k_v.industry.map(item => ({
                    id: industry_origin_set[industry_origin_set.findIndex(o => o.title === item)].id
                }))
            }
            if (!k_v.amount) {
                return Toast.fail('请填写资金的融资金额！')
            } else {
                k_v.amount *= 1;
            }
            if (!k_v.type.length || k_v.type.length > 3) {
                return Toast.fail('请选择不多于3个的资金类型！');
            } else {
                k_v.type = k_v.type.map(item => ({
                    id: type_origin_set[type_origin_set.findIndex(o => o.title === item)].id
                }))
            }
            if (!k_v.area.length) {
                return Toast.fail('请选择资金所在地区！');
            } else {
                k_v.area = { id: area_origin_set[area_origin_set.findIndex(o => o.title === k_v.area[0])].id };
            }
            if (!k_v.invest_area.length || k_v.invest_area.length > 3) {
                return Toast.fail('请选择不多于3个的投资地区！');
            } else {
                k_v.invest_area = k_v.invest_area.map(item => ({
                    id: area_origin_set[area_origin_set.findIndex(o => o.title === item)].id
                }))
            }
            if (k_v.category === 'equity') {
                if (!k_v.equity_type.length) {
                    return Toast.fail('请选择资金参股类型！');
                } else {
                    k_v.equity_type = { id: equity_type_origin_set[equity_type_origin_set.findIndex(o => o.title === k_v.equity_type[0])].id };
                }
                if (!k_v.stage.length) {
                    return Toast.fail('请选择资金所在处阶段！');
                } else {
                    k_v.stage = k_v.stage.map(item => ({
                        id: stage_origin_set[stage_origin_set.findIndex(o => o.title === item)].id
                    }))
                }
                if (!k_v.term) {
                    return Toast.fail('请填写资金的投资期限！')
                } else {
                    k_v.term *= 1;
                }
                if (!k_v.invest_type.length) {
                    return Toast.fail('请选择资金的投资类型！');
                } else {
                    k_v.invest_type = k_v.invest_type.map(item => ({
                        id: invest_type_origin_set[invest_type_origin_set.findIndex(o => o.title === item)].id
                    }))
                }

                if (!k_v.ratio.length) {
                    return Toast.fail('请选择资金所占比例！');
                } else {
                    k_v.ratio = { id: ratio_origin_set[ratio_origin_set.findIndex(o => o.title === k_v.ratio[0])].id };
                }
            } else {
                if (!k_v.return) return Toast.fail('请填写资金最低回报要求！');
                if (!k_v.risk.length) {
                    return Toast.fail('请选择资金的风控要求！');
                } else {
                    k_v.risk = { id: risk_origin_set[risk_origin_set.findIndex(item => item.title === k_v.risk[0])].id };
                }
                if (!k_v.discount) {
                    return Toast.fail('请填写资金的抵质押物折扣率！')
                } else {
                    k_v.discount *= 1;
                }
            }

            if (!k_v.data.length) {
                return Toast.fail('请选择资金所需要的资料！');
            } else {
                k_v.data = k_v.data.map(item => ({
                    id: data_origin_set[data_origin_set.findIndex(o => o.title === item)].id
                }))
            }
            if (!k_v.info) return Toast.fail('请填写资金详情！');

            global.TNT(k_v);

            const res = await client.mutate({
                mutation: M_PUBLISH_CAPITAL,
                variables: {
                    data: k_v
                }
            });

            if (res.data && res.data.publishCapital) {
                Toast.success('发布资金成功！请等待管理员审核！');
                await toFetchCurrentUser(client);
                history.push(LOCAL_URL['MINE']);
            } else {
                Toast.fail('发布资金失败！');
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
    const FIELD_2 = 'industry';
    const FIELD_3 = 'amount';
    const FIELD_4 = 'type';
    const FIELD_5 = 'area';
    const FIELD_6 = 'invest_area';
    const FIELD_7 = 'category';
    const FIELD_8 = 'equity_type';
    const FIELD_9 = 'stage';
    const FIELD_10 = 'term';
    const FIELD_11 = 'invest_type';
    const FIELD_12 = 'ratio';

    const FIELD_13 = 'return';
    const FIELD_14 = 'risk';
    const FIELD_15 = 'pledge';
    const FIELD_16 = 'discount';

    const FIELD_17 = 'pre_payment';
    const FIELD_18 = 'data';
    const FIELD_19 = 'info';

    const FIELD_1_PROPS = toCreateProps(FIELD_1)("text")("请填写标题")(/\S/ig, "请不要留空！")();

    const FIELD_3_PROPS = toCreateProps(FIELD_3)("digit")("请填写投资金额")(/\S/ig, "请不要留空！")("万元");

    const FIELD_5_PROPS = toCreatePickerProps(FIELD_5)(area_set);

    const FIELD_8_PROPS = toCreatePickerProps(FIELD_8)(equity_type_set);

    const FIELD_10_PROPS = toCreateProps(FIELD_10)("digit")("请输入年限")(/\S/ig, "请不要留空！")("年");

    const FIELD_12_PROPS = toCreatePickerProps(FIELD_12)(ratio_set);
    const FIELD_13_PROPS = toCreateProps(FIELD_13)("text")("请输入最低回报要求")(/\S/ig, "请不要留空！")();
    const FIELD_14_PROPS = toCreatePickerProps(FIELD_14)(risk_set);

    const FIELD_15_PROPS = toCreateProps(FIELD_15)("text")("如若没有抵押物请留空")()();
    const FIELD_16_PROPS = toCreateProps(FIELD_16)("digit")("请输入折扣率")(/\S/ig, "请不要留空！")("折");
    
    const FIELD_17_PROPS = toCreateProps(FIELD_17)("text")("如若没有前期费用请留空")()();
    const FIELD_19_PROPS = toCreateProps(FIELD_19)("text")("请详细介绍")(/\S/ig, "请不要留空！")();
    /* 【Part 2】 ↑ */

    global.TNT(thisMap, thisType);

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

                <TagsView {...getFieldProps(FIELD_2)} className="tags-view" title="行业类型" data={industry_set.map(item => item.value)} />
                <InputItem {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} >投资金额</InputItem>
                <TagsView {...getFieldProps(FIELD_4)} className="tags-view" title="资金类型" data={type_set.map(item => item.value)} />
                <Picker {...getFieldProps(FIELD_5)} {...FIELD_5_PROPS} >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                </Picker>
                <TagsView {...getFieldProps(FIELD_6)} className="tags-view" title="投资地区" data={area_set.map(item => item.value)} />

               <List.Item className="none-input-item">
                    <label>投资方式</label>
                    <Radio.Group {...getFieldProps(FIELD_7, { initialValue: "equity", onChange: (e) => setType(e.target.value) })} >
                        <Radio value="equity" >股权投资</Radio>
                        <Radio value="claim" >债权投资</Radio>
                    </Radio.Group>
                </List.Item>

                {thisType === 'equity' ? (
                    <Fragment>
                        <Picker {...getFieldProps(FIELD_8)} {...FIELD_8_PROPS} >
                            <List.Item arrow="horizontal">参股类型</List.Item>
                        </Picker>
                        <TagsView {...getFieldProps(FIELD_9)} className="tags-view" title="投资阶段" data={stage_set.map(item => item.value)} />
                        <InputItem {...getFieldProps(FIELD_10)} {...FIELD_10_PROPS} >投资期限</InputItem>
                        <TagsView {...getFieldProps(FIELD_11)} className="tags-view" title="投资类型" data={invest_type_set.map(item => item.value)} />
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
                        <InputItem {...getFieldProps(FIELD_15)} {...FIELD_15_PROPS} labelNumber={7} >抵质押物类型</InputItem>
                        <InputItem {...getFieldProps(FIELD_16)} {...FIELD_16_PROPS} labelNumber={7} >抵质押物折扣率</InputItem>
                    </Fragment>
                )}

                <InputItem {...getFieldProps(FIELD_17)} {...FIELD_17_PROPS} labelNumber={5} >前期费用</InputItem>
                <TagsView {...getFieldProps(FIELD_18)} className="tags-view" title="可提供资料" data={data_set.map(item => item.value)} />

                <List.Item className="none-input-item">
                    <label>资金详情</label>
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
})



export default createForm()(PublishFunds);
import React, { Fragment, useState, useEffect } from 'react';
import { List, InputItem, TextareaItem, Toast, Picker, Switch } from 'antd-mobile';
import { Radio } from 'antd';
import { createForm } from 'rc-form';
import { withApollo } from 'react-apollo';

import TagsView from '../components/TagsView';
import { M_PUBLISH_CAPITAL, Q_GET_CAPITAL, M_UPDATE_CAPITAL } from '../gql';
import { LOCAL_URL } from '../config/common';
import { buildingQuery, toTransformAreaTreeProps, toGetLevel, toFetchCurrentUser, toGetParentArrayByChildNode } from '../utils/global';

import 'antd/es/radio/style/css';
import "../style/publish.scss";

const defaultVariables = {
    join: [
        { field: 'creator' },
        { field: 'industry' },
        { field: 'area' },
        { field: 'stage' },
        { field: 'type' },
        { field: 'equity_type' },
        { field: 'invest_type' },
        { field: 'invest_area' },
        { field: 'risk' },
        { field: 'data' },
        { field: 'term' },
        { field: 'ratio' },
        { field: 'return' },
        { field: 'pledge' },
        { field: 'discount' },
        { field: 'pre_payment' },
    ],
};

const PublishFunds = withApollo((props) => {

    const { form: { getFieldProps, getFieldsValue, setFieldsValue, validateFields }, client, history, location: { search } } = props;

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
    //let user = {};
    let [user, updateUser] = useState({});
    let params = {};
    let params_str = search.split('?')[1] || '';
    params_str.split('&').forEach(param => {
        let [key, val] = param.split('=');
        params[key] = val;
    })
    const [status, setStatus] = useState();

    try {
        metadata = JSON.parse(sessionStorage.getItem('metadata'));
        user = JSON.parse(localStorage.getItem('u_user'));

        industry_origin_set = metadata[metadata.findIndex(data => data.title === '行业')].children;
        type_origin_set = metadata[metadata.findIndex(data => data.title === '资金类型')].children;
        area_origin_set = metadata[metadata.findIndex(data => data.title === '地区')].children.sort((a, b) => a.title === '江西省' ? -1 : 1);
        equity_type_origin_set = metadata[metadata.findIndex(data => data.title === '参股类型')].children;
        stage_origin_set = metadata[metadata.findIndex(data => data.title === '阶段')].children;
        invest_type_origin_set = metadata[metadata.findIndex(data => data.title === '投资类型')].children;
        risk_origin_set = metadata[metadata.findIndex(data => data.title === '风控')].children;
        ratio_origin_set = metadata[metadata.findIndex(data => data.title === '比例')].children;
        data_origin_set = metadata[metadata.findIndex(data => data.title === '可提供资料')].children;

        industry_set = toTransformAreaTreeProps(industry_origin_set, { key: 'title', value: 'id', children: 'children' });
        type_set = toTransformAreaTreeProps(type_origin_set, { key: 'title', value: 'id', children: 'children' });
        area_set = toTransformAreaTreeProps(area_origin_set, { key: 'title', value: 'id', children: 'children' });
        equity_type_set = toTransformAreaTreeProps(equity_type_origin_set, { key: 'title', value: 'id', children: 'children' });
        stage_set = toTransformAreaTreeProps(stage_origin_set, { key: 'title', value: 'id', children: 'children' });
        invest_type_set = toTransformAreaTreeProps(invest_type_origin_set, { key: 'title', value: 'id', children: 'children' });
        risk_set = toTransformAreaTreeProps(risk_origin_set, { key: 'title', value: 'id', children: 'children' });
        ratio_set = toTransformAreaTreeProps(ratio_origin_set, { key: 'title', value: 'id', children: 'children' });
        data_set = toTransformAreaTreeProps(data_origin_set, { key: 'title', value: 'id', children: 'children' });

    } catch (error) {
        console.error(error.message);
    }

    if (!user || !user.identity) {
        Toast.info('请先登录！');
        history.push(LOCAL_URL['SIGNIN']);
    }

    useEffect(() => {
        if (user) {
            toFetchCurrentUser(props.client).then((user) => {
                if (user) {
                    updateUser(user);
                    if (user.identity != "investor" || user.status !== 3) {
                        Toast.info('请先升级账号会员再发布');
                        history.push(LOCAL_URL['PUBLISH_MEMBER']);
                    }
                }
            })
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (params.id) {
                let capitals = user.capitals;
                let index = capitals.findIndex((capital => capital.id === params.id));

                if (index !== -1) {
                    const { data } = await client.query({
                        query: Q_GET_CAPITAL,
                        variables: { id: params.id, queryString: buildingQuery(defaultVariables) }
                    });
                    if (data) {
                        global.TNT(data.capital);

                        let k_v = {};
                        let { capital } = data;
                        if (capital.title) k_v.title = capital.title;
                        if (capital.amount) k_v.amount = capital.amount;
                        if (capital.industry) k_v.industry = capital.industry.map(item => item.id);
                        if (capital.type) k_v.type = capital.type.map(item => item.id);
                        if (capital.area) {
                            k_v.area = toGetParentArrayByChildNode(area_origin_set, { id: capital.area.id }).map(item => item.id);
                        }
                        if (capital.category) k_v.category = capital.category;
                        if (capital.invest_area) k_v.invest_area = capital.invest_area.map(item => item.id);
                        if (capital.equity_type) k_v.equity_type = [capital.equity_type.id];
                        if (capital.stage) k_v.stage = capital.stage.map(item => item.id);
                        if (capital.term) k_v.term = capital.term;
                        if (capital.invest_type) k_v.invest_type = capital.invest_type.map(item => item.id);
                        if (capital.ratio) k_v.ratio = [capital.ratio.id];
                        if (capital.return) k_v.return = capital.return;
                        if (capital.risk) k_v.risk = [capital.risk.id];
                        if (capital.pledge) k_v.pledge = capital.pledge;
                        if (capital.discount) k_v.discount = capital.discount;
                        if (capital.pre_payment) k_v.pre_payment = capital.pre_payment;
                        if (capital.data) k_v.data = capital.data.map(item => item.id);
                        if (capital.info) k_v.info = capital.info;
                        k_v.deliverable = capital.deliverable;

                        setType(capital.category);
                        setFieldsValue(k_v);
                        setStatus(capital.status);
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
            if (!!thisMap.size || error) return Toast.fail('请按正确的格式填写表单！');;

            if (!k_v.title) return Toast.fail('请填写资金名称！');
            if (!k_v.industry.length || k_v.industry.length >3) {
                return Toast.fail('请选择不多于3个的行业类型！');
            } else {
                k_v.industry = k_v.industry.map(item => ({ id: item }))
            }
            if (!k_v.amount) {
                return Toast.fail('请填写资金的融资金额！')
            } else {
                k_v.amount *= 1;
            }
            if (!k_v.type.length || k_v.type.length > 3) {
                return Toast.fail('请选择不多于3个的资金类型！');
            } else {
                k_v.type = k_v.type.map(item => ({ id: item }))
            }
            if (!k_v.area.length) {
                return Toast.fail('请选择资金所在地区！');
            } else {
                k_v.area = { id: k_v.area[k_v.area.length - 1] };
            }
            if (!k_v.invest_area.length || k_v.invest_area.length > 3) {
                return Toast.fail('请选择不多于3个的投资地区！');
            } else {
                k_v.invest_area = k_v.invest_area.map(item => ({ id: item }))
            }
            if (k_v.category === 'equity') {
                if (!k_v.equity_type.length) {
                    return Toast.fail('请选择资金参股类型！');
                } else {
                    k_v.equity_type = { id: k_v.equity_type[k_v.equity_type.length - 1] };
                }
                if (!k_v.stage.length) {
                    return Toast.fail('请选择资金所在处阶段！');
                } else {
                    k_v.stage = k_v.stage.map(item => ({ id: item }))
                }
                if (!k_v.term) {
                    return Toast.fail('请填写资金的投资期限！')
                } else {
                    k_v.term *= 1;
                }
                if (!k_v.invest_type.length) {
                    return Toast.fail('请选择资金的投资类型！');
                } else {
                    k_v.invest_type = k_v.invest_type.map(item => ({ id: item }))
                }

                if (!k_v.ratio.length) {
                    return Toast.fail('请选择资金所占比例！');
                } else {
                    k_v.ratio = { id: k_v.ratio[k_v.ratio.length - 1] };
                }
            } else {
                if (!k_v.return) return Toast.fail('请填写资金最低回报要求！');
                if (!k_v.risk.length) {
                    return Toast.fail('请选择资金的风控要求！');
                } else {
                    k_v.risk = { id: k_v.risk[k_v.risk.length - 1] };
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
                k_v.data = k_v.data.map(item => ({ id: item }))
            }
            if (!k_v.info) return Toast.fail('请填写资金详情！');

            k_v.deliverable = values.deliverable;
            k_v.status = "pending";

            global.TNT(k_v);

            const res = await client.mutate({
                mutation: params.id ? M_UPDATE_CAPITAL : M_PUBLISH_CAPITAL,
                variables: {
                    id: params.id,
                    data: k_v
                }
            });

            if (!params.id && !res.data.publishCapital.success) {
                return res.data.publishCapital.code ? Toast.fail(`请勿重复发布！`) : Toast.fail(`${params.id ? '更新' : '发布'}资金失败！`);;
            } else {
                Toast.success(`${params.id ? '更新' : '发布'}资金成功！请等待管理员审核！`);
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
    const FIELD_20 = 'deliverable';

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

    const showSubmit = (status) => {
        if (status && status !== "rejected" && status !== "checked") {
            if (status === "pending") {
                return (<div className="publish-button-disable">审核中</div>)
            } else {
                return (<div className="publish-button-disable">已发布</div>)
            }
        } else {
            return (<div className="publish-button" onClick={toPublish}>立即发布</div>);
        }
    }

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

                <TagsView {...getFieldProps(FIELD_2)} className="tags-view" title="行业类型" data={industry_set} limit={3}/>
                <InputItem {...getFieldProps(FIELD_3)} {...FIELD_3_PROPS} >投资金额</InputItem>
                <TagsView {...getFieldProps(FIELD_4)} className="tags-view" title="资金类型" data={type_set} limit={3}/>
                <Picker {...getFieldProps(FIELD_5)} {...FIELD_5_PROPS} >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                </Picker>
                <TagsView {...getFieldProps(FIELD_6)} className="tags-view" title="投资地区" data={area_set} limit={3}/>

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
                        <TagsView {...getFieldProps(FIELD_9)} className="tags-view" title="投资阶段" data={stage_set} />
                        <InputItem {...getFieldProps(FIELD_10)} {...FIELD_10_PROPS} >投资期限</InputItem>
                        <TagsView {...getFieldProps(FIELD_11)} className="tags-view" title="投资类型" data={invest_type_set} />
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
                <TagsView {...getFieldProps(FIELD_18)} className="tags-view" title="需提供资料" data={data_set} />

                <List.Item className="none-input-item">
                    <label>资金详情</label>
                    <TextareaItem
                        {...getFieldProps(FIELD_19)}
                        {...FIELD_19_PROPS}
                        rows={5}
                        autoHeight
                    />
                </List.Item>
                <List.Item
                    extra={<Switch
                        {...getFieldProps(FIELD_20, {
                        initialValue: true,
                        valuePropName: 'checked'
                        })}
                       
                    />}
                    >是否允许投递</List.Item>
                    <p className="switch-remind">若设置不允许，则项目方不能联系您。</p>

            </List>

            {showSubmit(status)}
        </div>
    )
})



export default createForm()(PublishFunds);
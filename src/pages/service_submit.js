import React, { Fragment, Component, useContext } from 'react';
import { List, InputItem, DatePickerView, Button, Toast, Picker } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import _ from 'lodash';
import ShopContext from '../context/shop';

import config from '../lib/config';
import superFetch from '../lib/api';
import toTransformAreaTreeProps from '../lib/global';

const { LOCAL_URL } = config;

// const service_details = {
//     id: 1,
//     title: '“多彩文艺”志愿服务',
//     tags: ['文化文明'],
//     images: ['http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效'],
//     description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
//     notice: '<p>1、教练正在鼓励和帮助孩子们在冰面上保持平衡和基本动作。</p><p>2、考虑到孩子们的特殊性, 华星冰上中心特意使用整个冰球馆让他们参观体验, 面对上千平米的室内冰场, 孩子们充满了兴奋与好奇。</p>'
// }

class ServiceSubmit extends Component {

    state = {
        show_picker: false,
        date: null,
        village_data: [],
        form_data: []
    }

    componentDidMount (){
        const { service, match: { params: { id } }} = this.props;
        const details = _.find(service, { id: id });
        if (!!details.ex_info) {
            const forms = toTransformAreaTreeProps(details.ex_info.links, { key: 'form', value: 'form', children: 'children' });
            this.setState({form_data: forms});
        }
        this.fetchList(details);
    }

    fetchList = async (details) => {
        const res = await superFetch.get('/organization/list', { name: details.category.ex_info });
        if (res.length === 0) return;
        const villageList = res.slice(1);
        const village_data = toTransformAreaTreeProps(villageList, { key: 'name', value: 'name', children: 'children' });
        this.setState({
            village_data: village_data
        })
    }

    onChange = (value) => {
        this.setState({
            date: moment(value)
        })
    };

    onSubmit = (e) => {
        const { match: { params: { id } }, form: { validateFields } } = this.props;
        const { date } = this.state;
        validateFields(async (error, value) => {
            if (!!error) {
                const msg = error[Object.keys(error)[0]].errors[0].message;
                Toast.fail(msg, 2);
            } else {
                value.date = date && date.format('YYYY-MM-DD HH:mm:ss');
                value.village = value.village ? value.village[0] : '';
                value.form = value.form ? value.form[0] : '';
                const res = await superFetch.post('/service/apply', { ...value, id });
                if (res === true) {
                    Toast.success('提交成功！请等待管理员处理！', 2);
                    setTimeout(() => window.location.href = LOCAL_URL['ORDER_WANTDO'], 2000);
                } else {
                    Toast.fail('提交失败！请联系管理员查询原因！', 2);
                }

            }
        });
    }

    toShowDatePicker = () => this.setState({ show_picker: true })
    toHideDatePicker = () => this.setState({ show_picker: false })

    toHandlerDateConfirm = () => {
        if (!this.state.date) {
            this.setState({
                show_picker: false,
                date: moment(new Date())
            })
        } else {
            this.toHideDatePicker();
        }
    }

    toRenderDatePicker = () => (
        <div className={`date-picker-masker ${this.state.show_picker ? 'show' : 'noshow'}`}>
            <DatePickerView onChange={this.onChange} minDate={new Date()} value={this.state.date ? this.state.date.toDate() : new Date()}/>
            <Button type="primary" style={{ margin: "5vw 0 2vw" }} onClick={this.toHandlerDateConfirm}>确定</Button>
        </div>
    )

    render() {
        const { service, match: { params: { id } }, form: { getFieldProps } } = this.props;
        const details = _.find(service, { id: id });
        details.tags = [details.category.name];
        //details.images = details.albumList.map(item => item.url);
        details.description = details.desc;

        return (
            <div className="hdz-service-details">
                <div className="service-details-header">
                    <p className="service-title">{details.title}</p>
                    <p className="service-tags">
                        {details.tags && details.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </p>
                    {/* <p className="service-images">
                        {details.images && details.images.map((image, i) => (
                            <img src={image} alt="service-images" key={i} />
                        ))}
                    </p> */}
                </div>

                <div className="hdz-block-space"></div>

                <List className="service-details-input-area">
                    <InputItem {...getFieldProps('realName', { rules: [{ required: true, message: '请填写真实姓名' }] })} clear placeholder="姓名" labelNumber={3}>姓名</InputItem>
                    <InputItem {...getFieldProps('phone', { rules: [{ required: true, pattern: /\d{11}/, message: '请填写正确的手机号码', }] })} clear placeholder="用于取得联系" labelNumber={3}>电话</InputItem>
                    {!!details.category && details.category.ex_info.length > 0 ? (
                        // <InputItem {...getFieldProps('village')} clear placeholder="选填" labelNumber={7}>服务地址</InputItem>
                        <Picker data={this.state.village_data} cols={1} placeholder="必选" {...getFieldProps('village', { rules: [{ required: true, message: '请选择服务乡村' }] })} className="forss">
                            <List.Item arrow="horizontal">服务村</List.Item>
                        </Picker>
                    ) : ''}
                    {!!details.ex_info ? (
                        <Picker data={this.state.form_data} cols={1} placeholder="必选" {...getFieldProps('form', { rules: [{ required: true, message: '请选择服务内容' }] })} className="forss">
                            <List.Item arrow="horizontal">服务内容</List.Item>
                        </Picker>
                    ) : ''}
                    <InputItem {...getFieldProps('address')} clear placeholder="选填" labelNumber={7}>服务地址</InputItem>
                    <InputItem {...getFieldProps('date')} clear placeholder="选填" labelNumber={7} extra={<i className="iconfont iconrili"></i>} onFocus={() => document.activeElement.blur() || this.toShowDatePicker()} value={this.state.date ? this.state.date.format('YYYY-MM-DD HH:mm:ss') : ''}>期望时间</InputItem>
                    <InputItem {...getFieldProps('other', { rules: [{ required: false, message: '请填写服务内容' }] })} clear placeholder="选填" labelNumber={5}>具体要求</InputItem>
                </List>

                <div className={`service-details-button ${!this.state.show_picker ? 'show' : 'noshow'}`}>
                    <a href="javascript:;" onClick={this.onSubmit}>提交订单</a>
                </div>

                {this.toRenderDatePicker()}
            </div>
        )
    }
}


export default createForm()((props) => {
    const shopContext = useContext(ShopContext);

    if (shopContext.service[1]) {
        return (
            <Fragment>
                <ServiceSubmit {...props} service={shopContext.service[0]} />
            </Fragment>
        )
    } else {
        return (
            <Fragment></Fragment>
        )
    }
})
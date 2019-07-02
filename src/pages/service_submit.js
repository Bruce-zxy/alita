import React, { Fragment, Component } from 'react';
import { List, InputItem, DatePickerView, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import ShopContext from '../context/shop';

import config from '../lib/config';

const { LOCAL_URL } = config;

const service_details = {
    id: 1,
    title: '“多彩文艺”志愿服务',
    tags: ['文化文明'],
    images: ['http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效'],
    description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
    notice: '<p>1、教练正在鼓励和帮助孩子们在冰面上保持平衡和基本动作。</p><p>2、考虑到孩子们的特殊性, 华星冰上中心特意使用整个冰球馆让他们参观体验, 面对上千平米的室内冰场, 孩子们充满了兴奋与好奇。</p>'
}

export default createForm()(class extends Component {

    state = {
        show_picker: false
    }

    onChange = (value) => {
        this.props.form.setFieldsValue({
            time: moment(value).format('YYYY-MM-DD HH:mm:SS')
        })
    };

    onSubmit = (e) => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
            if (!!error) {
                Toast.fail('请将非选填的选项填写完整！', 2);
            } else {
                console.log(value);
            }
        });
    }

    toShowDatePicker = (e) => this.setState({ show_picker: true })
    toHideDatePicker = (e) => this.setState({ show_picker: false })

    toRenderDatePicker = () => (
        <div className={`date-picker-masker ${this.state.show_picker ? 'show' : 'noshow'}`}>
            <DatePickerView onChange={this.onChange} minDate={new Date()}/>
            <Button type="primary" style={{ margin: "5vw 0 2vw" }} onClick={this.toHideDatePicker}>确定</Button>
        </div>
    )

    render() {
        const { match: { params: { id } }, form: { getFieldProps  } } = this.props;
        const details = service_details;
        console.log(id);

        return (
            <div className="hdz-service-details">
                <div className="service-details-header">
                    <p className="service-title">{details.title}</p>
                    <p className="service-tags">            
                        {details.tags && details.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </p>
                    <p className="service-images">
                        {details.images && details.images.map((image, i) => (
                            <img src={image} alt="service-images" key={i} />
                        ))}
                    </p>
                </div>

                <div className="hdz-block-space"></div>
                
                <List className="service-details-input-area">
                    <InputItem {...getFieldProps('name', { rules: [{ required: true }] })} clear placeholder="姓名" labelNumber={3}>姓名</InputItem>
                    <InputItem {...getFieldProps('phone', { rules: [{ required: true }] })} clear placeholder="用于取得联系" labelNumber={3}>电话</InputItem>
                    <InputItem {...getFieldProps('address')} clear placeholder="选填" labelNumber={7}>上门服务地址</InputItem>
                    <InputItem {...getFieldProps('time')} clear placeholder="选填" labelNumber={7} extra={<i className="iconfont iconrili"></i>} onFocus={() => document.activeElement.blur() || this.toShowDatePicker()}>期望上门时间</InputItem>
                    <InputItem {...getFieldProps('requirement')} clear placeholder="选填" labelNumber={5}>特殊要求</InputItem>
                </List>

                <div className={`service-details-button ${!this.state.show_picker ? 'show' : 'noshow'}`}>
                    <a href="javascript:;" onClick={this.onSubmit}>提交订单</a>
                </div>

                {this.toRenderDatePicker()}
            </div>
        )
    }
})
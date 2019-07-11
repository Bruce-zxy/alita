import React, { useState, useEffect, useContext, useRef } from 'react';
import { TextareaItem, Toast, Modal } from 'antd-mobile';
import * as _ from 'lodash'

import ShopContext from '../context/shop';

import { getSearch } from '../lib/persistance';
import superFetch from '../lib/api';

const DEFAULT_AVATAR = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1561547251987&di=e63f4f0adfe4ffffa7ed7fa8c0fc9580&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fa12f24e688c1cda3ff4cc453f3486a88adaf08cc2cdb-tQvJqX_fw658';


export default ({ history }) => {
    const { tasks, requirements } = useContext(ShopContext);
    const textarea_ref = useRef();

    const toSubmit = async () => {
        const { value } = textarea_ref.current;
        const params = getSearch();
        const id_obj = _.find(params, (o) => !!o['id']);
        const type_obj = _.find(params, (o) => !!o['type']);
        const id = id_obj ? id_obj.id : '';
        const type = type_obj ? type_obj.type : '';

        if (!!id && !!type) {
            const list = type === 'todo' ? tasks[0] : requirements[0];
            const flow = _.find(list, { id: id });
            if (flow) {
                flow.ex_info.complaint = value;
                const res = await superFetch.put('/flow', flow);
                if (res) {
                    Toast.success('提交成功！');
                    setTimeout(() => history.goBack(), 1000);
                } else {
                    Toast.fail('提交失败！');
                }
            } else {
                Toast.error('未找到与投诉相对应的订单！');
            }
        } else {
            Toast.error('未找到与投诉相对应的订单！');
        }
        
    }
    const onClickHandler = (e) => {
        const { value } = textarea_ref.current;
        if (!value) {
            Toast.info('内容为空！');
        } else {
            Modal.alert('是否确认？', '提交此投诉内容至客服人员', [
                { text: '确认', onPress: toSubmit },
                { text: '取消', onPress: () => console.log('取消') },
            ])
        }
    }

    return (
        <div className="hdz-complaint-container">
            <textarea placeholder="请描述您想投诉的具体问题" ref={textarea_ref}></textarea>
            <span onClick={onClickHandler}>提交</span>
        </div>
    )
}
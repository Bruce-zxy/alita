import React, { useState } from 'react';
import { List, Toast } from 'antd-mobile';
import { Tag } from 'antd';
import 'antd/es/tag/style/css';

/* data: [{
    label: 'text',
    value: 'value'
}]
value: ['1', '2']; */

const MyTag = (props) => {
    const { value, checkedGroup, onChange, children } = props;
    const [tagState, setTagState] = useState(checkedGroup && checkedGroup.includes(value));

    const handleChange = checked => {
        if (onChange(value, checked)) {
            setTagState(checked);
        };
    };
    return (
        <Tag.CheckableTag {...props} checked={tagState} onChange={handleChange}>{children}</Tag.CheckableTag>
    );
}

export default (props) => {
    const { className, title, data, value, onChange, limit } = props;
    const [tagsState, setTagsState] = useState([]);

    const onTagChange = (name, checked) => {
        if (limit && tagsState.length >= limit * 1 && checked) {
            Toast.info(`最多只能选择${limit}个选项！`);
            return false
        }
        let val = [];
        if (checked && !tagsState.includes(name)) {
            val = [].concat(tagsState, [name]);
        }
        if (!checked && tagsState.includes(name)) {
            val = tagsState.filter(tag => tag !== name);
        }
        setTagsState(val);
        onChange(val);
        return true;
    }

    return (
        <List.Item className={`none-input-item ${className ? className : ''}`} wrap>
            <label style={{ width: title.length * 20 + 5 + "px" }}>{title}</label>
            <div>
                {data && data.map(tag => <MyTag key={tag.label} onChange={onTagChange} value={tag.value} checkedGroup={value}>{tag.label}</MyTag>)}
            </div>
        </List.Item>
    )
}
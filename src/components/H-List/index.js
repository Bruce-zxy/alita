import React from 'react';
import _ from "lodash";

import './index.css';

const toGetType = (item) => Object.prototype.toString.call(item).slice(8, -1);
const toCheckClassName = function () {
    return Array.from(arguments).filter(item => !!item).join(' ');
};

const toHandleParamType = (param, type_array, other) => {
    let type_array_type = toGetType(type_array);
    if (type_array_type === 'Function') {
        other = type_array;
        type_array = [];
    }
    if (!param || toGetType(type_array) !== "Array") {
        if (!!other) {
            return other(param);
        } else {
            return '';
        }
    }
    let type = param.$$typeof || toGetType(param);
    const param_func = _.find(type_array, { type: type.toString() });
    console.log(param_func);
    
    if (!!param_func) {
        return param_func.action(param);
    } else if (!!other) {
        return other(param);
    } else {
        return '';
    }
}


function HList(props) {
    let { className, datas, children, renderItem } = props;
    datas = toHandleParamType(datas, [{ type: "Array", action: (data) => data }], () => []);
    return (
        <div id="hdz-list-view" className={toCheckClassName(className)}>
            {!!children ? children : datas.map(data => renderItem(data))}
        </div>
    );

}

function Item({ className, children }) {
    return (
        <div className={`hdz-list-item ${toCheckClassName(className)}`}>
            {children}
        </div>
    )
}

function Image({ className, image, radius }) {
    let radiusClassName = !!radius ? 'hdz-list-image-raidus' : '';
    return (
        <div className={`hdz-list-image ${toCheckClassName(className, radiusClassName)}`}>
            <img src={image} alt={className} />
        </div>
    )
}

function Content({ className, children }) {
    return (
        <div className={`hdz-list-content ${toCheckClassName(className)}`}>
            {children}
        </div>
    )
}

function Extra({ className, datas }) {
    datas = toHandleParamType(datas, [{ type: "Array", action: datas => datas }], () => []);

    return (
        <div className={`hdz-list-extra ${toCheckClassName(className)}`}>
            {datas.map((data, i) => <a href="javascript:;" className="hdz-list-extra-block" onClick={data.action} key={i}>{data.text}</a>)}
            
        </div>
    )
}

function Title({ className, children }) {

    return (
        <p className={`hdz-list-title ${toCheckClassName(className)}`}>
            {children}
        </p>
    )
}


function Tags({ className, tags }) {
    tags = toHandleParamType(tags, [{ type: "Array", action: (data) => data }], () => []);
    return (
        <div className={`hdz-list-tags ${toCheckClassName(className)}`}>
            {tags.map((item) => <span>{item}</span>)}
        </div>
    )
}

function Price({ className, current, origin, highLight }) {
    return (
        <div className={`hdz-list-price ${toCheckClassName(className)}`}>
            <span style={{ color: highLight }}>{current}</span>
            <span>{origin}</span>
        </div>
    )
}
function Counter({ className, photo, action, title, labels, price, description, data }) {

    return (
        <div className={`hdz-list-counter ${toCheckClassName(className)}`}>

        </div>
    )
}

function Intro({ className, children }) {

    return (
        <p className={`hdz-list-intro ${toCheckClassName(className)}`}>
            {children}
        </p>
    )
}


HList['Item'] = Item;
HList['Item']['Image'] = Image;
HList['Item']['Content'] = Content;
HList['Item']['Content']['Title'] = Title;
HList['Item']['Content']['Tags'] = Tags;
HList['Item']['Content']['Price'] = Price;
HList['Item']['Content']['Counter'] = Counter;
HList['Item']['Content']['Intro'] = Intro;
HList['Item']['Extra'] = Extra;
export default HList;

import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { List, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';

import { LOCAL_URL } from '../config/common';

import "../style/publish.scss";

const TITLE = 'TITLE';
const PRICE = 'PRICE';

const PublishProject = (props) => {

    const { getFieldProps } = props.form;
    
    const [thisState, setState] = useState({

    });

    const toChangeStateFactor = (key) => (handler) => {
        thisState[key] = handler(thisState[key]);
        setState(Object.assign({}, thisState));
    }

    return (
        <div className="hdz-publish-project">
            fawefeawfgaewf
        </div>
    )
}



export default createForm()(PublishProject);
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal, PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';
import { LOCAL_URL } from '../config/common';


export default (props) => {
    
    const data = [{
        title: "找资金",
        className: 'project-looking-funds',
        content: 'sjfpoiajfoeawfewaf'
    }, {
        title: "江旅金融",
        className: 'project-jl-financial',
        content: '21411312987321089'
    }]

    return (
        <div className="hdz-lvyoto-project" id="project">
            <TabPanel data={data} current="江旅金融" activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
};
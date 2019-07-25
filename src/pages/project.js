import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { PullToRefresh } from 'antd-mobile';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';
import TabPanel from '../components/TabPanel';

import '../style/project.scss';

const GET_DATA_GQL = gql`{
    rates (currency: "USD") {
        currency 
        rate 
    }
}`

const LookingFunds = () => {
    const [thisState, setState] = useState({
        refreshing: false,
    });

    return (
        <Query
            query={GET_DATA_GQL}
            notifyOnNetworkStatusChange
        >
            {({ loading, error, data, refetch, networkStatus, startPolling, stopPolling }) => {
                if (networkStatus === 4) return <Loader />;
                if (loading) return <Loader />;
                if (error) return `【Error】 ${error.message}`;

                if (data.rates.length) {
                    // list = [].concat(data.rates);
                    // // 按时间排序，1为正序，2为倒序
                    // if (time % 3 !== 0) {
                    //     let handler = time % 3 - 1 === 0 ? ((a, b) => a.time - b.time) : ((a, b) => b.time - a.time);
                    //     list = list.sort(handler);
                    // }
                    // // 按金额排序，1为正序，2为倒序
                    // if (amount % 3 !== 0) {
                    //     let handler = amount % 3 - 1 === 0 ? ((a, b) => a.time - b.time) : ((a, b) => b.time - a.time);
                    //     list = list.sort(handler);
                    // }
                    // if (financing) {
                    //     list = list.filter((item) => item.financing === financing);
                    // }

                    return (
                        <div className="looking-funds">
                            <PullToRefresh
                                className="hdz-pull-refresh"
                                damping={100}
                                direction="up"
                                refreshing={thisState.refreshing}
                                onRefresh={() => {
                                    setState({ refreshing: true });
                                    setTimeout(() => {
                                        setState({ refreshing: false });
                                    }, 1000);
                                }}
                            >
                                <div className="financing-project-list">
                                    {data.rates.slice(0, 10).map((item, i) => (
                                        <div key={i} className="financing-project">fawepoifmpaewmewa{i}</div>
                                    ))}
                                </div>
                                <div className="hdz-block-large-space" onClick={() => document.querySelector('.hdz-pull-refresh .financing-project').scrollIntoView({ behavior: "smooth" })}>fawegreawhraef</div>
                            </PullToRefresh>
                        </div>
                    )
                }

            }}
        </Query>

    )
}

const JLFinancial = () => {


    return (
        <div>3240981257124</div>
    )
}

export default (props) => {
    
    const data = [{
        title: "找资金",
        className: 'project-looking-funds',
        content: <LookingFunds />
    }, {
        title: "江旅金融",
        className: 'project-jl-financial',
        content: <JLFinancial />
    }]

    return (
        <div className="hdz-lvyoto-project" id="project">
            <TabPanel data={data} activeColor="#0572E4" commonColor="#999" clickHandler={(from, to) => console.log(`from ${from} to ${to}`)} />
        </div>
    )
};
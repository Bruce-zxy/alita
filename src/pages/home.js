import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

import Loader from '../components/Loader';

const GET_DATA_GQL = gql`{
    rates (currency: "USD") {
        currency 
        rate 
    }
}`

const GET_DOGS = gql`{
    dogs {
        id
        breed
    }
}`

export default (props) => {
    console.log(props);
    
    const toRenderContentByApolloClient = ({ loading, error, data, refetch, networkStatus, startPolling, stopPolling }) => {
        if (networkStatus === 4) return <Loader />;
        if (loading) return <Loader />;
        if (error) return <p>Error :{error.message}</p>;
        console.log(loading, error, Object.assign({}, data))



        return (
            <div></div>
        )
    }

    return (
        <div className="hdz-home-container">
            <Query
                query={GET_DOGS}
                notifyOnNetworkStatusChange
            >
                {toRenderContentByApolloClient}
            </Query>
        </div>
    )
};
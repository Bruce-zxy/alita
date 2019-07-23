import React, { Fragment, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";


export default () => {


    return (
        <div className="hdz-home-container">
            <Query
                query={gql`{rates(currency: "USD"){currency rate }}`}
            >
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :{error}</p>;
                    console.log(loading, error, data)
                    if (data.rates) return data.rates.map(({ currency, rate }) => (
                        <div key={currency}>
                        <p>{currency}: {rate}</p>
                        </div>
                    ));
                    return <div></div>
                }}
            </Query>
        </div>
    )
};
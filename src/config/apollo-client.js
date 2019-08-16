import React, { Fragment} from 'react';
import ApolloClient from "apollo-boost";
import { Toast } from 'antd-mobile';

import { APOLLO_ROOT } from './common';

export default new ApolloClient({
    uri: APOLLO_ROOT,
    request: (operation) => {
        operation.setContext({
            headers: {
                apollo: true,
                application: 'frontstage',
                authorization: `Bearer ${localStorage.getItem('u_token')}`
            }
        });
    },
    onError: ({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            Toast.fail(
                <Fragment>
                    <p>【GraphQLErrors】</p>
                    {graphQLErrors.map(item => <p key={item.message}>{item.message}</p>)}
                </Fragment>
            );
        }
        if (networkError) {
            Toast.fail(
                <Fragment>
                <p>【NetworkError】</p>
                    {networkError.map(item => <p>{item.message}</p>)}
                </Fragment>
            );
        }
    },
});;
import gql from 'graphql-tag';

export const Q_FETCH_CURRENT_USER = gql`
  query fetchCurrentUser {
    me {
      id
      account
      avatar
      realname
      profile
      address
    }
  }
`;
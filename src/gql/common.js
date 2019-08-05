import { gql } from "apollo-boost";

export const Q_FETCH_CURRENT_USER = gql`
  query fetchCurrentUser {
    me {
      id
      account
      avatar
      realname
      phone
      idcard
      address
      company
      profile
      identity
      status
      org {
        id
        title
      }
    }
  }
`;
import gql from 'graphql-tag';

export const Q_FETCH_CURRENT_USER = gql`
  query fetchCurrentUser {
    me {
      id
      create_at
      update_at
      account
      password
      avatar
      realname
      phone
      idcard
      idcardA
      idcardB
      address
      company
      org_code
      business_license
      profile
      vip
      identity
      type
      status

      org {
        id
        title
      }
      area {
        id
        title
      }
      providers {
        id
        name
      }
      projects {
        id
        title
      }
      capitals {
        id
        title
      }
      apply_products {
        id
        name
      }
      apply_projects {
        id
        title
      }
      apply_capitals {
        id
        title
      }
      apply_providers {
        id
        name
      }
    }
  }
`;
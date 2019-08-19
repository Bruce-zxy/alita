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
        product {
          id
          name
          category {
            id
            title
          }
        }
      }
      apply_projects {
        project {
          id
          title
          status
          category
          cover
          creator {
            id
            realname
            phone
          }
        }
      }
      apply_capitals {
        capital {
          id
          title
          status
          category
          creator {
            id
            realname
            phone
          }
        }
      }
      apply_providers {
        provider {
          id
          name
          area {
            title
          }
          category {
            id
            title
          }
          creator {
            id
            realname
            phone
          }
        }
      }
    }
  }
`;


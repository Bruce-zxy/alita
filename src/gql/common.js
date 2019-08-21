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
        create_at
        product {
          id
          name
          cover
          category {
            id
            title
          }
        }
      }
      apply_projects {
        create_at
        project {
          id
          title
          status
          category
          cover
          create_at
          creator {
            id
            realname
            phone
          }
        }
      }
      apply_capitals {
        create_at
        capital {
          id
          title
          category
          amount
          stage {
            title
          }
          industry {
            title
          }
          type {
            title
          }
          creator {
            id
            realname
            phone
          }
        }
      }
      apply_providers {
        create_at
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
            avatar
            realname
            phone
            company
          }
        }
      }
    }
  }
`;


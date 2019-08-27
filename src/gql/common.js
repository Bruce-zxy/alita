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
        status
        logo
        slogan
        category {
          id
          title
        }
        introduction
      }
      projects {
        id
        title
        amount
        industry {
          id
          title
        }
        area {
          id
          title
        }
        category
        stage {
          id
          title
        }
        ratio {
          id
          title
        }
        withdrawal_year {
          id
          title
        }
        exit_mode {
          id
          title
        }
        risk {
          id
          title
        }
        interest {
          id
          title
        }
        occupancy_time {
          id
          title
        }
        payment
        purposes
        progress
        info
        data {
          id
          title
        }
        team_info
        advantage
        company_info
        status
        cover
        create_at
        reason
        creator {
          id
          realname
          phone
        }
      }
      capitals {
        id
        title
        industry {
          id
          title
        }
        amount
        type {
          id
          title
        } 
        area {
          id
          title
        }
        invest_area {
          id
          title
        }
        category
        equity_type {
          id
          title
        }
        stage {
          id
          title
        }
        term 
        invest_type {
          id
          title
        }
        ratio {
          id
          title
        }
        return 
        risk {
          id
          title
        }
        pledge
        discount
        pre_payment
        data {
          id
          title
        }
        info

        creator {
          id
          realname
          phone
        }
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


export const M_LEVEL_UP = gql`
mutation levelUp($data: LevelUpInput!) {
  levelUp(data: $data)
}
`

export const M_PUBLISH_PROJECT = gql`
mutation publishProject($data: ProjectInput!) {
  publishProject(data: $data)
}
`

export const M_PUBLISH_CAPITAL = gql`
mutation publishCapital($data: CapitalInput!) {
  publishCapital(data: $data)
}
`
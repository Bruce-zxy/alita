import { gql } from "apollo-boost";
import { F_ORG_FIELDS, F_ORG_RECURSIVE } from './org';

export const F_USER_FIELDS = gql`
  ${F_ORG_FIELDS}

  fragment UserFields on User {
    id
    create_at
    update_at
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
      ...OrgFields
    }
  }
`;

export const Q_GET_USERS = gql`
  ${F_USER_FIELDS}
  ${F_ORG_FIELDS}
  ${F_ORG_RECURSIVE}

  query getUsers($queryString: String!) {
    users(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...UserFields
      }
    }

    orgTrees {
      ...OrgRecursive
    }
  }
`;

export const Q_GET_USER = gql`
  ${F_USER_FIELDS}
  ${F_ORG_FIELDS}
  ${F_ORG_RECURSIVE}

  query getUser($id: String!, $queryString: String! = "") {
    user(id: $id, queryString: $queryString) {
      ...UserFields
    }

    orgTrees {
      ...OrgRecursive
    }
  }
`;

export const M_UPDATE_USER = gql`
  mutation updateUser($id: String!, $data: UserInput!) {
    updateUser(id: $id, data: $data)
  }
`;

export const M_CREATE_USER = gql`
  ${F_USER_FIELDS}

  mutation createUser($data: UserInput!) {
    createUser(data: $data) {
      ...UserFields
    }
  }
`;

export const M_DELETE_USER = gql`
  mutation deleteUser($ids: String!) {
    deleteUser(ids: $ids)
  }
`;
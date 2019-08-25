import gql from 'graphql-tag';
import { F_METADATA_FIELDS, F_METADATA_RECURSIVE } from './metadata';

export const F_CAPITAL_FIELDS = gql`
  fragment CapitalFields on Capital {
    id
    amount
    title
    contact
    phone
    company
    views
    category
    status
    update_at
    create_at
    publish_at
    info
    return
    pledge
    discount
    pre_payment
    type {
      id
      title
    }
    industry {
      id
      title
    }
    stage {
      id
      title
    }
    creator {
      id
      avatar
      hideName
      hideCompany
    }
    area {
      id
      title
    }
    equity_type {
      id
      title
    }
    invest_type {
      id
      title
    }
    invest_area {
      id
      title
    }
    risk {
      id
      title
    }
    data {
      id
      title
    }
    ratio {
      id
      title
    }
  }
`;

export const Q_GET_CAPITALS = gql`
  ${F_CAPITAL_FIELDS}
  ${F_METADATA_FIELDS}
  ${F_METADATA_RECURSIVE}

  query queryCapital($queryString: String!) {
    queryCapital(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...CapitalFields
      }
    }
    metadataTrees {
      ...MetadataRecursive
    }
  }
`;

export const Q_GET_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}
  ${F_METADATA_FIELDS}
  ${F_METADATA_RECURSIVE}

  query getCapital($id: String!, $queryString: String! = "") {
    capital(id: $id, queryString: $queryString) {
      ...CapitalFields
    }

    metadataTrees {
      ...MetadataRecursive
    }
  }
`;

export const M_UPDATE_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}

  mutation updateCapital($id: String!, $data: CapitalInput!) {
    updateCapital(id: $id, data: $data) {
      ...CapitalFields
    }
  }
`;

export const M_CREATE_CAPITAL = gql`
  ${F_CAPITAL_FIELDS}

  mutation createCapital($data: CapitalInput!) {
    createCapital(data: $data) {
      ...CapitalFields
    }
  }
`;

export const M_DELETE_CAPITAL = gql`
  mutation deleteCapital($ids: String!) {
    deleteCapital(ids: $ids)
  }
`;

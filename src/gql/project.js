import gql from 'graphql-tag';
import { F_METADATA_FIELDS, F_METADATA_RECURSIVE } from './metadata';

export const F_PROJECT_FIELDS = gql`
  fragment ProjectFields on Project {
    id
    title
    cover
    contact
    phone
    company
    views
    category
    status
    update_at
    create_at
    publish_at
    amount
    progress
    team_info
    advantage
    purposes
    info
    payment
    hideContact
    hidePhone
    hideCompany
    stage {
      id
      title
    }
    exit_mode {
      id
      title
    }
    withdrawal_year {
      id
      title
    }
    ratio {
      id
      title
    }
    data {
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
    industry {
      id
      title
    }
    area {
      id
      title
    }
    creator {
      id
      hideName
      hideCompany
      avatar
    }
    deliverable
  }
`;

export const Q_GET_PROJECTS = gql`
  ${F_PROJECT_FIELDS}

  query queryProject($queryString: String!) {
    queryProject(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...ProjectFields
      }
    }
  }
`;

export const Q_GET_PROJECT = gql`
  ${F_PROJECT_FIELDS}

  query getProject($id: String!, $queryString: String! = "") {
    project(id: $id, queryString: $queryString) {
      ...ProjectFields
    }
  }
`;

export const M_UPDATE_PROJECT = gql`
  ${F_PROJECT_FIELDS}

  mutation updateProject($id: String!, $data: ProjectInput!) {
    updateProject(id: $id, data: $data) {
      ...ProjectFields
    }
  }
`;

export const M_CREATE_PROJECT = gql`
  ${F_PROJECT_FIELDS}

  mutation createProject($data: ProjectInput!) {
    createProject(data: $data) {
      ...ProjectFields
    }
  }
`;

export const M_DELETE_PROJECT = gql`
  mutation deleteProject($ids: String!) {
    deleteProject(ids: $ids)
  }
`;

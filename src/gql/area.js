import { gql } from "apollo-boost";

export const F_AREA_FIELDS = gql`
  fragment AreaFields on Area {
    id
    title
    sort
  }
`;

export const F_AREA_RECURSIVE = gql`
  fragment AreaRecursive on Area {
    ...AreaFields
    children {
      ...AreaFields
      children {
        ...AreaFields
        children {
          ...AreaFields
          children {
            ...AreaFields
            children {
              ...AreaFields
              children {
                ...AreaFields
                children {
                  ...AreaFields
                  children {
                    ...AreaFields
                    children {
                      ...AreaFields
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const Q_GET_AREA_TREES = gql`
  ${F_AREA_FIELDS}
  ${F_AREA_RECURSIVE}

  query getAreaTrees {
    areaTrees {
      ...AreaRecursive
    }
  }
`;

export const Q_GET_AREA = gql`
  ${F_AREA_FIELDS}

  query getArea($id: String!, $queryString: String! = "") {
    area(id: $id, queryString: $queryString) {
      ...AreaFields
    }
  }
`;

export const M_UPDATE_AREA = gql`
  ${F_AREA_FIELDS}

  mutation updateArea($id: String!, $data: AreaInput!) {
    updateArea(id: $id, data: $data) {
      ...AreaFields
    }
  }
`;

export const M_CREATE_AREA = gql`
  ${F_AREA_FIELDS}

  mutation createArea($data: AreaInput!) {
    createArea(data: $data) {
      ...AreaFields
    }
  }
`;

export const M_DELETE_AREA = gql`
  mutation deleteArea($ids: String!) {
    deleteArea(ids: $ids)
  }
`;

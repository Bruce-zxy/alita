import gql from 'graphql-tag';

export const F_METADATA_FIELDS = gql`
  fragment MetadataFields on Metadata {
    id
    title
    sort
  }
`;

export const F_METADATA_RECURSIVE = gql`
  fragment MetadataRecursive on Metadata {
    ...MetadataFields
    children {
      ...MetadataFields
      children {
        ...MetadataFields
        children {
          ...MetadataFields
          children {
            ...MetadataFields
            children {
              ...MetadataFields
              children {
                ...MetadataFields
                children {
                  ...MetadataFields
                  children {
                    ...MetadataFields
                    children {
                      ...MetadataFields
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

export const Q_GET_METADATA_TREES = gql`
  ${F_METADATA_FIELDS}
  ${F_METADATA_RECURSIVE}

  query getMetadataTrees {
    findAllMetadata {
      ...MetadataRecursive
    }
  }
`;

export const Q_GET_METADATA = gql`
  ${F_METADATA_FIELDS}

  query getMetadata($id: String!, $queryString: String! = "") {
    metadata(id: $id, queryString: $queryString) {
      ...MetadataFields
    }
  }
`;

export const M_UPDATE_METADATA = gql`
  ${F_METADATA_FIELDS}

  mutation updateMetadata($id: String!, $data: MetadataInput!) {
    modifyMetadata(id: $id, data: $data) {
      ...MetadataFields
    }
  }
`;

export const M_CREATE_METADATA = gql`
  ${F_METADATA_FIELDS}

  mutation createMetadata($data: MetadataInput!) {
    newMetadata(data: $data) {
      ...MetadataFields
    }
  }
`;

export const M_DELETE_METADATA = gql`
  mutation deleteMetadata($ids: String!) {
    removeMetadata(ids: $ids)
  }
`;

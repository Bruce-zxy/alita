import gql from 'graphql-tag';
import { F_METADATA_FIELDS, F_METADATA_RECURSIVE } from './metadata';
import { F_USER_FIELDS } from './user';
import { F_PROVIDER_CATEGORY_FIELDS, F_PROVIDER_CATEGORYRECURSIVE } from './provider-category';

export const F_PROVIDER_FIELDS = gql`
  ${F_PROVIDER_CATEGORY_FIELDS}
  ${F_METADATA_FIELDS}
  ${F_USER_FIELDS}

  fragment ProviderFields on Provider {
    id
    name
    logo
    slogan
    introduction
    update_at
    create_at
    category {
      ...ProviderCategoryFields
    }
    area {
      ...MetadataFields
    }
    creator {
      ...UserFields
    }
  }
`;

export const Q_GET_PROVIDERS = gql`
  ${F_PROVIDER_FIELDS}
  ${F_PROVIDER_CATEGORYRECURSIVE}
  ${F_METADATA_RECURSIVE}

  query queryProvider($queryString: String!, $metadataRoot: String! = "") {
    queryProvider(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...ProviderFields
      }
    }

    providerCategoryTrees {
      ...ProviderCategoryRecursive
    }

    metadataDescendantsTree(root: $metadataRoot) {
      ...MetadataRecursive
    }
  }
`;

export const Q_GET_PROVIDER = gql`
  ${F_PROVIDER_FIELDS}
  ${F_PROVIDER_CATEGORYRECURSIVE}
  ${F_METADATA_RECURSIVE}

  query getProvider($id: String!, $queryString: String! = "", $metadataRoot: String! = "") {
    provider(id: $id, queryString: $queryString) {
      ...ProviderFields
    }

    providerCategoryTrees {
      ...ProviderCategoryRecursive
    }

    metadataDescendantsTree(root: $metadataRoot) {
      ...MetadataRecursive
    }
  }
`;

export const M_UPDATE_PROVIDER = gql`
  ${F_PROVIDER_FIELDS}

  mutation updateProvider($id: String!, $data: ProviderInput!) {
    updateProvider(id: $id, data: $data) {
      ...ProviderFields
    }
  }
`;

export const M_CREATE_PROVIDER = gql`
  ${F_PROVIDER_FIELDS}

  mutation createProvider($data: ProviderInput!) {
    createProvider(data: $data) {
      ...ProviderFields
    }
  }
`;

export const M_DELETE_PROVIDER = gql`
  mutation deleteProvider($ids: String!) {
    deleteProvider(ids: $ids)
  }
`;

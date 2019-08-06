import gql from 'graphql-tag';

export const F_PROVIDER_CATEGORY_FIELDS = gql`
  fragment ProviderCategoryFields on ProviderCategory {
    id
    title
    sort
  }
`;

export const F_PROVIDER_CATEGORYRECURSIVE = gql`
  fragment ProviderCategoryRecursive on ProviderCategory {
    ...ProviderCategoryFields
    children {
      ...ProviderCategoryFields
      children {
        ...ProviderCategoryFields
        children {
          ...ProviderCategoryFields
          children {
            ...ProviderCategoryFields
            children {
              ...ProviderCategoryFields
              children {
                ...ProviderCategoryFields
                children {
                  ...ProviderCategoryFields
                  children {
                    ...ProviderCategoryFields
                    children {
                      ...ProviderCategoryFields
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

export const Q_GET_PROVIDER_CATEGORY_TREES = gql`
  ${F_PROVIDER_CATEGORY_FIELDS}
  ${F_PROVIDER_CATEGORYRECURSIVE}

  query getProviderCategoryTrees {
    providerCategoryTrees {
      ...ProviderCategoryRecursive
    }
  }
`;

export const Q_GET_PROVIDER_CATEGORY = gql`
  ${F_PROVIDER_CATEGORY_FIELDS}

  query getProviderCategory($id: String!, $queryString: String! = "") {
    providerCategory(id: $id, queryString: $queryString) {
      ...ProviderCategoryFields
    }
  }
`;

export const M_UPDATE_PROVIDER_CATEGORY = gql`
  ${F_PROVIDER_CATEGORY_FIELDS}

  mutation updateProviderCategoryInput($id: String!, $data: ProviderCategoryInput!) {
    updateProviderCategory(id: $id, data: $data) {
      ...ProviderCategoryFields
    }
  }
`;

export const M_CREATE_PROVIDER_CATEGORY = gql`
  ${F_PROVIDER_CATEGORY_FIELDS}

  mutation createProviderCategory($data: ProviderCategoryInput!) {
    createProviderCategory(data: $data) {
      ...ProviderCategoryFields
    }
  }
`;

export const M_DELETE_PROVIDER_CATEGORY = gql`
  mutation deleteProviderCategory($ids: String!) {
    deleteProviderCategory(ids: $ids)
  }
`;

import gql from 'graphql-tag';

export const F_PRODUCT_CATEGORY_FIELDS = gql`
  fragment ProductCategoryFields on ProductCategory {
    id
    title
    sort
  }
`;

export const F_PRODUCT_CATEGORYRECURSIVE = gql`
  fragment ProductCategoryRecursive on ProductCategory {
    ...ProductCategoryFields
    children {
      ...ProductCategoryFields
      children {
        ...ProductCategoryFields
        children {
          ...ProductCategoryFields
          children {
            ...ProductCategoryFields
            children {
              ...ProductCategoryFields
              children {
                ...ProductCategoryFields
                children {
                  ...ProductCategoryFields
                  children {
                    ...ProductCategoryFields
                    children {
                      ...ProductCategoryFields
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

export const Q_GET_PRODUCT_CATEGORY_TREES = gql`
  ${F_PRODUCT_CATEGORY_FIELDS}
  ${F_PRODUCT_CATEGORYRECURSIVE}

  query getProductCategoryTrees {
    productCategoryTrees {
      ...ProductCategoryRecursive
    }
  }
`;

export const Q_GET_PRODUCT_CATEGORY = gql`
  ${F_PRODUCT_CATEGORY_FIELDS}

  query getProductCategory($id: String!, $queryString: String! = "") {
    productCategory(id: $id, queryString: $queryString) {
      ...ProductCategoryFields
    }
  }
`;

export const M_UPDATE_PRODUCT_CATEGORY = gql`
  ${F_PRODUCT_CATEGORY_FIELDS}

  mutation updateProductCategoryInput($id: String!, $data: ProductCategoryInput!) {
    updateProductCategory(id: $id, data: $data) {
      ...ProductCategoryFields
    }
  }
`;

export const M_CREATE_PRODUCT_CATEGORY = gql`
  ${F_PRODUCT_CATEGORY_FIELDS}

  mutation createProductCategory($data: ProductCategoryInput!) {
    createProductCategory(data: $data) {
      ...ProductCategoryFields
    }
  }
`;

export const M_DELETE_PRODUCT_CATEGORY = gql`
  mutation deleteProductCategory($ids: String!) {
    deleteProductCategory(ids: $ids)
  }
`;

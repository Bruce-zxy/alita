import gql from 'graphql-tag';
import { F_PRODUCT_CATEGORY_FIELDS, F_PRODUCT_CATEGORYRECURSIVE } from './product-category';

export const F_PRODUCT_FIELDS = gql`
  ${F_PRODUCT_CATEGORY_FIELDS}

  fragment ProductFields on Product {
    id
    name
    cover
    flowsheet
    flows
    slogan
    advantage
    introduction
    sort
    update_at
    create_at
    category {
      ...ProductCategoryFields
    }
  }
`;

export const Q_GET_PRODUCTS = gql`
  ${F_PRODUCT_FIELDS}
  ${F_PRODUCT_CATEGORYRECURSIVE}

  query queryProduct($queryString: String!) {
    queryProduct(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...ProductFields
      }
    }

    productCategoryTrees {
      ...ProductCategoryRecursive
    }
  }
`;

export const Q_GET_PRODUCT = gql`
  ${F_PRODUCT_FIELDS}
  ${F_PRODUCT_CATEGORYRECURSIVE}

  query getProduct($id: String!, $queryString: String! = "") {
    product(id: $id, queryString: $queryString) {
      ...ProductFields
    }

    productCategoryTrees {
      ...ProductCategoryRecursive
    }
  }
`;

export const M_UPDATE_PRODUCT = gql`
  ${F_PRODUCT_FIELDS}

  mutation updateProduct($id: String!, $data: ProductInput!) {
    updateProduct(id: $id, data: $data) {
      ...ProductFields
    }
  }
`;

export const M_CREATE_PRODUCT = gql`
  ${F_PRODUCT_FIELDS}

  mutation createProduct($data: ProductInput!) {
    createProduct(data: $data) {
      ...ProductFields
    }
  }
`;

export const M_DELETE_PRODUCT = gql`
  mutation deleteProduct($ids: String!) {
    deleteProduct(ids: $ids)
  }
`;

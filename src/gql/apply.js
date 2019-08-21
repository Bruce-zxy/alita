import gql from 'graphql-tag';

export const M_APPLY_CAPITALS = gql`

  mutation applyCapitals($id: String!) {
    applyCapitals(id: $id)
  }
`;

export const M_APPLY_PROJECTS = gql`

  mutation applyProjects($id: String!) {
    applyProjects(id: $id)
  }
`;

export const M_APPLY_PROVIDERS = gql`

  mutation applyProviders($id: String!) {
    applyProviders(id: $id)
  }
`;

export const M_APPLY_PRODUCTS = gql`

  mutation applyProducts($id: String!) {
    applyProducts(id: $id)
  }
`;
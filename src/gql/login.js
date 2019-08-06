import gql from 'graphql-tag';

export const M_LOGIN = gql`
  mutation login($loginData: LoginInput!) {
    login(loginData: $loginData) {
      token
    }
  }
`;

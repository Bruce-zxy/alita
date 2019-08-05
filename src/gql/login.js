import { gql } from "apollo-boost";

export const M_LOGIN = gql`
  mutation login($loginData: LoginInput!) {
    login(loginData: $loginData) {
      token
    }
  }
`;

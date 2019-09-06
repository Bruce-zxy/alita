import gql from 'graphql-tag';

export const M_APPROVAL_CAPITAL = gql`

    mutation approvalCapital($data: CapitalInput!) {
        result: approvalCapital(data: $data)
    }
`;


export const M_APPROVAL_PROJECT = gql`

    mutation approvalProject($data: ProjectInput!) {
        result: approvalProject(data: $data)
    }
`;

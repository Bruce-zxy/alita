import { gql } from "apollo-boost";

export const F_ARTICLE_CATEGORY_FIELDS = gql`
  fragment ArticleCategoryFields on ArticleCategory {
    id
    title
    sort
  }
`;

export const F_ARTICLE_FIELDS = gql`
  ${F_ARTICLE_CATEGORY_FIELDS}

  fragment ArticleFields on Article {
    id
    title
    author
    source
    cover
    is_top
    is_published
    sort
    summary
    text
    publish_at
    category {
      ...ArticleCategoryFields
    }
  }
`;

export const F_ARTICLE_CATEGORYRECURSIVE = gql`
  fragment ArticleCategoryRecursive on ArticleCategory {
    ...ArticleCategoryFields
    children {
      ...ArticleCategoryFields
      children {
        ...ArticleCategoryFields
        children {
          ...ArticleCategoryFields
          children {
            ...ArticleCategoryFields
            children {
              ...ArticleCategoryFields
              children {
                ...ArticleCategoryFields
                children {
                  ...ArticleCategoryFields
                  children {
                    ...ArticleCategoryFields
                    children {
                      ...ArticleCategoryFields
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

export const F_ORG_FIELDS = gql`
  fragment OrgFields on Org {
    id
    title
    sort
  }
`;

export const F_ORG_RECURSIVE = gql`
  fragment OrgRecursive on Org {
    ...OrgFields
    children {
      ...OrgFields
      children {
        ...OrgFields
        children {
          ...OrgFields
          children {
            ...OrgFields
            children {
              ...OrgFields
              children {
                ...OrgFields
                children {
                  ...OrgFields
                  children {
                    ...OrgFields
                    children {
                      ...OrgFields
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

export const F_USER_FIELDS = gql`
  ${F_ORG_FIELDS}

  fragment UserFields on User {
    id
    create_at
    update_at
    account
    avatar
    realname
    phone
    idcard
    address
    company
    profile
    identity
    status
    org {
      ...OrgFields
    }
  }
`;

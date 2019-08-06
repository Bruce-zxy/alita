import gql from 'graphql-tag';
import { F_ARTICLE_CATEGORY_FIELDS, F_ARTICLE_CATEGORYRECURSIVE } from './article-category';

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
    update_at
    create_at
    category {
      ...ArticleCategoryFields
    }
  }
`;

export const Q_GET_ARTICLES = gql`
  ${F_ARTICLE_FIELDS}
  ${F_ARTICLE_CATEGORYRECURSIVE}

  query queryArticle($queryString: String!) {
    queryArticle(queryString: $queryString) {
      total
      page
      pageCount
      data {
        ...ArticleFields
      }
    }

    articleCategoryTrees {
      ...ArticleCategoryRecursive
    }
  }
`;

export const Q_GET_ARTICLE = gql`
  ${F_ARTICLE_FIELDS}
  ${F_ARTICLE_CATEGORYRECURSIVE}

  query getArticle($id: String!, $queryString: String! = "") {
    article(id: $id, queryString: $queryString) {
      ...ArticleFields
    }

    articleCategoryTrees {
      ...ArticleCategoryRecursive
    }
  }
`;

export const M_UPDATE_ARTICLE = gql`
  ${F_ARTICLE_FIELDS}

  mutation updateArticle($id: String!, $data: ArticleInput!) {
    updateArticle(id: $id, data: $data) {
      ...ArticleFields
    }
  }
`;

export const M_CREATE_ARTICLE = gql`
  ${F_ARTICLE_FIELDS}

  mutation createArticle($data: ArticleInput!) {
    createArticle(data: $data) {
      ...ArticleFields
    }
  }
`;

export const M_DELETE_ARTICLE = gql`
  mutation deleteArticle($ids: String!) {
    deleteArticle(ids: $ids)
  }
`;

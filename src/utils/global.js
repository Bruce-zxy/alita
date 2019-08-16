import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { isArray, isEmpty } from 'lodash';
import { Q_FETCH_CURRENT_USER } from '../gql';

export const getTreeData = (data, root) =>
  data.map(item => {
    item.__typename && delete item.__typename;

    if (item.children) {
      return {
        ...item,
        key: item.id,
        value: item.id,
        root,
        children: getTreeData(item.children, root || item),
        dataRef: item,
      };
    }

    return {
      ...item,
      key: item.id,
      value: item.id,
      root,
      children: [],
      dataRef: item,
    };
  });

export const mergeParams = (params, partialParams) => {
  let newParams = { ...params };

  const keys = Object.keys(partialParams);

  keys.forEach(key => {
    if (partialParams[key]) {
      newParams[key] = partialParams[key];

      if (['filter', 'or', 'join', 'sort'].includes[key]) {
        if (!!params[key]) {

          const oldParams = params[key]
            .filter(item => partialParams[key].findIndex(temp => temp.field === item.field) < 0)
            .map(item => item);

          if (oldParams.length > 0) {
            newParams[key] = [...newParams[key], ...oldParams];
          }
        }
      }

      if (isArray(newParams[key])) {
        if (['filter', 'or'].includes(key)) {
          newParams[key] = newParams[key].filter(item => !isEmpty(item.value));
        }

        if (['join', 'sort'].includes(key)) {
          newParams[key] = newParams[key].filter(item => !isEmpty(item.field));
        }
      }
    }
  });

  return newParams;
};

export const buildingQuery = params => {
  return RequestQueryBuilder.create(params).query();
};

export const IdentityMaps = {
  user: '后台用户',
  investor: '资金方',
  financer: '项目方',
  provider: '服务商',
  tourist: '游客',
};

export const UserStatusMaps = {
  0: '正常',
  1: '待审核',
  2: '已驳回',
  3: '已审核',
  4: '已作废',
};


export const toFetchCurrentUser = async (client) => {
  const defaultVariables = {
    join: [{ field: 'apply_capitals' }, { field: 'apply_products' }, { field: 'apply_projects' }, { field: 'apply_providers' }],
  };
  const result = await client.query({
    query: Q_FETCH_CURRENT_USER,
    fetchPolicy: "no-cache",
    variables: { queryString: buildingQuery(defaultVariables) }
  });
  if (result && result.data && result.data.me) {
    localStorage.setItem('u_user', JSON.stringify(result.data.me));
    return result.data.me;
  } else {
    return null;
  }
}
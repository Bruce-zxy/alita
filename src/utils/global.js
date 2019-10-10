import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { isArray, isEmpty } from 'lodash';
import { API_ROOT, APOLLO_ROOT } from '../config/common';
import { Q_FETCH_CURRENT_USER, Q_GET_METADATA_TREES, Q_GET_PROVIDER_CATEGORY_TREES } from '../gql';
import client from '../config/apollo-client';

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


export const Fetch = (url, body) => {
  let option = {
    method: "GET",
    headers: new Headers({
      'Content-Type': 'application/json',
      'authorization': `Bearer ${localStorage.getItem('u_token')}`
    })
  };
  if (body) {
    option.method = "POST";
    option.body = JSON.stringify(body);
  }
  return fetch(url, option)
}

export const Upload = (url, formData) => fetch(url, {
  method: "POST",
  headers: new Headers({
    'authorization': `Bearer ${localStorage.getItem('u_token')}`
  }),
  body: formData
})

export const toFetchCurrentUser = async (client) => {
  const result = await client.query({
    query: Q_FETCH_CURRENT_USER,
    fetchPolicy: "no-cache"
  });
  if (result && result.data && result.data.me) {
    localStorage.setItem('u_user', JSON.stringify(result.data.me));
    return result.data.me;
  } else {
    if (result && result.errors && result.errors.extensions) {
      return window.location.replace('/signin');
    }
    return null;
  }
}



export const toTransformAreaTreeProps = (data, map) => data.map(node => {
  let node_object = {
    label: node[map.key || 'key'],
    value: node[map.value || 'value']
  }
  if (node.children) {
    node_object[map.children || 'children'] = toTransformAreaTreeProps(node.children, map);
  }
  return node_object;
});

export const toGetLevel = (data) => {
  let max = 0
  function each(data, level) {
    data.forEach(e => {
      if (level > max) {
        max = level
      }
      if (e.children.length > 0) {
        each(e.children, level + 1)
      }
    })
  }
  each(data, 1)
  return max;
}

export const initMetadata = async () => {
  if (!sessionStorage.getItem('metadata')) {
    const defaultVariables = {
      page: 0,
      limit: 1000,
      join: [{ field: 'category' }],
      sort: [{ field: 'sort', order: 'DESC' }, { field: 'create_at', order: 'DESC' }],
    };

    const metadata = await client.mutate({
      mutation: Q_GET_METADATA_TREES,
      variables: {
        queryString: buildingQuery(defaultVariables)
      },
      // update: (proxy, { data }) => {
      //   if (data && data.metadataTrees) {
      //     sessionStorage.setItem('metadata', JSON.stringify(data.metadataTrees));
      //   }
      // }
    });
    if (metadata.data && metadata.data.metadataTrees) {
      sessionStorage.setItem('metadata', JSON.stringify(metadata.data.metadataTrees));
    }
  }
  if (!sessionStorage.getItem('provider_metadata')) {
    const providerMetadata = await client.mutate({
      mutation: Q_GET_PROVIDER_CATEGORY_TREES,
      // update: (proxy, { data }) => {
      //   if (data && data.providerCategoryTrees) {
      //     sessionStorage.setItem('provider_metadata', JSON.stringify(data.providerCategoryTrees));
      //   }
      // }
    });
    if (providerMetadata.data && providerMetadata.data.providerCategoryTrees) {
      sessionStorage.setItem('provider_metadata', JSON.stringify(providerMetadata.data.providerCategoryTrees));
    }
  }
  return true;
}

export const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

export const toFindAreaTree = (tree, target) => {
  let key = Object.keys(target).shift();
  let val = Object.values(target).shift();
  let isGet = false;
  let retNode = null;
  const deepSearch = (tree) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].children && tree[i].children.length > 0) {
        deepSearch(tree[i].children);
      }
      if (val === tree[i][key] || isGet) {
        isGet || (retNode = tree[i]);
        isGet = true;
        break;
      }
    }
  }
  deepSearch(tree);
  return retNode;
}

export const toGetParentArrayByChildNode = (tree, target) => {
  let key = Object.keys(target).shift();
  let val = target[key];
  for (let treeNode of tree) {
    if (treeNode[key] === val) return [treeNode];
    if (treeNode.children) {
      let childNode = toGetParentArrayByChildNode(treeNode.children, target);
      if (childNode) {
        return [treeNode].concat(childNode);
      };
    }
  }
}

export const asyncEffectHandler = async (fn) => await fn();

export const toSetWeChatShareConfig = async (title, desc, img) => {
  const result = await fetch(`${API_ROOT}/wechat/signature`).then(res => res.json());
  if (result.signature) {
    const {
      nonceStr,
      signature,
      timestamp,
      appId
    } = result;
    window.wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList: ["checkJsApi", "updateAppMessageShareData", "updateTimelineShareData","onMenuShareAppMessage","onMenuShareTimeline"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    window.wx.ready(function () {
      window.wx.updateAppMessageShareData({
        title: title || '旅游项目通', // 分享标题
        link: window.location.href, // 分享链接
        imgUrl: img || 'https://www.lvyoto.com/static/img/share-logo.png', // 分享图标
        desc: desc || document.querySelector('meta[name="description"]').content, // 分享描述
      });
      //朋友
      window.wx.updateTimelineShareData({
        title: title || '旅游项目通', // 分享标题
        link: window.location.href, // 分享链接
        imgUrl: img || 'https://www.lvyoto.com/static/img/share-logo.png', // 分享图标
      });
    });
  }
}
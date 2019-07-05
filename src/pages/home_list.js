import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as _ from 'lodash';
import * as moment from 'moment';

import superFetch from '../lib/api';
import ShopContext from '../context/shop';
import config from '../config/common';


const { LOCAL_URL } = config;

const latest_activities = [{
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: '/'
}, {
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: '/'
}, {
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: '/'
}];

const training_notice = [{
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效',
  link: ''
}];

const toRenderActivityComponent = (data) => {
  if (Object.prototype.toString.call(data) !== '[object Array]' || data.length === 0) {
    return (
      <div className="latest-activity-list">
        <p className="list-empty">暂无此分类数据</p>
      </div>
    )
  } else {
    return (
      <div className="latest-activity-list">
        {data.map((item, i) => (
          <div className="latest-activity-item-container" key={i}>
            <Link className="latest-activity-item" to={`${LOCAL_URL.HOME_DETAIL}/${item.id}`}>
              <img src={item.image} alt='图片已失效' />
              <p className="activity-name">{item.name}</p>
              <p className="activity-date"><i className="iconfont iconshijian"></i>{item.date}</p>
            </Link>
          </div>
        ))}
      </div>
    )
  }
}

const toRenderTrainingComponent = (data) => {
  if (Object.prototype.toString.call(data) !== '[object Array]' || data.length === 0) {
    return (
      <div className="training-notice-list">
        <p className="list-empty">暂无此分类数据</p>
      </div>
    )
  } else {
    return (
      <div className="training-notice-list">
        {data.map((item, i) => (
          <div className="training-notice-item-container" key={i}>
            <Link className="training-notice-item" to={`${LOCAL_URL.HOME_DETAIL}/${item.id}`}>
              <div className="training-left">
                <p className="training-name">{item.name}</p>
                <p className="training-description">{item.description}</p>
              </div>
              <div className="training-right">
                <img src={item.image} alt='图片已失效' />
                <p className="training-date">{item.date}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  }
}

const toRender = {
  'latest_activity': toRenderActivityComponent,
  'activity_notice': toRenderActivityComponent,
  'training_notice': toRenderTrainingComponent,
  'latest_recruit': toRenderTrainingComponent
}

const category = {
  'latest_activity': '最新活动',
  'activity_notice': '活动通知',
  'training_notice': '培训通知',
  'latest_recruit': '最新招募'
}

export default ({ match }) => {
  const [thisState, setState] = useState([]);

  const shopContext = useContext(ShopContext);
  const { news_type } = match.params;
  let category_id = '';
  if (shopContext.category[1]) {
    category_id = _.find(_.find(shopContext.category, { name: "通知" }).children, { name: category[news_type] }).id;
  }

  useEffect(() => {
    (async () => {
      if (shopContext.category[1]) {
        const res = await superFetch.get(`/content/list?category=${category_id}&pageSize=100`);
        console.log(res);
        if (res[1]) {
          setState(res[0].map(item => ({
            id: item.id,
            name: item.title,
            description: item.summary,
            date: moment(item.publish_at).format('YYYY-MM-DD HH:mm:ss'),
            image: item.thumbnailPath,
            link: `${LOCAL_URL['HOME_DETAIL']}/${item.id}`
          })));
        }
      }
    })();
  }, [shopContext.category[0]]);

  return (
    <div>
      {toRender[news_type](thisState)}
    </div>
  )
}
 
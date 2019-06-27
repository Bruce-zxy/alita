import React from 'react';
import * as _ from 'lodash';

// import ShopContext from '../context/shop';

import config from '../config/common';

const { LOCAL_URL } = config;

const latest_activities = [{
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: '/'
}, {
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: '/'
}, {
  id: 1,
  name: '心态三天为公益活动募捐20多万，网友：热爱公益的主播值得支持！',
  date: '2019-06-25',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: '/'
}];

const training_notice = [{
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}, {
  id: 1,
  name: '父亲节感恩之旅 超越爱公益活动走进鼓楼区特殊教育学校',
  description: '6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动6月16日上午，2019“超越·爱”中超联赛公益系列活动，“超越·爱专项基金公益系列活动',
  date: '2019-06-17',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image',
  link: ''
}];

const toRenderActivityComponent = (data) => {
  if (Object.prototype.toString.call(data) !== '[object Array]') {
    return <div className="latest-activity-list"></div>
  } else {
    return (
      <div className="latest-activity-list">
        {data.map((item, i) => (
          <div className="latest-activity-item-container" key={i}>
            <a className="latest-activity-item" href={`${LOCAL_URL.HOME_DETAIL}/${item.id}`}>
              <img src={item.image} alt='placeholder+image' />
              <p className="activity-name">{item.name}</p>
              <p className="activity-date"><i className="iconfont iconshijian"></i>{item.date}</p>
            </a>
          </div>
        ))}
      </div>
    )
  }
}

const toRenderTrainingComponent = (data) => {
  if (Object.prototype.toString.call(data) !== '[object Array]') {
    return <div className="training-notice-list"></div>
  } else {
    return (
      <div className="training-notice-list">
        {data.map((item, i) => (
          <div className="training-notice-item-container" key={i}>
            <a className="training-notice-item" href={`${LOCAL_URL.HOME_DETAIL}/${item.id}`}>
              <div className="training-left">
                <p className="training-name">{item.name}</p>
                <p className="training-description">{item.description}</p>
              </div>
              <div className="training-right">
                <img src={item.image} alt='placeholder+image' />
                <p className="training-date">{item.date}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    )
  }
}

const toRender = {
  'latest_activity': toRenderActivityComponent(latest_activities),
  'training_notice': toRenderTrainingComponent(training_notice)
}

export default ({ match }) => {

  const { news_type } = match.params;

  return (
    <div>
      {toRender[news_type]}
    </div>
  )
}
 
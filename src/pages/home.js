import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import Carousel from '../components/Carousel';
import Swiper from '../components/Swiper';

import ShopContext from '../context/shop';

import config from '../lib/config';

const gPageUrl = config.LOCAL_URL;

const navi_list = [{
  name: '最新活动',
  link: gPageUrl['LATEST_ACTIVITY'],
  icon: 'iconqizhi',
  background: ['#FF6F70', '#FF916D']
}, {
  name: '活动通知',
  link: gPageUrl['ACTIVITY_NOTICE'],
  icon: 'icontongzhi',
  background: ['#FFAF31', '#FFDA40']
}, {
  name: '培训通知',
  link: gPageUrl['TRAINING_NOTICE'],
  icon: 'iconpeixuns',
  background: ['#5593F8', '#6DC6FF']
}, {
  name: '最新招募',
  link: gPageUrl['LATEST_RECRUIT'],
  icon: 'iconzhaomu',
  background: ['#30DC8B', '#57F186']
}]

const function_list = [{
  name: '注册成为志愿者',
  name_color: 'rgba(255, 111, 112, 1)',
  ename: 'REGISTERED', 
  ename_color: 'rgba(255, 111, 112, .5)',
  icon: 'iconzhuce',
  background: '#FFEFEF'
}, {
  name: '查看服务记录',
  name_color: 'rgba(255,175,49,1)',
  ename: 'RECORD',
  ename_color: 'rgba(255,175,49,.5)',
  icon: 'iconjilu',
  background: '#FEF0D9'
}, {
  name: '积分兑换',
  name_color: 'rgba(85,147,248,1)',
  ename: 'INTEGRAL',
  ename_color: 'rgba(85,147,248,.5)',
  icon: 'iconjifen',
  background: '#E8EDF5'
}]

export default (props) => {

  const shopContext = useContext(ShopContext);
  let carousel = [];
  let activity_list = [];
  let functions = {};

  if (shopContext.carousel[1]) {
    carousel = [].concat(_.find(shopContext.carousel[0], { token: '首页轮播' }).carousels.sort((a, b) => a.sort - b.sort).map(item => ({
      link: item.url,
      ...item
    })))
  }

  if (shopContext.category[1]) {
    const category_id = _.find(_.find(shopContext.category, { name: "通知" }).children, { name: "最新活动" }).id;
    const function_id = _.find(shopContext.category, { name: "实践中心" }).id;
    
    if (shopContext.content[0]) {
      activity_list = [].concat(shopContext.content[0].filter(content => content.category && content.category.id === category_id)).map(content => ({
        id: content.id,
        name: content.title,
        image: content.thumbnailPath
      }));
      functions = [].concat(shopContext.content[0].filter(content => content.category && content.category.id === function_id).sort((a,b) => a.sort - b.sort));
    }
  }

  console.log(props);
  
  return (
    <Fragment>
      <Carousel list={carousel} infinite={false} />
      <div className="hdz-navi-container">
        <div className="hdz-navi-list">
          {navi_list.map(item => (
            <Link to={item.link} className="hdz-navi-item" key={item.name}>
              <span style={{ backgroundImage: `linear-gradient(-45deg, ${item.background[0]} 0%, ${item.background[1]} 100%)`, boxShadow: `0 1px 2px 0 ${item.background[0]}`  }}>
                <i className={`iconfont ${item.icon}`}></i>
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="hdz-block-space"></div>

      <div className="hdz-function-area">
        <p>了解实践中心</p>
        <Swiper 
          className="function-swiper"
          list={function_list}
          config={{
            slidesPerView: 2.5
          }}
          render={(item, i) => (
            <Link to={`${gPageUrl['HOME_DETAIL']}/${functions[i] ? functions[i].id : 'none'}`} className="function-swiper-item" style={{ background: item.background }}>
              <p style={{ color: item.name_color }}>{item.name}</p>
              <p style={{ color: item.ename_color }}>{item.ename}</p>
              <p><i className={`iconfont ${item.icon}`} style={{ color: item.ename_color }}></i></p>
            </Link>
          )}
        />
      </div>
      <div className="hdz-block-space"></div>

      <div className="hdz-hot-activity">
        <p>
          <span>热门活动</span>
          <Link to={gPageUrl['LATEST_ACTIVITY']}>更多活动</Link>
        </p>
        <div className="hot-activity-list">
          {activity_list.map((item, i) => (
            <Link className="activity_list_item" key={i} to={`${gPageUrl['HOME_DETAIL']}/${item.id}`}>
              <img src={item.image} alt='图片已失效' />
              <p>{item.name}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="hdz-block-space"></div>
    </Fragment>
  )
}
 
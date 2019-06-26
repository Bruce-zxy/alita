import React, { Fragment } from 'react';

// import ShopContext from '../context/shop';

import Carousel from '../components/Carousel';
import Swiper from '../components/Swiper';

import config from '../lib/config';

const gPageUrl = config.LOCAL_URL;

const carousel_list = [{
  id: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=1'
}, {
  id: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=2'
}, {
  id: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=3'
}, {
  id: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=4'
}]

const navi_list = [{
  name: '最新活动',
  link: gPageUrl['LATEST_ACTIVITY'],
  icon: 'iconqizhi',
  background: ['#FF6F70', '#FF916D']
}, {
  name: '活动通知',
  link: '',
  icon: 'icontongzhi',
  background: ['#FFAF31', '#FFDA40']
}, {
  name: '培训通知',
  link: gPageUrl['TRAINING_NOTICE'],
  icon: 'iconpeixuns',
  background: ['#5593F8', '#6DC6FF']
}, {
  name: '最新招募',
  link: '',
  icon: 'iconzhaomu',
  background: ['#30DC8B', '#57F186']
}]

const function_list = [{
  name: '注册成为志愿者',
  name_color: 'rgba(255, 111, 112, 1)',
  ename: 'REGISTERED', 
  ename_color: 'rgba(255, 111, 112, .5)',
  icon: 'iconzhuce',
  background: '#FFEFEF',
  link: gPageUrl['VOLUNTEER_APPLY']
}, {
  name: '查看服务记录',
  name_color: 'rgba(255,175,49,1)',
  ename: 'RECORD',
  ename_color: 'rgba(255,175,49,.5)',
  icon: 'iconjilu',
  background: '#FEF0D9',
  link: '/'
}, {
  name: '积分兑换',
  name_color: 'rgba(85,147,248,1)',
  ename: 'INTEGRAL',
  ename_color: 'rgba(85,147,248,.5)',
  icon: 'iconjifen',
  background: '#E8EDF5',
  link: gPageUrl['SCORES']
}]

const activity_list = [{
  name: '世界呼吸日 | 娄底百余志愿者开展“一呼百行”公益徒步活动',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
}, {
  name: '世界呼吸日 | 娄底百余志愿者开展“一呼百行”公益徒步活动',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
}, {
  name: '世界呼吸日 | 娄底百余志愿者开展“一呼百行”公益徒步活动',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
}, {
  name: '世界呼吸日 | 娄底百余志愿者开展“一呼百行”公益徒步活动',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
}, {
  name: '世界呼吸日 | 娄底百余志愿者开展“一呼百行”公益徒步活动',
  image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image'
}]

export default (props) => {

  return (
    <Fragment>
      
      <Carousel list={carousel_list} />
      <div className="hdz-navi-container">
        <div className="hdz-navi-list">
          {navi_list.map(item => (
            <a href={item.link} className="hdz-navi-item" key={item.name}>
              <span style={{ backgroundImage: `linear-gradient(-45deg, ${item.background[0]} 0%, ${item.background[1]} 100%)`, boxShadow: `0 1px 2px 0 ${item.background[0]}`  }}>
                <i className={`iconfont ${item.icon}`}></i>
              </span>
              <span>{item.name}</span>
            </a>
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
            <a href={item.link} className="function-swiper-item" style={{ background: item.background }}>
              <p style={{ color: item.name_color }}>{item.name}</p>
              <p style={{ color: item.ename_color }}>{item.ename}</p>
              <p><i className={`iconfont ${item.icon}`} style={{ color: item.ename_color }}></i></p>
            </a>
          )}
        />
      </div>
      <div className="hdz-block-space"></div>

      <div className="hdz-hot-activity">
        <p>
          <span>热门活动</span>
          <a>更多活动</a>
        </p>
        <div className="hot-activity-list">
          {activity_list.map((item, i) => (
            <div className="activity_list_item" key={i}>
              <img src={item.image} alt='placeholder+image' />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="hdz-block-space"></div>
    </Fragment>
  )
}
 
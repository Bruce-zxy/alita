import React, {Fragment, useContext, useEffect, useRef } from 'react';

// import ShopContext from '../context/shop';

// import SearchBar from '../components/SearchBar';
// import NoticeBar from '../components/NoticeBar';
// import HotImage from '../components/Image/HotImage';
// import BasicImage from '../components/Image/BasicImage';
// import PlaceHolder from '../components/PlaceHolder';
import Carousel from '../components/Carousel';
// import Grid from '../components/Grid';
// import List from '../components/List';

const carousel_list = [{
  name: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=1'
}, {
  name: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=2'
}, {
  name: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=3'
}, {
  name: '1',
  link: 'javascript:;',
  image: 'http://dummyimage.com/1355x535/4d494d/686a82.gif&text=4'
}]

const navi_list = [{
  name: '最新活动',
  link: '/app/weshop/mainpage/home/latest_activity',
  icon: 'iconqizhi',
  background: ['#FF6F70', '#FF916D']
}, {
  name: '活动通知',
  link: '',
  icon: 'icontongzhi',
  background: ['#FFAF31', '#FFDA40']
}, {
  name: '培训通知',
  link: '/app/weshop/mainpage/home/training_notice',
  icon: 'iconpeixuns',
  background: ['#5593F8', '#6DC6FF']
}, {
  name: '最新招募',
  link: '',
  icon: 'iconzhaomu',
  background: ['#30DC8B', '#57F186']
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
      

    </Fragment>
  )
}
 
import React from 'react';


import '../style/service.scss';


export default (props) => {




    return (
        <div className="hdz-service-detail">
            <div className="service-detail-banner">
                <img src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
            </div>
            <div className="service-detail">
                <img className="service-detail-logo" src='http://dummyimage.com/800x600/4d494d/686a82.gif&text=placeholder+image' alt='placeholder+image' />
                <p className="service-detail-title">江西风景独好传播运营有限责任公司</p>
                <p className="service-detail-type">
                    <i className="iconfont iconleibie"></i>
                    <span>机构类别：宣传机构</span>
                </p>
                <p className="service-detail-location">
                    <i className="iconfont icondidian"></i>
                    <span>所在地：江西</span>
                </p>
                <div className="service-detail-content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus laboriosam dicta enim corporis nemo dolorum ut minima, sequi voluptatem, recusandae dignissimos aliquam laborum laudantium repellat qui suscipit. Placeat, accusantium! Accusantium?</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus laboriosam dicta enim corporis nemo dolorum ut minima, sequi voluptatem, recusandae dignissimos aliquam laborum laudantium repellat qui suscipit. Placeat, accusantium! Accusantium?</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus laboriosam dicta enim corporis nemo dolorum ut minima, sequi voluptatem, recusandae dignissimos aliquam laborum laudantium repellat qui suscipit. Placeat, accusantium! Accusantium?</p>
                </div>
            </div>

            <a className="service-detail-apply" href="javascript:;">交换名片</a>
        </div>
    )
}
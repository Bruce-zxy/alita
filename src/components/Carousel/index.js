import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'antd-mobile';
import './index.scss';

export default (props) => {
    const { className } = props;

    return (
        <div className={`hdz-swiper ${className || ''}`} key={props.list && props.list.length}>
            <Carousel
                autoplay
                infinite
                {...props}
                className="hdz-swiper-body"
            >
                {props.list && props.list.length > 0 ? props.list.map(item => (
                    <a className="hdz-swiper-link" href={item.link} key={item.id}>
                        <img className="hdz-swiper-image" src={item.image} alt={item.name} />
                        {item.title && <p className="hadz-swiper-title">{item.title}</p>}
                    </a>
                )) : (
                    <a className="hdz-swiper-link">
                        <div className="swiper-empty">
                            <p className="list-empty">暂无轮播图数据</p>
                        </div>
                    </a>
                )}
            </Carousel>
        </div>
    );
}

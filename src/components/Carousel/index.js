import React from 'react';
import { Carousel } from 'antd-mobile';
import './index.scss';

export default (props) => {

    return (
        <div className="hdz-swiper">
            <Carousel
                className="hdz-swiper-body"
                autoplay
                infinite
                {...props}
            >
                {props.list.map(item => (
                    <a className="hdz-swiper-link" href={item.link} key={item.name}>
                        <img className="hdz-swiper-image" src={item.image} alt={item.name} />
                    </a>
                ))}
            </Carousel>
        </div>
    );
}

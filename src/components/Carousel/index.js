import React from 'react';
import { Carousel } from 'antd-mobile';
import './index.scss';

export default (props) => {

    return (
        <div className="hdz-swiper" key={props.list.length}>
            <Carousel
                className="hdz-swiper-body"
                autoplay
                infinite
                {...props}
            >
                {props.list.map(item => (
                    <a className="hdz-swiper-link" href={item.link} key={item.id}>
                        <img className="hdz-swiper-image" src={item.image} alt={item.name} />
                        {item.title && <p>{item.title}</p>}
                    </a>
                ))}
            </Carousel>
        </div>
    );
}

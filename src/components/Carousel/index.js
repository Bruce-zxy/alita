import React from 'react';
import { Link } from 'react-router-dom';
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
                    <Link className="hdz-swiper-link" to={item.link} key={item.id}>
                        <img className="hdz-swiper-image" src={item.image} alt={item.name} />
                        {item.title && <p>{item.title}</p>}
                    </Link>
                ))}
            </Carousel>
        </div>
    );
}

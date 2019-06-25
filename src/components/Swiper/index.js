import React, { Component } from 'react';
import Swiper from 'swiper';

import 'swiper/dist/css/swiper.min.css';

export default class CommonSwiper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            className: "SwiperContainer"
        }
        this.swiper = null;
    }
	componentDidMount() {
		let { className, config } = this.props;
		if (!!className) {
			this.setState({ className: className });
		} else {
			className = this.state.className;
        }
        if (!config) {
            config = {}
        }
		this.swiper = new Swiper(`.${className}`, {
            slidesPerView: 4.5,
            spaceBetween: 10,
            freeMode: true,
            ...config
        });
	}
	render() {
        let { list, render } = this.props;
        let CLASS_NAME = this.props.className || this.state.className;
        list = list || [];
        
		return (
            <div className={`swiper-container ${CLASS_NAME}`}>
                <div className="swiper-wrapper">
                    {list.map((item, i) => <div key={i} className="swiper-slide">{render(item, i)}</div>)}
                </div>
            </div>
		)
	}
}


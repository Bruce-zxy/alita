import React, { Fragment, Component, useContext } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import ShopContext from '../context/shop';

import superFetch from '../lib/api';
import config from '../lib/config';

const { LOCAL_URL } = config;

// const service_list = [{
//     id: 1,
//     title: '“获泽习语”志愿服务',
//     description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
//     tags: ['理论政策宣讲'],
//     image: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效'
// }];

// const service_details = {
//     id: 1,
//     title: '“多彩文艺”志愿服务',
//     tags: ['文化文明'],
//     images: ['http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效', 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=图片已失效'],
//     description: '为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事为了回应企业和群众的诉求，鄠邑区政务服务中心24小时自助服务区开通了！在巡视同志随机询问办事',
//     notice: '<p>1、教练正在鼓励和帮助孩子们在冰面上保持平衡和基本动作。</p><p>2、考虑到孩子们的特殊性, 华星冰上中心特意使用整个冰球馆让他们参观体验, 面对上千平米的室内冰场, 孩子们充满了兴奋与好奇。</p>'
// }

class Service extends Component {

    toRenderServiceDetails = (details) => (
        <div className="hdz-service-details">
            <div className="service-details-header">
                <p className="service-title">{details.title}</p>
                <p className="service-tags">
                    {details.tags && details.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </p>
                <p className="service-images">
                    {details.images && details.images.map((image) => (
                        <img src={image} alt="service-images" key={image}/>
                    ))}
                </p>
            </div>
            <div className="hdz-block-space"></div>
            <div className="service-details-intro">
                <p>服务详情</p>
                <div>{details.description}</div>
            </div>
            <div className="hdz-block-space"></div>
            <div className="service-details-notice">
                <p>点单须知</p>
                <div dangerouslySetInnerHTML={{ __html: details.notice }}></div>
            </div>
            <div className="hdz-block-space-20"></div>
            <div className="hdz-block-space-20"></div>
            <div className="hdz-block-space-20"></div>
            <div className="service-details-button">
                <Link to={`${LOCAL_URL['SERVICE_SUBMIT']}/${details.id}`}>立即点单</Link>
            </div>
        </div>
    )

    toRenderServiceList = (list) => {
        return (
            <div className="hdz-service">
                <div className="service-header">
                    <div className="search-icon">
                        <i className="iconfont iconjiantouzuo" onClick={this.props.history.goBack}></i>
                    </div>
                    <div className="search-input-container">
                        <i className="iconfont iconsousuo"></i>
                        <input type="text" placeholder="请输入服务关键字" />
                    </div>
                </div>
                <div className="service-function">
                    <div className="service-sort">综合排序 <i className="iconfont iconbelow-s"></i></div>
                    <div className="service-type">类型 <i className="iconfont iconbelow-s"></i></div>
                    <div className="service-filter">筛选 <i className="iconfont iconguolv"></i></div>
                </div>
                <div className="service-list">
                    {list.length > 0 ? list.map((item, i) => [
                        <Link className="service-item" key={item.id} to={`${LOCAL_URL['SERVICE']}/${item.id}`}>
                            <div className="service-item-left">
                                <img src={item.image} alt="service-item" />
                            </div>
                            <div className="service-item-right">
                                <p className="service-title">{item.title}</p>
                                <p className="service-description">{item.description}</p>
                                <p className="service-tags">
                                    {item.tags && item.tags.map((tag) => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </p>
                            </div>
                        </Link>,
                        <div className="hdz-block-space" key={i}></div>
                    ]) : (
                        <p className="list-empty">暂无此分类数据</p>
                    )}
                </div>
            </div>
        )
    }
    


    render() {
        const { match: { params: { id } }, list } = this.props;
        const details = _.find(list, { id: id });
        
        if (id) {
            return this.toRenderServiceDetails({
                ...details,
                description: details.desc,
                tags: [details.category.name],
                images: details.albumList.map(item => item.url)
            });
        } else {
            return this.toRenderServiceList(list.map(item => ({
                ...item,
                description: item.desc,
                tags: [item.category.name],
                image: item.coverPath,
            })));
        }
    }
}


export default (props) => {
    const shopContext = useContext(ShopContext);

    if(shopContext.service[1]) {
        return (
            <Fragment>
                <Service {...props} list={shopContext.service[0]} />
            </Fragment>
        )
    } else {
        return (
            <Fragment></Fragment>
        )
    }
}
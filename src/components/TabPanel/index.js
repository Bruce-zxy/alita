import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable'
import './index.scss';


const data = [{
    title: "团队介绍",
    content: "1、北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全，以其罕见的高品质震动京城地产界。星河湾是全球唯一蝉联［国际花园社区］金奖的地产品牌。2007年，星河湾再次领跑北京高端住宅市场，同时获得北京房地产单一项目品牌价值10强第一名及中国房地产20年高端品牌第一开发模式的称号和荣誉。"
}, {
    title: "项目优势",
    content: "2、北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全，以其罕见的高品质震动京城地产界。星河湾是全球唯一蝉联［国际花园社区］金奖的地产品牌。2007年，星河湾再次领跑北京高端住宅市场，同时获得北京房地产单一项目品牌价值10强第一名及中国房地产20年高端品牌第一开发模式的称号和荣誉。"
}, {
    title: "项目进展",
    content: "3、北京星河湾位于朝阳区东四环路朝阳北路四季星河路，距离CBD商圈不到10分钟车程。项目北临近千亩森林公园。社区立体化园林、高品质室内装修。重点小学、双语幼儿园、超五星级会所—四季会、酒店式公寓等一应俱全，以其罕见的高品质震动京城地产界。星河湾是全球唯一蝉联［国际花园社区］金奖的地产品牌。2007年，星河湾再次领跑北京高端住宅市场，同时获得北京房地产单一项目品牌价值10强第一名及中国房地产20年高端品牌第一开发模式的称号和荣誉。"
}]

export default (props) => {

    const [index, setIndex] = useState(0);


    if(data.length > 0) {
        const handlers = useSwipeable({
            onSwipedLeft: () => index === data.length - 1 ? '' : setIndex(index * 1 + 1),
            onSwipedRight: () => index === 0 ? '' : setIndex(index * 1 - 1)
        })         
        return (
            <div className="hdz-tab-panel">
                <div className="hdz-tabs-header">
                    {data.map((item, i) => (
                        <div key={i} className={`tab-${i} ${index === i ? 'active' : ''}`} onClick={(e) => setIndex(i)}>
                            <span>{item.title}</span>
                            <i className="tab-line"></i>
                        </div>
                    ))}
                </div>
                <div className="hdz-tabs-container">
                    <div className="hdz-tabs-content" style={{ width: `${100 * data.length}%`, transform: `translateX(-${100 * (index / data.length)}%)` }} {...handlers}>
                        {data.map((item, i) => (
                            <div key={i} className={`tab-${i}-content`}>{item.content}</div>
                        ))}
                    </div>
                </div>
            </div>
        )
    } else {
        return <div className="hdz-tab-panel"></div>
    }
}
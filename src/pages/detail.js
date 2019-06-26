import React from 'react';

const article_content = {
    title: '“超越·爱”中超公益系列活动走进南京鼓楼区特殊教育学校',
    author: '她在岛屿写日记',
    date: '2019-06-10',
    avatar: 'http://dummyimage.com/800x600/4d494d/686a82.gif&text=Avatar',
    content: '',
    html: `
    <div id="back" style="width:500px;height:400;">
        <p style="color: red; text-indent: 2em">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora ipsum sapiente consectetur eligendi maxime veritatis! Rerum mollitia ex eum laudantium totam officia inventore! Pariatur doloribus incidunt itaque? Ut, dicta asperiores?</p>
        <img src="http://dummyimage.com/800x600/4d494d/686a82.gif&text=IMAGE_1">
        <p style="text-indent: 2em">新华网南京6月17日电 中超公司17日消息，2019“超越·爱”中超联赛公益系列活动、“超越·爱”专项基金公益系列活动16日登陆南京，携手江苏苏宁足球俱乐部走进鼓楼区特殊教育学校，与在校学生父子欢聚绿茵，共度温情时光。</p>
        <p>本次活动恰逢父亲节，特邀请学生代表的父亲走进球场和孩子同场竞技，享受足球带来的天伦之乐。不仅如此，16日晚江苏苏宁主场对阵北京人和的中超第13轮比赛，4名特邀学生代表作为牵手球童零距离感受中超联赛的精彩与激情。</p>
        <p>本次活动恰逢父亲节，特邀请学生代表的父亲走进球场和孩子同场竞技，享受足球带来的天伦之乐。不仅如此，16日晚江苏苏宁主场对阵北京人和的中超第13轮比赛，4名特邀学生代表作为牵手球童零距离感受中超联赛的精彩与激情。</p>
        <p>本次活动恰逢父亲节，特邀请学生代表的父亲走进球场和孩子同场竞技，享受足球带来的天伦之乐。不仅如此，16日晚江苏苏宁主场对阵北京人和的中超第13轮比赛，4名特邀学生代表作为牵手球童零距离感受中超联赛的精彩与激情。</p>
        <p>本次活动恰逢父亲节，特邀请学生代表的父亲走进球场和孩子同场竞技，享受足球带来的天伦之乐。不仅如此，16日晚江苏苏宁主场对阵北京人和的中超第13轮比赛，4名特邀学生代表作为牵手球童零距离感受中超联赛的精彩与激情。</p>
    </div>
        `
}

export default ({ match }) => {

    const { id } = match.params;
    console.log(id);
    
    const data = article_content;
    const content = !!data.content ? data.content : data.html

    return (
        <div className="hdz-article-container">
            <p className="article-title">{data.title}</p>
            <div className="article-info">
                <img src={data.avatar} alt='avatar+image' />
                <div className="author-info">
                    <p className="author-name">{data.author}</p>
                    <p className="article-date">{data.date}</p>
                </div>
            </div>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )
}

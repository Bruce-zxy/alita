import React, { Component } from 'react';
import "./index.css";

/**
 * @name index.js
 * @author HadesZ
 * @date {2019-04-26 17:45:59}
 * @parmas datas, toEdit, onClick
 * @description null
 * @Example
 * vvv
 * [{
 *    title: "2这是一个超长的标题有多长呢我也不知道所以就是超长的",
 *    // labels: ["标签2", "标签2", "标签2", "标签2", "标签2", "标签2", "标签2", "标签2"], 
 *    currPrice: 23333.22,
 *    // origPrice: 0.01,
 *    // thumbnail: "http://xvhadmin.jxxnhjq.com/Content/website/myimg/Group11.png",
 *    // extra: "这也是一个超长的文本，具体有多长呢，我也不知道，但是我想试一试能不能自动溢出"
 * }, {
 *     ......
 * }, {
 *    title: "2这是一个超长的标题有多长呢我也不知道所以就是超长的",
 *    labels: ["标签2", "标签2", "标签2", "标签2", "标签2", "标签2", "标签2", "标签2"], 
 *    currPrice: 23333.22,
 *    origPrice: 0.01,
 *    thumbnail: "http://xvhadmin.jxxnhjq.com/Content/website/myimg/Group11.png",
 *    extra: "这也是一个超长的文本，具体有多长呢，我也不知道，但是我想试一试能不能自动溢出"
 * }]
 * ^^^
 * @return 
 */
class ListView extends Component {
  componentDidMount() {
    let title_array = Array.from(document.getElementsByClassName("h-list-title"));
    let extra_array = Array.from(document.getElementsByClassName("h-list-extra"));
    title_array.forEach(dom => this.toCheckTextOverflow(dom, 2));
    extra_array.forEach(dom => this.toCheckTextOverflow(dom, 1));
  }
  toCheckTextOverflow(dom, line) {
    let dom_width = getComputedStyle(dom).width.slice(0, -2);
    let font_size = getComputedStyle(dom).fontSize.slice(0, -2);
    let word_count = dom.innerHTML.length;
    let max_word_count = Math.floor(dom_width/font_size * 1.1 * line);
    if (word_count > max_word_count) {
      dom.innerHTML = dom.innerHTML.slice(0, max_word_count - 3) + "...";
    }
  }
  toCreateListItem(data) {
    let { title, labels, currPrice, origPrice, thumbnail, extra } = data;
    title     = title || "";
    labels    = labels || [];
    currPrice = currPrice || 0;
    origPrice = origPrice || 0;
    thumbnail = thumbnail || "";
    extra     = extra || "";
    data = { title, labels, currPrice, origPrice, thumbnail, extra };
    return <ListItem  refs={(ref) => this.ListItems} {...this.props} data={data}/>
  }
  render() {
    let { datas } = this.props;
    let graph = datas.thumbnail ? "has-graph" : "no-graph";
    console.log(this);
    
    return (
      <div id="h-list-view" className={`${graph}`}>
        {datas.map((data, i) => (
          <div className="h-list-body" key={i}>
            <div className="h-divider"></div>
            <div className="h-list-container" >
              <div className="h-white-space"></div>
              {this.toCreateListItem(data)}
              <div className="h-white-space"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const ListItem = ({ onClick, toEdit, data }) => (
  <div className="h-list">
    <div className="h-list-content" onClick={onClick}>
      {data.thumbnail ? <div className="h-list-img" style={{ backgroundImage: `url(${data.thumbnail})` }}></div> : ""}
      <div className="h-list-info">
        <p className="h-list-title">{data.title}</p>
        <p className="h-list-label">
          {data.labels.slice(0, 4).map((label, i) => <span key={i}>{label}</span>)}
        </p>
        <p className="h-list-price">
          <span className="integer">&yen;{data.currPrice.toString().split('.')[0]}</span>
          <span className="decimal">.{data.currPrice.toString().split('.')[1]}</span>
          {data.origPrice ? <span className="orig decimal">原价：&yen;{data.origPrice.toString().split('.')[0]}.{data.origPrice.toString().split('.')[1]}</span> : ""}
        </p>
        <p className="h-list-extra" onClick={onExpandExtra(data)}>{data.extra}</p>
      </div>
    </div>
    <div className="h-list-more" onClick={(e) => toEdit(e, data)}>编辑</div>
  </div>
)

const onExpandExtra = (data) => (e) => {
  console.log(data);
  e.stopPropagation();
}


export default ListView;

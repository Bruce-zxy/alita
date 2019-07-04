import React, { useContext } from 'react';
import * as moment from 'moment';

import ShopContext from '../context/shop';

import config from '../lib/config';

const scores_info ={
    balance: '2154',
    list: [{
        name: '完成任务',
        date: '2019-05-15',
        type: 'in',
        amount: '50'
    }, {
        name: '完成任务',
        date: '2019-05-10',
        type: 'out',
        amount: '50'
    }, {
        name: '完成任务',
        date: '2019-05-25',
        type: 'in',
        amount: '50'
    }, {
        name: '完成任务',
        date: '2019-05-15',
        type: 'out',
        amount: '50'
    }]
}

export default () => {

    const shopContext = useContext(ShopContext);
    const { score, user } = shopContext;
    const scores = score[1] ? score[0].map(item => ({
        ...item,
        name: item.title,
        date: moment(item.create_at).format('YYYY-MM-DD'),
        type: item.value < 0 ? 'out' : 'in',
        amount: Math.abs(item.value)
    })) : [];


    return (
        <div className="hdz-scores">
            <div className="scores-info-container">
                <div className="scores-icon">
                    <i className="iconfont iconjifen1-copy"></i>
                </div>
                <div className="scores-balance">
                    <p>积分余额</p>
                    <p>{!!user ? user.points : 0}</p>
                </div>
            </div>
            <div className="scores-info">
                <div className="scores-info-list">
                    {scores.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, i) => (
                        <div className="scores-info-item" key={i}>
                            <span>{item.date}</span>
                            <span>{item.name}</span>
                            <span className={item.type}>{item.amount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classname from 'classname';
import { Swipeable } from 'react-swipeable'
// import { Carousel } from 'antd-mobile';
// import Swiper from 'react-slick';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
// import { OverPack } from 'rc-scroll-anim';
// import TweenOne from 'rc-tween-one';
// import QueueAnim from 'rc-queue-anim';

import './index.scss';

moment.locale('zh-cn');

class Calendar extends Component {

    constructor(props) {
        super(props);
        // this.today       = moment().format('YYYY-MM-DD');
        // const today_set  = this.today.split('-');
        // this.today_year  = today_set[0] * 1;
        // this.today_month = today_set[1] * 1;
        // this.today_day   = today_set[2] * 1;
        this.state = {
            active: '',
            offset: -3
        }
        this.swipedHandler = {
            onSwipedRight: () => this.setState((prevState) => ({ offset: prevState.offset - 1 })),
            onSwipedLeft: () => this.setState((prevState) => ({ offset: prevState.offset + 1 })),
            onSwipedUp: () => { console.log('Up') },
            onSwipedDown: () => { console.log('Down') },
            onSwiping: () => { console.log('Swiping...') }
        }
    }

    toCompleteDateByZero = (str) => str.toString().padStart(2, '0');

    toJumpToCertainDate = ({ active = '', offset = this.state.offset, jumpTo = '' }) => () => {
        if (!!jumpTo) {
            offset = moment(jumpTo, 'YYYY-MM').diff(moment().startOf('month'), 'month');
            active = jumpTo;
        }
        this.setState({ active, offset })
    };

    toGetDateByOffset = (offset = 0) => {
        let offset_year, offset_month, offset_day;
        if (offset > 0) {
            [offset_year, offset_month, offset_day] = moment().add(offset, 'month').format('YYYY-MM-DD').split('-');
        } else {
            [offset_year, offset_month, offset_day] = moment().subtract(Math.abs(offset), 'month').format('YYYY-MM-DD').split('-');
        }
        return { offset_year, offset_month, offset_day };
    }

    toGenerateCalendar2DArray = (offset = 0) => {
        const offset_current_month  = this.toGetDateByOffset(offset);
        const offset_previous_month = this.toGetDateByOffset(offset - 1);
        const offset_next_month     = this.toGetDateByOffset(offset + 1);

        const CALENDAR_CELL_NUMBER  = 7 * 6;
        const DAY_IN_CURRENT_MONTH  = moment(`${offset_current_month.offset_year}${offset_current_month.offset_month}`, 'YYYYMM').daysInMonth();
        const DAY_IN_PREVIOUS_MONTH = moment(`${offset_previous_month.offset_year}${offset_previous_month.offset_month}`, 'YYYYMM').daysInMonth();
        const FIRST_DAY_IN_MONTH    = moment(`${offset_current_month.offset_year}${offset_current_month.offset_month}01`).format('d') * 1;
        const CALENDAR_1D_ARRAY     = Array.from({ length: DAY_IN_CURRENT_MONTH }, (v, k) => `${offset_current_month.offset_year}-${offset_current_month.offset_month}-${this.toCompleteDateByZero(k * 1 + 1)}`);

        for (let i = 0; i < FIRST_DAY_IN_MONTH; i++) {
            CALENDAR_1D_ARRAY.unshift(`${offset_previous_month.offset_year}-${offset_previous_month.offset_month}-${this.toCompleteDateByZero(DAY_IN_PREVIOUS_MONTH - i)}`);
        }
        for (let i = 1, end = CALENDAR_CELL_NUMBER - CALENDAR_1D_ARRAY.length; i <= end; i++) {
            CALENDAR_1D_ARRAY.push(`${offset_next_month.offset_year}-${offset_next_month.offset_month}-${this.toCompleteDateByZero(i)}`);
        }

        return {
            calendar: [[], [], [], [], [], []].map((item, i) => CALENDAR_1D_ARRAY.slice(i * 7, (i + 1) * 7)),
            date: offset_current_month
        };
    }

    toRenderCalendarBody = (offset = 0) => {
        const { active } = this.state;
        const { calendar, date: { offset_year, offset_month, offset_day } } = this.toGenerateCalendar2DArray(offset);
        let current = ''; 

        if (!!active) {
            // 日期必须是包含在当前日期月份内的
            const in_current_month = calendar.find(week => week.includes(active)) && moment(current, 'YYYY-MM').diff(moment().startOf('month'), 'month') === offset;
            if (in_current_month) {
                // 当前展示的日历中包含active指定的日期
                current = active;
            } else {
                let count = 1;
                current = `${offset_year}-${offset_month}-${active.split('-')[2]}`;
                while (!calendar.find(week => week.includes(current))) {
                    current = `${offset_year}-${offset_month}-${active.split('-')[2] - count++}`;
                }
            }
        } else {
            current = `${offset_year}-${offset_month}-${offset_day}`;
        }

        console.log(current);
        const day_interval_num = moment(current, 'YYYY-MM-DD').diff(moment(), 'days');
        const day_interval_str = day_interval_num === 0 ? '今天' : day_interval_num < 0 ? `${Math.abs(day_interval_num)}天前` : `${Math.abs(day_interval_num)}天后`;
        
        

        return (
            <div className="react-calendar-body">
                <div className="react-calendar-header">
                    <div className="react-calendar-show-date">
                        <div className="calendar-date">
                            <div className="show-month">{offset_month*1}月</div>
                            <div className="show-more">
                                <div className="show-interval">{day_interval_str}</div>
                                <div className="show-year">{offset_year}年</div>
                            </div>
                            
                        </div>
                        <div className="calendar-back-today" onClick={this.toJumpToCertainDate({ offset: 0 })}>今</div>
                        <div className="calendar-function">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                    <div className="react-calendar-week-name">
                        <span>天</span>
                        <span>一</span>
                        <span>二</span>
                        <span>三</span>
                        <span>四</span>
                        <span>五</span>
                        <span>六</span>
                    </div>
                </div>
                <Swipeable className="react-calendar-content" style={{  }} {...this.swipedHandler}>
                    {calendar.map((week, i) => (
                        <div key={i} className="react-calendar-week">
                            {week.map((day, j) => (
                                <span 
                                    key={day} 
                                    className={`react-calendar-day ${classname(current === day ? 'active' : '')}`} 
                                    data-date={day}
                                    onClick={this.toJumpToCertainDate({ jumpTo: day })}
                                >
                                    {day.split('-')[2]}
                                </span>
                            ))}
                        </div>
                    ))}
                </Swipeable>
                <Swipeable className="react-calendar-footer" style={{ color: "red" }} onSwipedUp={() => { console.log('Up') } }>
                    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                </Swipeable>
            </div>
        )
    }

    render() {
        const { offset } = this.state;
        return (
            <div id="react-calendar-container">
                {this.toRenderCalendarBody(offset)}
            </div>
        )
    }
}

export default Calendar;
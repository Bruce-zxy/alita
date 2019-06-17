import React, { Component } from 'react';
import ReactDom from 'react-dom';
import classname from 'classname';
import { Swipeable } from 'react-swipeable'
// import { Carousel } from 'antd-mobile';
// import Swiper from 'react-slick';
import * as moment from 'moment';
import 'moment/locale/zh-cn';

import './index.scss';

moment.locale('zh-cn');

class Calendar extends Component {

    constructor(props) {
        super(props);
        const { jump, data } = props;
        let active = moment().format('YYYY-MM-DD');
        let offset = 0;
        if (!!jump && moment.isDate(jump)) {
            active = jump;
            offset = moment(jump).diff(moment().startOf('month'), 'month');
        }
        this.state = {
            active,
            offset,
            calendar_type_function_show: false,
            calendar_type: 'month',
            data: data || []
        }
        this.active_index = [];
        this.swipedHandler = {
            onSwipedRight: () => this.toJumpToCertainDate(moment(this.state.active).subtract(1, this.state.calendar_type).format('YYYY-MM-DD'))(),
            onSwipedLeft: () => this.toJumpToCertainDate(moment(this.state.active).add(1, this.state.calendar_type).format('YYYY-MM-DD'))(),
            onSwipedUp: this.toChangeCalendarViewType('week'),
            onSwipedDown: this.toChangeCalendarViewType('month')
        }
    }

    componentDidUpdate() {
        if (this.calendar_content) {
            ReactDom.findDOMNode(this.calendar_content).style.top = this.state.calendar_type === 'month' ? '0vw' : `-${this.active_index[0] * 15}vw`;
        }
    }

    toCompleteDateByZero = (str) => str.toString().padStart(2, '0')

    toJumpToCertainDate = (date) => () => this.setState({ active: date, offset: moment(date, 'YYYY-MM').diff(moment().startOf('month'), 'month') })

    toGetDateByOffset = (offset = 0) => {
        let offset_year, offset_month, offset_day;
        if (offset > 0) {
            [offset_year, offset_month, offset_day] = moment().add(offset, 'month').format('YYYY-MM-DD').split('-');
        } else {
            [offset_year, offset_month, offset_day] = moment().subtract(Math.abs(offset), 'month').format('YYYY-MM-DD').split('-');
        }
        return { offset_year, offset_month, offset_day };
    }

    toGetIndexOfActiveDate = (active, calendar) => {
        let index = [];
        calendar.forEach((week, i) => {
            week.forEach((day, j) => {
                if (active === day.date) {
                    index.push(i, j);
                }
            })
        })
        return index;
    }

    toGenerateCalendar2DArray = (offset = 0) => {
        const offset_current_month  = this.toGetDateByOffset(offset);
        const offset_previous_month = this.toGetDateByOffset(offset - 1);
        const offset_next_month     = this.toGetDateByOffset(offset + 1);

        const CALENDAR_CELL_NUMBER  = 7 * 6;
        const DAY_IN_CURRENT_MONTH  = moment(`${offset_current_month.offset_year}${offset_current_month.offset_month}`, 'YYYYMM').daysInMonth();
        const DAY_IN_PREVIOUS_MONTH = moment(`${offset_previous_month.offset_year}${offset_previous_month.offset_month}`, 'YYYYMM').daysInMonth();
        const FIRST_DAY_IN_MONTH    = moment(`${offset_current_month.offset_year}${offset_current_month.offset_month}01`).format('d') * 1;
        const CALENDAR_1D_ARRAY     = Array.from({ length: DAY_IN_CURRENT_MONTH }, (v, k) => ({
            date: `${offset_current_month.offset_year}-${offset_current_month.offset_month}-${this.toCompleteDateByZero(k * 1 + 1)}`,
            color: '#333'
        }));

        for (let i = 0; i < FIRST_DAY_IN_MONTH; i++) {
            CALENDAR_1D_ARRAY.unshift({
                date: `${offset_previous_month.offset_year}-${offset_previous_month.offset_month}-${this.toCompleteDateByZero(DAY_IN_PREVIOUS_MONTH - i)}`,
                color: '#ccc'
            });
        }
        for (let i = 1, end = CALENDAR_CELL_NUMBER - CALENDAR_1D_ARRAY.length; i <= end; i++) {
            CALENDAR_1D_ARRAY.push({
                date: `${offset_next_month.offset_year}-${offset_next_month.offset_month}-${this.toCompleteDateByZero(i)}`,
                color: '#ccc'
            });
        }

        return {
            calendar: [[], [], [], [], [], []].map((item, i) => CALENDAR_1D_ARRAY.slice(i * 7, (i + 1) * 7)),
            date: offset_current_month
        };
    }

    toShowCalendarViewTypeOption = (e) => {
        this.setState({
            calendar_type_function_show: true,
        })
    }
    toChangeCalendarViewType = (type) => () => {
        ReactDom.findDOMNode(this.calendar_content).style.top = type === 'month' ? '0vw' : `-${this.active_index[0] * 15}vw`;
        this.setState({
            calendar_type_function_show: false,
            calendar_type: type
        })
    }

    toRenderCalendarBody = (offset = 0) => {
        const { active, calendar_type_function_show, calendar_type, data } = this.state;
        const { calendar, date: { offset_year, offset_month, offset_day } } = this.toGenerateCalendar2DArray(offset);
        let current = '';
        
        if (!!active) {
            // 日期必须是包含在当前日期月份内的
            const in_current_month = calendar.find(week => week.map(item => item.date === current).length) && moment(current, 'YYYY-MM').diff(moment().startOf('month'), 'month') === offset;
            if (in_current_month) {
                // 当前展示的日历中包含active指定的日期
                current = active;
            } else {
                let count = 1;
                current = `${offset_year}-${offset_month}-${active.split('-')[2]}`;
                while (!calendar.find(week => week.map(item => item.date === current).length)) {
                    current = `${offset_year}-${offset_month}-${active.split('-')[2] - count++}`;
                }
            }
        } else {
            current = `${offset_year}-${offset_month}-${offset_day}`;
        }
        
        const [ week, order ] = this.toGetIndexOfActiveDate(current, calendar);
        this.active_index = [week, order];
        const active_day = calendar[week][order];
        console.log(active_day);

        // 求当前点击日期距离今天的天数
        const day_interval_num = moment(current, 'YYYY-MM-DD').diff(moment(), 'days');
        const day_interval_str = day_interval_num === 0 ? '今天' : day_interval_num < 0 ? `${Math.abs(day_interval_num)}天前` : `${Math.abs(day_interval_num)}天后`;
        
        return (
            <div className={`react-calendar-body ${classname(calendar_type)}`}>
                <div className="react-calendar-header">
                    <div className="react-calendar-show-date">
                        <div className="calendar-date">
                            <div className="show-month">{offset_month*1}月</div>
                            <div className="show-more">
                                <div className="show-interval">{day_interval_str}</div>
                                <div className="show-year">{offset_year}年</div>
                            </div>
                            
                        </div>
                        <div className="calendar-back-today" onClick={this.toJumpToCertainDate(moment().format('YYYY-MM-DD'))}>今</div>
                        <div className="calendar-function" onClick={this.toShowCalendarViewTypeOption}>
                            <span></span>
                            <span></span>
                            <span></span>
                            <div className={`calendar-view-type ${classname(calendar_type_function_show ? 'show' : '')}`}>
                                <div className="calendar-view-select">
                                    <p className="calendar-view-option" onClick={this.toChangeCalendarViewType('month')}>月视图</p>
                                    <p className="calendar-view-option" onClick={this.toChangeCalendarViewType('week')}>周视图</p>
                                    <p className="calendar-view-option">跳转日期</p>
                                </div>
                            </div>
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
                <Swipeable className={`react-calendar-content`} {...this.swipedHandler} ref={ins => this.calendar_content = ins}>
                    {calendar.map((week, i) => (
                        <div key={i} className="react-calendar-week">
                            {week.map((day, j) => (
                                <div 
                                    key={day.date} 
                                    className={`react-calendar-day ${classname(current === day.date ? 'active' : '')}`}
                                    style={{ color: day.disabled ? '#CCC' : day.color }} 
                                    data-date={day.date}
                                    onClick={day.disabled ? this.toJumpToCertainDate(day.date) : null}
                                >
                                    {day.date.split('-')[2]}
                                    <span>
                                        <em style={{ backgroundColor: day.dot }}></em>
                                    </span>
                                    <span>
                                        {day.tags && day.tags.length && day.tags.map((tag, i) => (
                                            <em style={{ color: tag.color }}>{tag.name.slice(0,1)}</em>
                                        ))}
                                    </span>
                                    <span>
                                        <em>{day.text && day.text.slice(0,4)}</em>
                                    </span>
                                    <span>
                                        <em>测</em>
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </Swipeable>
                <div className="react-calendar-footer" ref={ins => this.calendar_footer = ins}>
                    <Swipeable className="react-calendar-footer-swiper" onSwipedUp={this.toChangeCalendarViewType('week')} onSwipedDown={this.toChangeCalendarViewType('month')}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </Swipeable>
                    <div className="react-calendar-footer-content">
                        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                    </div>
                </div>

                <div className={`calendar-event-mask ${classname(calendar_type_function_show && 'show')}`} onClick={() => this.setState({ calendar_type_function_show: false })}></div>
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
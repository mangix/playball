/**
 * 返回startDate 当天0点到 duration 天数的23：59：59
 * 1为当天0点到当天23：59：59
 * 依次类推
 *
 * @param duration {Number} 天数
 * @param startDate {Date} 开始日期， 默认为今天
 * */
exports.duration = function (duration, startDate) {
    startDate = startDate || new Date();

    var morning = startDate;
    morning.setHours(0);
    morning.setMinutes(0);
    morning.setSeconds(0);
    morning.setMilliseconds(0);

    var end = new Date(morning);
    end.setDate(end.getDate() + duration - 1);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(0);

    return{
        begin: morning,
        end: end
    }
};

/**
 * morning
 * 把日期的时间设置为 0:0:0
 * */

exports.morning = function (date) {
    var d = new Date(date);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
};


/**
 * 获取中午星期
 *  commonDesc ,是否显示为 昨天，今天，明天
 * */
exports.week = function (date, commonDesc) {
    var WEEK = {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        0: '星期日'
    };
    date = new Date(+date);
    var week = WEEK[date.getDay()];
    if (commonDesc) {
        var today = exports.duration(1);
        if (+date >= today.begin && +date < today.end) {
            return "今天";
        }
        var yesterdayMorning = today.begin.setDate(today.begin.getDate() - 1);
        var yesterdayEnd = today.end.setDate(today.end.getDate() - 1);

        if (+date >= yesterdayMorning && +date < yesterdayEnd) {
            return "昨天";
        }

        var tomorrowMorning = today.begin.setDate(today.begin.getDate() + 1);
        var tomorrowEnd = today.end.setDate(today.begin.getDate() + 1);

        if (+date >= tomorrowMorning && +date < tomorrowEnd) {
            return "明天";
        }
    }
    return week;
};

exports.week(new Date(2015,4,2,23),true);


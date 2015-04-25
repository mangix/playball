/**
 * 返回当天0点到 duration 天数的23：59：59
 * */
exports.duration = function (duration) {
    var morning = new Date();
    morning.setHours(0);
    morning.setMinutes(0);
    morning.setSeconds(0);
    morning.setMilliseconds(0);

    var end = new Date(morning);
    end.setDate(end.getDate() + duration-1);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end.setMilliseconds(0);

    return{
        begin: morning,
        end: end
    }
};
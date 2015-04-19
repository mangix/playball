var Runner = require('./runner');
var UPDATE_FREQUENCY = 40000; //每 40s  更新一次
var query = require("../service/common/connection").query;

/**
 * 最早的比赛
 * */
var findEarliestGame = function (games) {
    var res = games.sort(function (g1, g2) {
        return new Date(g1.Time) - new Date(g2.Time);
    });
    return res[0];
};

/**
 * 获取明天的日期
 * */
var getTomorrow = function () {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    return tomorrow;
};

/**
 * 获取需要更新的比赛列表
 * */
Runner.setSchedule(function (finish) {

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);


    query("select * from playball.Game where Time between ? and ? and Status<>2", [today, tomorrow], function (err, results) {
        var isToRun = false;
        if (err) {
            Runner.setLag(UPDATE_FREQUENCY);
            console.error("db error:" + err);
        } else {
            var now = new Date();
            if (results && results.length) {
                //还有比赛没打完
                var earliestTime = findEarliestGame(results);
                if (earliestTime > now) {
                    //还没有开始的
                    Runner.setLag(earliestTime - now);
                } else {
                    //有开始的, 按频度跑作业
                    Runner.setLag(UPDATE_FREQUENCY);
                    isToRun = true;
                }
            } else {
                //今天的比赛结束了, 设置时间到明天凌晨
                Runner.setLag(getTomorrow() - now);
            }
        }
        finish(isToRun);
    });
});


//add更新统计数据job
//Runner.addJob(require("./realtime/update_statistic"));

Runner.addJob(require("./realtime/update_schdule"));

Runner.run();
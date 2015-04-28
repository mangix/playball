/**
 *
 * 更新比赛ThirdID
 * Runner
 *
 * 定时12小时跑一次
 * */


var Runner = require('./runner')();

Runner.setSchedule(function (finish) {
    Runner.setLag(12 * 60 * 60 * 1000);
    finish(true);
});

Runner.addJob(require("./game/find_hupuid"));

Runner.run();


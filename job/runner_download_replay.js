/**
 *
 * 更新比赛下载录像,比赛回放视频
 * Runner
 *
 * 定时半小时跑一次
 * */


var Runner = require('./runner')();

Runner.setSchedule(function (finish) {
//    Runner.setLag(60 * 60 * 1000);
    Runner.setLag(20 * 1000);
    finish(true);
});

Runner.addJob(require("./download/waha.js"));

Runner.run();


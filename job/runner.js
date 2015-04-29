/**
 * run jobs
 * simple job runner
 * setSchedule --> addJob --> run
 * */

var moment = require("moment");
var id = 0;

module.exports = function (jobName) {
    //创建一个Runner
    //执行的jobs
    var jobs = [];
    //下次执行的时间间隔
    var lag = 0;

    var runner = {};

    //schedule,  作业执行的规则 , 此方法需要设置lag， 回掉finish方法
    var schedule = function (finish) {
        finish();
    };

    var _id = ++id;

    /**
     * 添加job
     * */
    runner.addJob = function (jobFn) {
        jobs.push(jobFn);
    };

    /**
     * 设置下次执行的时间
     * */
    var setLag = runner.setLag = function (l) {
        lag = l;
        this.log('set lag in ' + l);
    };

    /**
     * 这是schedule
     * */
    var setSchedule = runner.setSchedule = function (sc) {
        schedule = sc;
    };

    /**
     * run jobs
     * */
    var runJobs = function () {
        jobs.forEach(function (job) {
            job.call(runner,runner);
        });
        runner.log('run ' + jobs.length + ' jobs');
    };

    /**
     * 启动容器
     * */
    var isStart = false;
    var isRunning = false;
    var run = runner.run = function () {

        runner.log("start runner " + jobName + "..");

        if (isRunning) {
            return;
        }
        isRunning = true;
        schedule(function (isRun) {
            isRun && runJobs();
            setTimeout(run, lag);
            isRunning = false;
        });


        if (!isStart) {
            process.on('uncaughtException', function (err) {
                console.error("uncaughtException:" + err.stack);
                setTimeout(run, lag);
            });
        }
        isStart = true;
    };

    runner.log = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift("[" + moment(new Date()).format("YY-MM-DD hh:mm:ss") + " " + jobName + "] ");
        console.log.apply(console, args);
    };

    return runner;

};






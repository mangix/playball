/**
 * run jobs
 * simple job runner
 * setSchedule --> addJob --> run
 * */

//执行的jobs
var jobs = [];
//下次执行的时间间隔
var lag = 0;
//schedule,  作业执行的规则 , 此方法需要设置lag， 回掉finish方法
var schedule = function (finish) {
    finish();
};

/**
 * 添加job
 * */
exports.addJob = function (jobFn) {
    jobs.push(jobFn);
};

/**
 * 设置下次执行的时间
 * */
var setLag = exports.setLag = function (l) {
    lag = l;
    console.log('set lag in ' + l);
};

/**
 * 这是schedule
 * */
var setSchedule = exports.setSchedule = function (sc) {
    schedule = sc;
};

/**
 * run jobs
 * */
var runJobs = function () {
    jobs.forEach(function (job) {
        job();
    });
    console.log('run ' + jobs.length + ' jobs');
};

/**
 * 启动容器
 * */
var isStart = false;
var isRunning = false;
var run = exports.run = function () {

    if (isRunning) {
        return;
    }
    schedule(function (isRun) {
        isRun && runJobs();
        setTimeout(run, lag);
        isRunning = false;
    });
    isRunning = true;

    if (!isStart) {
        process.on('uncaughtException', function (err) {
            console.error("uncaughtException:" + err);
            setTimeout(run, lag);
        });
    }
    isStart = true;
};




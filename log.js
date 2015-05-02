var winston = require("winston");
var moment = require("moment");

var timestamp = function () {
    return "[" + moment().format("YYYY-MM-DD hh:mm:ss:SSS") + "]"
};

winston.loggers.add("app", {
    console: {
        level: "info",
        colorize: true,
        timestamp: timestamp
    },
    dailyRotateFile: {
        filename: "./logs/app",
        level: "info",
        json: false,
        prettyPrint: true,
        timestamp: timestamp,
        datePattern: "-yyyyMMdd.log"
    }
});

winston.loggers.add("job", {
    console: {
        level: "info",
        colorize: true,
        timestamp: timestamp
    },
    dailyRotateFile: {
        filename: "logs/job",
        level: "info",
        json: false,
        prettyPrint: true,
        timestamp: timestamp,
        datePattern: "-yyyyMMdd.log"
    }
});

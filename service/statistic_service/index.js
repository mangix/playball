var Statistic = require("./entity/statistic");
var statisticDao = require("./dao/statistic");
var async = require('async');

/**
 * add a statistic
 *
 * param  statistic is Object!!!
 * */
exports.addOrUpdate = function (gameId, statistic, cb) {
    if (!gameId) {
        cb(new Error("gameId can't be null"));
        return;
    }

    statisticDao.insertOrUpdate(gameId, JSON.stringify(statistic), function (err) {
        if (err) {
            cb(new Error('insert db error '));
        } else {
            cb(null);
        }
    });
};

exports.loadStatistic = function (gameId, cb) {
    statisticDao.loadStatisticByGameID(gameId, function (err, results) {
        if (err) {
            cb(new Error("db error"));
        } else {
            if (results && results.length && results[0].Statistic) {
                try {
                    var statistic = JSON.parse(results[0].Statistic);
                    cb(null, statistic);
                } catch (e) {
                    cb(new Error("format error"));
                }
            } else {
                cb(null, null);
            }
        }
    });

};
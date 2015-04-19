var Game = require("./entity/game");
var gameDao = require("./dao/game");
var playOffDao = require("./dao/playoff");

/**
 * add a game
 *
 * */
exports.addGame = function (game, cb) {
    if (!game) {
        cb(new Error("game can't be empty"));
        return;
    }

    game = Game.create(game).data();

    gameDao.insert(game, function (err, id) {
        if (err) {
            cb(new Error('insert db error '))
        } else {
            cb(null, id)
        }

    });
};

/**
 * 按照Type 和Time 加载比赛列表
 *
 *
 * options :{
 *     type: 1, 比赛类型
 *     fromDate:
 *     endDate: 时间区间
 *     live:false, 是否需要直播信息,
 *     replay:false , 是否需要录像信息
 * }
 *
 * */
exports.loadGames = function (options, cb) {
    gameDao.loadByTypeTime(options.type, options.fromDate, options.endDate,
        function (err, results) {
            if (err) {
                cb(new Error('db error'));
            } else {
                cb(err, results);
            }
        });
};

/**
 * 加载NBA 季后赛对战表
 * */
exports.loadPlayOff = function (season, cb) {
    playOffDao.loadBySeason(season, function (err, results) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(null, results.map(function (row) {
                row.Over = row.Status == 2;
                return row;
            }));
        }
    });
};

/**
 * RoundID 查询
 * */
exports.loadGamesByRoundID = function (roundId, cb) {
    gameDao.loadGamesByRoundID(roundId, function (err, results) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(null, results);
        }
    })
};

/**
 * 判断一个game是不是今天的
 * */
exports.isToday = function (game) {
    var time = game.Time;

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return time >= +today && time < tomorrow;
};
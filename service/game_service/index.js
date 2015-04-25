var Game = require("./entity/game");
var gameDao = require("./dao/game");
var playOffDao = require("./dao/playoff");
var date = require("../../util/date_util");
var async = require('async');
var liveService = require("../live_service");
var teamService = require("../team_service");
var moment = require("moment");
var WEEK = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    0: '周日'
};
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
 *     replay:false , 是否需要录像信息,
 *     byDate:false , 是否需要按日期组成map
 *     shortName:false,是否显示队伍的短名
 * }
 *
 * */
exports.loadGames = function (options, cb) {
    gameDao.loadByTypeTime(options.type, options.fromDate, options.endDate,
        function (err, list) {
            if (err) {
                cb(new Error('db error'));
            } else {
                list = list || [];

                async.parallel({
                    live: function (cb) {
                        if (options.live) {
                            if (list.length) {
                                async.parallel(list.map(function (game) {
                                    return function (cb) {
                                        liveService.loadLiveByGameID(game.GameID, function (err, lives) {
                                            game.lives = lives;
                                            cb();
                                        });
                                    }
                                }), cb);
                            }
                        } else {
                            cb();
                        }
                    },
                    replay: function (cb) {
                        if (options.replay) {
                            //TODO
                        }
                        cb();
                    }
                }, function () {
                    if (options.shortName) {
                        list.forEach(function (game) {
                            game.hostShortName = teamService.short(game.HostName);
                            game.visitShortName = teamService.short(game.VisitName);
                        });
                    }
                    if (options.byDate) {
                        var map = {};
                        list.forEach(function (game) {
                            var date = moment(game.Time).format('M月D日 ') + WEEK[game.Time.getDay()];
                            if (!map[date]) {
                                map[date] = [];
                            }
                            map[date].push(game);
                        });
                        cb(null, map);
                    } else {
                        cb(null, list);
                    }
                });


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

    var d = date.duration(1);

    return time >= +d.begin && time < d.end;
};
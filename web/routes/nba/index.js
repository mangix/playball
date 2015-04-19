var gameService = require("../../../service/game_service");
var async = require("async");
var RoundEntity = require("../../../service/game_service/entity/round");
var _ = require("underscore");
var moment = require('moment');

exports.execute = function (req, res) {
    async.parallel([loadPlayOff], function (err, results) {
        res.result('success', {
            playOff: results[0]
        });
    });
};

var loadPlayOff = function (cb) {
    gameService.loadPlayOff(20142015, function (err, results) {
        var data = {
            "west": [
                [],
                [],
                [],
                []
            ], //每个里面放每一轮的球队
            "east": [
                [],
                [],
                [],
                []
            ],
            "champion": null
        };
        if (err) {
            console.log(err);
        }
        if (!results) {
            cb(null, data);
        }

        results.forEach(function (round) {
            var area = "east";
            if (round.Area == RoundEntity.AREA_WEST) {
                area = "west";
            }
            var host = {
                TeamID: round.HostID,
                TeamName: round.HostName,
                TeamRank: round.HostRank,
                TeamWin: round.HostWin,
                Type: 'team',
                cls: CLS_MAP[round.HostID]
            };
            var visit = {
                TeamID: round.VisitID,
                TeamName: round.VisitName,
                TeamRank: round.VisitRank,
                TeamWin: round.VisitWin,
                Type: 'team',
                cls: CLS_MAP[round.VisitID]
            };

            var thisArray = data[area][round.Round - 1];
            if (round.Round > 1) {
                //检测上一轮插入的数据
                for (var i = 0; i < thisArray.length; i++) {
                    if (thisArray[i] && thisArray[i].TeamID == host.TeamID) {
                        thisArray[i] = host;
                    }
                    if (thisArray[i] && thisArray[i].TeamID == visit.TeamID) {
                        thisArray[i] = visit;
                    }
                }
            } else {
                if (host.TeamRank <= visit.TeamRank) {
                    thisArray.push(host, visit);
                } else {
                    thisArray.push(visit, host);
                }
            }

            var nextArray = data[area][round.Round];

            if (round.Over) {
                var winner = _.clone(visit.TeamWin > host.TeamWin ? visit : host);
                //这轮已打完
                if (round.Round == 4) {
                    //冠军了
                    data.champion = winner
                } else {
                    //晋级下一轮
                    winner.TeamWin = 0;
                    nextArray.push(winner);
                }
            } else {
                var live = {
                    Type: "live",
                    RoundID: round.RoundID,
                    round: round
                };
                if (round.Round == 4) {
                    //总决赛没打完
                    data.champion = live;
                } else {
                    nextArray.push(live);
                }
            }
        });

        //补充没满的轮次
        fillNul(data.west);
        fillNul(data.east);

        async.parallel({
            west: function (cb) {
                loadLiveData(data.west, cb);
            },
            east: function (cb) {
                loadLiveData(data.east, cb);
            }
        }, function () {
            cb(null, data);
        });
    });
};

var fillNul = function (area) {
    area.forEach(function (round, i) {
        var max = 8 / Math.pow(2, i);
        var l = round.length;
        if (l < max) {
            for (var j = 0; j < max - l; j++) {
                round.push({
                    Type: 'null'
                });
            }
        }
    });
};

var loadLiveData = function (area, cb) {
    var tasks = {};
    area.forEach(function (round) {
        round.forEach(function (item) {
            if (item.Type == "live") {
                tasks[item.RoundID] = function (cb) {
                    gameService.loadGamesByRoundID(item.RoundID, function (err, gameList) {
                        var list = gameList || [];
                        var gameToday = list.filter(function (game) {
                            return gameService.isToday(game);
                        });

                        if (gameToday.length) {
                            //如果今天有比赛
                            item.live = gameToday[0];
                            //比分处理
                            if (item.round.HostID == item.live.HostID) {
                                item.live.parsedScore = item.live.HostScore+'-'+item.live.VisitScore;
                            }else{
                                item.live.parsedScore = item.live.VisitScore+'-'+item.live.HostScore;
                            }
                        } else {
                            //下一场比赛
                            var nextGameList = list.sort(function (a, b) {
                                return Date.parse(a.Time) - Date.parse(b.Time);
                            }).filter(function (game) {
                                return Date.parse(game.Time) > +new Date();
                            });
                            if (nextGameList.length) {
                                item.next = nextGameList[0];
                                item.next.displayTime = moment(item.next.Time).format('MM-DD');
                            }
                        }

                        cb(null, null);
                    });
                };
            }
        });
    });
    async.parallel(tasks, cb);
};


var CLS_MAP = {
    1: 'gsw',
    8: 'nop',
    4: 'por',
    5: 'mem',
    3: 'lac',
    6: 'sas',
    2: 'hou',
    7: 'dal',
    16: 'tor',
    17: 'bos',
    18: 'bkn',
    21: 'alt',
    22: 'was',
    26: 'cle',
    27: 'chi',
    28: 'mil'
};


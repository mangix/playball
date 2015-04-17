var gameService = require("../../../service/game_service");
var async = require("async");
var RoundEntity = require("../../../service/game_service/entity/round");
var _ = require("underscore");

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
                Type: 'team'
            };
            var visit = {
                TeamID: round.VisitID,
                TeamName: round.VisitName,
                TeamRank: round.VisitRank,
                TeamWin: round.VisitWin,
                Type: 'team'
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
                    nextArray.push(winner);
                }
            } else {
                var live = {
                    Type: "live",
                    RoundID: round.RoundID
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


        cb(null, data);
    });
};

var fillNul = function (area) {
    area.forEach(function (round, i) {
        var max = 8 / Math.pow(2, i);
        var l = round.length;
        if (l < max) {
            for (var j = 0; j < max - l; j++) {
                round.push(null);
            }
        }
    });
};





/**
 * 技术统计模块
 * */

var Brick = require("node-lego").Brick;
var StatisticService = require("../../../../../service/statistic_service/index");
var logger = require("winston").loggers.get("app");


module.exports = Brick.create("Statistic", function (params, finish) {
    var gameId = params.gameId;

    StatisticService.loadStatistic(gameId, function (error, statistic) {
        if (error) {
            logger.error("Load Statistic error", error);
            finish(Brick.FAIL);
        } else {
            var data = {
                teams: [],
                headers: []
            };
            if (statistic && statistic.length) {
                statistic.forEach(function (row, i) {
                    //处理主客队
                    row.forEach(function (column, j) {
                        if (column.match(/主队|客队/)) {
                            data.teams.push(i);
                        }
                        if(column.match(/首发|替补/)){
                            data.headers.push(i);
                        }
                    });
                });
                data.statistic = statistic;
            }
            finish(Brick.SUCCESS, data);
        }
    });
},"/nba/modules/detail/statistic.jade");

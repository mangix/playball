/**
 * 技术统计模块
 * */

var Brick = require("node-lego").Brick;
var StatisticService = require("../../../../service/statistic_service");
var logger = require("winston").loggers.get("app");


module.exports = Brick.create("Statistic", function (params, finish) {
    var gameId = params.gameId;

    StatisticService.loadStatistic(gameId, function (error, statistic) {
        if (error) {
            logger.error("Load Statistic error", error);
            finish(Brick.FAIL);
        } else {
            finish(Brick.SUCCESS, statistic);
        }
    });
});

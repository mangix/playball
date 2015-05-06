var Brick = require("node-lego").Brick;
var GameService = require("../../../../../service/game_service/index");
var logger = require("winston").loggers.get("app");
/**
 * 比赛基础信息
 * */

module.exports = Brick.create("GameInfo", function (params, finish) {
    var gameId = params.gameId;
    GameService.loadGameById(gameId, function (err, game) {
        if (err) {
            logger.error("Load Game Error", err);
            finish(Brick.FAIL);
        } else {
            finish(Brick.SUCCESS, game);
        }
    });
});
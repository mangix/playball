/**
 * 直播信息
 * */

var Brick = require("node-lego").Brick;

var logger = require("winston").loggers.get("app");

var LiveService = require("../../../../../service/live_service");

module.exports = Brick.create("Live", function (params, finish) {
    var gameId = params.gameId;

    LiveService.loadLiveByGameID(gameId, function (err, lives) {
        if (err) {
            logger.error("Load Live Error ", err);
            finish(Brick.FAIL);
        } else {
            finish(Brick.SUCCESS, lives);
        }
    });
});
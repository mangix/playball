var Brick = require("node-lego").Brick;

var ReplayService = require("../../../../../service/replay_service");

var logger = require("winston").loggers.get("app");

module.exports = Brick.create("Replay", function (params, finish) {

    var gameId = params.gameId;

    ReplayService.loadReplayByGameID(gameId, function (err, replays) {
        if (err) {
            logger.error("Load Replay Error", err);
            finish(Brick.FAIL);
        } else {
            finish(Brick.SUCCESS, replays);
        }
    });

});
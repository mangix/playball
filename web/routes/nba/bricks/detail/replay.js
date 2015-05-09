var Brick = require("node-lego").Brick;

var ReplayService = require("../../../../../service/replay_service");

var logger = require("winston").loggers.get("app");

module.exports = Brick.create("Replay", function (params, finish) {

    var gameId = params.gameId;
    var replayId = params.replayId || 0;

    ReplayService.loadReplayByGameID(gameId, function (err, replays) {
        if (err) {
            logger.error("Load Replay Error", err);
            finish(Brick.FAIL);
        } else {
            var data = {
                list: replays || [],
                defaultId: replayId
            };

            //make sure default replay
            if (replays && replays.length) {
                var defaultReplays = replays.filter(function (replay) {
                    return replay.ReplayID == replayId;
                });
                if (defaultReplays.length) {
                    data.defaultReplay = defaultReplays[0];
                }else{
                    data.defaultReplay = replays[0];
                }
            }

            console.log(data)

            finish(Brick.SUCCESS, data);
        }
    });

});
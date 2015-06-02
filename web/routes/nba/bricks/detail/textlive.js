/**
 * 比赛文字直播模块
 * */

var Brick = require("node-lego").Brick;
var TextLiveService = require("../../../../../service/textlive_service");
var logger = require("winston").loggers.get("app");

module.exports = Brick.create("TextLive", function (params, finish) {
    var beginId = params.beginId || 0;
    var gameId = params.gameId;


    TextLiveService.loadLiveByGameID({
        gameId: gameId,
        beginId: beginId
    }, function (err, result) {
        if (err) {
            logger.error("Load Text Live Error", err);
            finish(Brick.FAIL);
        } else {
            if (result && result.list) {
                result.list.sort(function (o1, o2) {
                    return o2.ID - o1.ID;
                });
            }
            finish(Brick.SUCCESS, result);
        }
    });
},"/nba/modules/detail/textlive.jade");
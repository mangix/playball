/**
 * NBA比赛详情页面
 * */


var Lego = require("node-lego");
var Live = require("./bricks/detail/live");
var GameInfo = require("./bricks/detail/gameinfo");
var Statistic = require("./bricks/detail/statistic");
var Replay = require("./bricks/detail/replay");
var TextLive = require("./bricks/detail/textlive");

exports.execute = function (req, res) {

    var gameId = req.params.id;
    var replayId = req.query.replayId;

    new Lego().start({
        gameId: gameId,
        replayId: replayId,
        beginId: 0//文字直播其实id
    }).pipe(GameInfo, Live, Statistic, Replay, TextLive).done(function (data) {
        res.result("success", data);
    });
};
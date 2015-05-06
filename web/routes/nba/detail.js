/**
 * NBA比赛详情页面
 * */


var Lego = require("node-lego");
var Live = require("./bricks/detail/live");
var GameInfo = require("./bricks/detail/gameinfo");
var Statistic = require("./bricks/detail/statistic");
var Replay = require("./bricks/detail/replay");

exports.execute = function (req, res) {

    var gameId = req.params.id;

    new Lego().start({
        gameId: gameId
    }).pipe(GameInfo, Live, Statistic, Replay).done(function (data) {
        res.result("success", data);
    });
};
/**
 * GameID 获取技术统计的Ajax
 *
 * */

var Lego = require("node-lego");
var Statistic = require("../bricks/detail/statistic");

exports.execute = function (req, res) {
    var gameId = req.query.id;

    new Lego().start({
        gameId: gameId
    }).pipe(Statistic).done(function (data) {
        res.send(data);
    });
};
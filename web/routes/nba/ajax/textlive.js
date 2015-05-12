/**
 * 文字直播ajax
 * */

var Lego = require("node-lego");
var TextLive = require("../bricks/detail/textlive");

exports.execute = function (req, res) {

    new Lego().start({
        beginId: req.query.beginId || 0,
        gameId: req.query.gameId || 0

    }).pipe(TextLive).done(function (data) {
        res.result("success", data);
    });

};
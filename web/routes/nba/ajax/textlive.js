/**
 * 文字直播ajax
 * */

var Lego = require("node-lego");
var TextLive = require("../bricks/detail/textlive");

exports.execute = function (req, res) {
    var isJson = !req.query.html;

    new Lego().start({
        beginId: req.query.beginId || 0,
        gameId: req.query.gameId || 0

    }).pipe(TextLive).done(function (data) {
        if(isJson){
            res.send(data);
        }else{
            res.result("success", data);
        }
    });
};
/**
 * 爬一次数据 更新所有比赛的hupuId
 * */

var query = require("../../service/common/connection").query;
var cheerio = require("cheerio");
var request = require("request");
//var format = require("../../util/date_format").format;
var moment = require("moment");

var async = require('async');

module.exports = function () {
    query("select * from playball.Game where ThirdID = 0", function (error, results) {
        if (err) {
            return;
        }
        if (results.length) {
            async.parallel(results.map(function (game) {
                return function (cb) {
                    var date = moment(game.Time).format('YYYY-MM-DD');
                    var GameID = game.GameID;
                    request("http://g.hupu.com/nba/" + date, function (err, response, body) {
                        if (!err && response.statusCode == 200) {
                            var $ = cheerio.load(body);
                            var box = $(".list_box");
                            var found = false;
                            box.each(function (i, gameBox) {
                                var gameId, host, visit;
                                var html = $(gameBox).html();
                                var match = html.match(/boxscore_(\d+).html/);
                                if (match) {
                                    gameId = match[1];
                                    host = $(gameBox).find(".team_vs_a_1 .txt a").text();
                                    visit = $(gameBox).find(".team_vs_a_2 .txt a").text();
                                    if (~game.HostName.indexOf(host) && ~game.VisitName.indexOf(visit)) {
                                        found = true;
                                        query("update playball.Game set ThirdID=? where GameID=?", [gameId, GameID], function () {
                                            cb();
                                        });
                                    }

                                }
                            });
                            if (!found) {
                                cb();
                            }
                        } else {
                            cb();
                        }
                    });
                }
            }), function () {
            });
        }
    });
};

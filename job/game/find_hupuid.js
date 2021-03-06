/**
 * 爬一次数据 更新所有比赛的hupuId
 * */

var query = require("../../service/common/connection").query;
var cheerio = require("cheerio");
var request = require("request");
//var format = require("../../util/date_format").format;
var moment = require("moment");

var async = require('async');
var logger = console;

module.exports = function (runner) {
    logger = runner;
    query("select * from playball.Game where ThirdID = 0", function (error, results) {
        if (error) {
            return;
        }
        if (!results.length) {
            logger.info("no Games ThirdID is 0 find");
            return;
        }

        logger.info("find " + results.length + " ThirdID is 0");

        async.parallel(results.map(function (game) {
            return function (cb) {
                var date = moment(game.Time).format('YYYY-MM-DD');
                var GameID = game.GameID;
                var url = "http://g.hupu.com/nba/" + date;
                request(url, function (err, response, body) {
                    if (!err && response.statusCode == 200) {
                        var $ = cheerio.load(body);
                        var box = $(".list_box");
                        var found = false;
                        if (!box.length) {
                            logger.error(url + " dom may be changed!!!!");
                        }
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
                            } else {
                                logger.error(url + " dom may be changed!!!!");
                            }
                        });
                        if (!found) {
                            logger.info(date + " not found ThirdID");
                            cb();
                        }
                    } else {
                        logger.error("request " + url + " error", err);
                        cb();
                    }
                });
            }
        }), function () {
        });
    });
};

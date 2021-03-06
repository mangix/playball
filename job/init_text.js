/**
 * hupu live
 * */

var CopyCat = require("./copycat");
var query = require("../service/common/connection").query;
var TextLiveService = require("../service/textlive_service");
var TeamService = require("../service/team_service");
var async = require("async");

var HOST = "http://g.hupu.com/";

var logger = console;
var gameSidCache = {};
var gameId = 74;
var find = function () {
    query("select * from Game where ThirdID!=0 and Status=2 and GameID>= ? limit 1", [gameId], function (err, results) {
        if (err) {
            logger.error("Query Game Error", err);
            gameId++;
            find();
            return;
        }
        if (!results.length) {
            logger.error("No Live Game Found");
            return;
        }
        gameId = results[0].GameID + 1;
        var game = results[0];

        var id = game.ThirdID;

        if (!gameSidCache[id]) {
            gameSidCache[id] = {
                sid: 0,
                s_count: 0,
                match_id: id,
                homeTeamName: encodeURIComponent(TeamService.short(game.HostName)),
                awayTeamName: encodeURIComponent(TeamService.short(game.VisitName))
            }
        }
        var data = gameSidCache[id];

        var url = HOST + "/node/playbyplay/matchLives" + Object.keys(data).reduce(function (sum, current) {
            return sum + current + "=" + data[current] + "&";
        }, "?");

        CopyCat(url, function ($) {
            //解析URL
            var trs = $("tr");
            var newSid , datas = [];
            if (!trs.length) {
                return;
            }
            newSid = trs.eq(0).attr("sid");
            if (newSid && newSid != data.sid) {
                data.sid = newSid;
                data.s_count += trs.length;
                trs.each(function (i, tr) {
                    var tds = $(tr).find("td");
                    if (tds.length == 4) {
                        datas.unshift({
                            time: $(tds[0]).text(),
                            team: $(tds[1]).text(),
                            content: $(tds[2]).text(),
                            score: $(tds[3]).text()
                        });
                    } else if (tds.length == 1) {
                        datas.unshift({
                            content: $(tds[0]).text()
                        });
                    }
                });
                //插入数据
                var tasks = datas.map(function (data) {
                    return function (cb) {
                        var content = data.content;
                        if (data.team && content.indexOf(data.team) == -1) {
                            content = data.team + content;
                        }
                        TextLiveService.addTextLive({
                            GameID: game.GameID,
                            Score: data.score || "",
                            Time: data.time || "",
                            Content: content
                        }, function (err) {
                            if (err) {
                                logger.error("Add TextLiveService.addTextLive Error", err);
                            } else {
                                logger.info("add TextLiveService Suc", game.GameID);
                            }
                            cb(null);
                        });
                    }
                });
                if (tasks.length) {
                    logger.info(tasks.length + " lines found");
                    async.series(tasks, function () {
                        logger.info("Add Lines Finish", game.GameID);
                        find();
                    });
                } else {
                    logger.info("No TextLive This Time..");
                    find();
                }
            }
        });
    });
};

TeamService.wait(find);
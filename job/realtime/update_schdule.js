/**
 * 更新比赛状态
 * */
var query = require("../../service/common/connection").query;

var request = require("request");
var cheerio = require("cheerio");

var CopyCat = require("../copycat");

var logger;
module.exports = function (runner) {
    logger = runner || console;

    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    query("select * from playball.Game where Time between ? and ? and Status<2", [today, tomorrow], function (error, results) {
        if (!error && results && results.length) {

            results.forEach(function (game) {
                if (game.Status == 0 && new Date(game.Time) < new Date()) {
                    //已经开始
                    updateStatus(game.GameID, 1);
                }
                if (game.Status == 1) {
                    findScore("http://g.hupu.com/nba/daily/boxscore_" + game.ThirdID + ".html", game.GameID, game);
//                    findScore("http://g.hupu.com/nba/homepage/getMatchBasicInfo?matchId="+game.ThirdID, game.GameID, game);
                }

            });
        }
    });
};


function findScore(liveUrl, id, game) {
    logger.info("request hupu game page " + liveUrl + " to get score.. ");


    CopyCat(liveUrl, function ($) {
        var list = $(".table_list_c li");
        list.each(function (i, li) {
            var link = $(li).find("a").attr("href");
            if (~link.indexOf(game.ThirdID)) {
                //命中同一场比赛
                var hs = "0" , vs = "0";
                var status;
                $(li).find(".name").each(function (j, name) {
                    var scoreMatch = $(name).parent().text().match(/(\d+)/);
                    if(!scoreMatch){
                        return;
                    }
                    var score = scoreMatch[0];
                    if (j == 0) {
                        hs = score
                    } else {
                        vs = score;
                    }
                });
                updateScore(id, hs, vs);

                if ($(li).find("p").text() == "已结束") {
                    status = 2;
                }
                if (status) {
                    updateStatus(id, status, +hs > +vs ? game.HostID : game.VisitID, game);
                }
            }
        });
    });


}


function updateScore(id, hs, vs) {
    logger.info("update game " + id + " " + hs + "-" + vs);
    query("update playball.Game set ? where GameID=" + id, {
        HostScore: hs,
        VisitScore: vs
    }, function (err) {
        if (err) {
            log.error(err);
        }
    });
}

var playOffUpdated = {};

function updateStatus(id, status, winnerID, game) {
    if (status != 2) {
        winnerID = 0;
    }
    query("update playball.Game set ? where GameID=" + id, {
        Status: status,
        WinnerID: winnerID || 0
    }, function (err) {
        if (playOffUpdated[id]) {
            return;
        }
        if (err) {
            logger.error(err);
        } else {
            if (status == 2 && game && game.IsPlayOff == 1 && game.RoundID) {
                playOffUpdated[id] = true;
                query('select * from playball.PlayOff where RoundID = ?', [game.RoundID], function (err, round) {
                    if (!err && round && round.length) {
                        round = round[0];
                        var key = winnerID == round.HostID ? 'HostWin' : 'VisitWin';
                        query('update playball.PlayOff set ' + key + '= ' + key + '+1 where RoundID= ? and ' + key + ' < 4', [game.RoundID], function (e) {
                            if (e) {
                                logger.error(e);
                            }
                        });
                    }
                });

            }
        }
    });
}


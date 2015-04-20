/**
 * 更新比赛状态
 * */
var query = require("../../service/common/connection").query;

var request = require("request");
//var dom = require("jsdom");
var cheerio = require("cheerio");


module.exports = function () {
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
                }

            });
        }
    });
};


function findScore(liveUrl, id, game) {
    console.log("request hupu game page " + liveUrl + " to get score.. ");

    request(liveUrl, function (errors, response, body) {
        if (!errors && response && response.statusCode == 200) {
            var $ = cheerio.load(body);
            //比分
            var hs = "0" , vs = "0";
            var HostScoreBox = $(".team_vs_box .team_a h2").eq(0);
            var VisitingScoreBox = $(".team_vs_box .team_b h2").eq(0);
            if (HostScoreBox.length) {
                hs = HostScoreBox.text();
            }
            if (VisitingScoreBox.length) {
                vs = VisitingScoreBox.text();
            }
            if (/^\d+$/.test(hs) && /^\d+$/.test(vs)) {
                updateScore(id, hs, vs);
            }

            //状态
            var status;
            var statusBox = $(".table_list .table_list_c li.on p").eq(0);
            if (statusBox.length) {
                var text = statusBox.text().trim();
                if (text == "已结束") {
                    status = 2;
                }
            }
            if (status) {
                updateStatus(id, status, hs > vs ? game.HostID : game.VisitID, game);
            }

        }
    });
}


function updateScore(id, hs, vs) {
    query("update playball.Game set ? where GameID=" + id, {
        HostScore: hs,
        VisitScore: vs
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function updateStatus(id, status, winnerID, game) {
    query("update playball.Game set ? where GameID=" + id, {
        Status: status,
        WinnerID: winnerID || 0
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            if (status == 2 && game && game.IsPlayOff == 1 && game.RoundID) {
                query('select * from playball.PlayOff where RoundID = ?', [game.RoundID], function (err, round) {
                    if (!err && round && round.length) {
                        round = round[0];
                        var key = winnerID == round.HostID ? 'HostWin' : 'VisitWin';
                        query('update playball.PlayOff set ' + key + '= ' + key + '+1 where RoundID= ?', [game.RoundID], function (e) {
                            if (e) {
                                console.log(e);
                            }
                        });
                    }
                });

            }
        }
    });
}


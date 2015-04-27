/**
 * waha 比赛录像链接 , 比赛在线回放
 *
 * 抓取今天的比赛录像
 * */
var CopyCat = require("../copycat");
var GameService = require("../../service/game_service");
var TeamService = require("../../service/team_service");
var ReplayService = require("../../service/replay_service");
var date = require('../../util/date_util');
var URL = 'http://www.52waha.com';
var url = require("url");
var async = require('async');

module.exports = function () {
    GameService.loadGames({
        type: 1,
        fromDate: date.duration(1).begin,
//        fromDate:new Date(Date.parse("2015-04-02")),
        endDate: date.duration(1).end
    }, function (err, games) {
        if (games && games.length) {
            findDownload(games);

            findReplay(games);


        }
    });
};

var titleMatch = function (titleEl, game) {
    var gameTime = game.Time;
    var timeReg = new RegExp(gameTime.getMonth() + 1 + "月(0)?" + gameTime.getDate() + "日");
    var teamReg = new RegExp("(" + TeamService.short(game.HostName) + "vs" + TeamService.short(game.VisitName) + ")|(" + TeamService.short(game.VisitName) + "vs" + TeamService.short(game.HostName) + ")");
    if (titleEl.text().match(timeReg) && titleEl.text().match(teamReg)) {
        return titleEl.attr("href");
    }
};

//find download
var findDownload = function (games) {
    CopyCat(url.resolve(URL, "/down/basketball/NBA-bisai"), function ($) {
        var list = $('.down-block table .tit');
        games.forEach(function (game) {
            list.each(function (i, titleEl) {
                var link = titleMatch($(titleEl), game);
                if (link) {
                    console.log("match:", game.HostName, game.VisitName, link);


                    ReplayService.addReplay({
                        GameID: game.GameID,
                        Type: 2,
                        Link: url.resolve(URL, link),
                        Title: "录像下载"
                    }, function () {
                    });
                }
            });
        });
    });
};

var findReplay = function (games) {
    CopyCat(url.resolve(URL, "/video/basketball"), function ($) {
        var list = $('.down-block table .tit');
        games.forEach(function (game) {
            list.each(function (i, titleEl) {
                var link = titleMatch($(titleEl), game);
                if (link) {
                    console.log("video:", game.HostName, game.VisitName, link);

                    //继续爬详情页
                    CopyCat(url.resolve(URL, link), function ($) {
                        var qq = $('#videopartlist .qq');
                        var sina = $('#videopartlist .sina');

                        if (qq.length) {
                            saveVideos($,qq.parents("dl").find(".pc_link"), game,"QQ");
                        }

                        if(sina.length){
                            saveVideos($,sina.parents('dl').find(".pc_link"),game,"新浪");
                        }
                    });
                }
            });
        });
    });
};

var saveVideos = function($,links,game,source){
    if (links.length && links.length == 4) {
        var tasks = [];
        links.each(function (i, link) {
            tasks.push(function (cb) {
                CopyCat(url.resolve(URL, $(link).attr("href")), function ($) {
                    var qqUrl = $('#objVideo param[name="movie"]');
                    if (qqUrl.length) {
                        cb(null , {
                            GameID: game.GameID,
                            Type: 1,
                            Link: qqUrl.attr("value"),
                            Title: "["+source+"]" + numToText(1 + i)
                        });
                    } else {
                        cb();
                    }
                });
            });
        });
        async.parallel(tasks, function (err, results) {
            if (err) {
                return;
            }
            async.series(results.map(function (data) {
                return function (cb) {
                    if (data) {
                        ReplayService.addReplay(data, function () {
                            cb();
                        })
                    } else {
                        cb();
                    }
                }
            }));
        });
    }
};

var numToText = function (i) {
    return {
        "1": "第一节",
        "2": "第二节",
        "3": "第三节",
        "4": "第四节"
    }[i];
};

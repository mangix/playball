/**
 * waha 比赛录像链接
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

module.exports = function () {
    GameService.loadGames({
        type: 1,
        fromDate: date.duration(1).begin,
        endDate: date.duration(1).end
    }, function (err, games) {
        if (games && games.length) {
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
        }
    });
};

var titleMatch = function (titleEl, game) {
    var timeEl = titleEl.find('.time');
    var gameTime = game.Time;
    var timeReg = new RegExp(gameTime.getMonth() + 1 + "月(0)?" + gameTime.getDate() + "日");
    var teamReg = new RegExp("(" + TeamService.short(game.HostName) + "vs" + TeamService.short(game.VisitName) + ")|(" + TeamService.short(game.VisitName) + "vs" + TeamService.short(game.HostName) + ")");
    if (timeEl.text().match(timeReg) && titleEl.text().match(teamReg)) {
        return titleEl.attr("href");
    }
};


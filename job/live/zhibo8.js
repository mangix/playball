var request = require("request");
var cheerio = require("cheerio");

var gameService = require("../../service/game_service/index");
var liveService = require("../../service/live_service/index");
var teamService = require("../../service/team_service/index");

var URL = 'http://www.zhibo8.cc';
var DateUtil = require("../../util/date_util");
var CopyCat = require("../copycat");


var logger = console;

var findLive = module.exports = function (runner) {
    logger = runner || console;

    var d = DateUtil.duration(7);

    gameService.loadGames({
        type: 1,
        fromDate: d.begin,
        endDate: d.end
    }, function (err, games) {
        CopyCat(URL + '/index.html', function ($) {
            games.forEach(function (game) {
                if (game.Status != 2) {
                    matchGame(game, $);
                }
            });
        });

    });
};

findLive();

var matchGame = function (game, $) {
    var time = new Date(Date.parse(game.Time));
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var h = teamService.short(game.HostName);
    var v = teamService.short(game.VisitName);

    var dateBox = $("#left .box");

    dateBox.each(function (i, box) {
        box = $(box);
        var list = box.find('.content li');
        var dateMatch = box.find('h2').text().match(/(\d+)月(\d+)日/);
        if (!dateMatch) {
            return;
        }
        if (month == +dateMatch[1] && date == +dateMatch[2]) {
            list.each(function (j, g) {
                var content = $(g).text();
                if (~content.indexOf(h) && ~content.indexOf(v)) {
                    $(g).find('a').each(function (i, a) {
                        var name = $(a).text();
                        var link = $(a).attr('href');

                        if (name.indexOf('直播') == -1 || ~name.indexOf('美女')) {
                            return;
                        }

                        if (link[0] == '/') {
                            detail(URL + link, game);
                        } else {
                            addLive(game, name, link);
                        }
                    });
                }
            });
        }

    });
};

var detail = function (url, game) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var $ = cheerio.load(body);

            $('#signals a').each(function (i, a) {
                var name = $(a).text();
                var link = $(a).attr('href');

                if (~name.indexOf('客户端') || ~name.indexOf('比分') || ~name.indexOf('文字')) {
                    return;
                }

                addLive(game, name, link);
            });
        }
    });
};

var addLive = function (game, name, link) {
    liveService.hasLive(game.GameID, link, function (err, results) {
        if (!err && results && results.length) {
            liveService.addLive({
                GameID: game.GameID,
                Name: name,
                Link: link,
                Type: ~name.indexOf('文字') ? 2 : (~name.indexOf('比分') ? 3 : 1)
            }, function () {
                logger.info('add live:', game);
            });
        }
    });
};
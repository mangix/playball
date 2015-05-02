var request = require("request");
var cheerio = require("cheerio");

var gameService = require("../../service/game_service/index");
var liveService = require("../../service/live_service/index");

var URL = 'http://www.zhibo8.cc';
var DateUtil = require("../../util/date_util");
var CopyCat = require("../copycat");


var teamsShortName = {
    "金州勇士": "勇士",
    '休斯顿火箭': '火箭',
    '洛杉矶快船': '快船',
    "波特兰开拓者": "开拓者",
    "孟菲斯灰熊": '灰熊',
    "圣安东尼奥马刺": '马刺',
    '达拉斯小牛': '小牛',
    '新奥尔良鹈鹕': '鹈鹕',
    '俄克拉荷马城雷霆': '雷霆',
    '菲尼克斯太阳': '太阳',
    '犹他爵士': '爵士',
    '丹佛掘金': '掘金',
    '洛杉矶湖人': '湖人',
    '明尼苏达森林狼': '森林狼',
    '萨克拉门托国王': '国王',
    '多伦多猛龙': '猛龙',
    '波士顿凯尔特人': '凯尔特人',
    '布鲁克林篮网': '篮网',
    '费城76人': '76人',
    '纽约尼克斯': '尼克斯',
    '亚特兰大老鹰': '老鹰',
    '华盛顿奇才': '奇才',
    '迈阿密热火': '热火',
    '夏洛特黄蜂': '黄蜂',
    '奥兰多魔术': '魔术',
    '克利夫兰骑士': '骑士',
    '芝加哥公牛': "公牛",
    '密尔沃基雄鹿': '雄鹿',
    '印第安纳步行者': '步行者',
    '底特律活塞': '活塞'
};
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
                matchGame(game, $);
            });
        });

    });
};

findLive();

var matchGame = function (game, $) {
    var time = new Date(Date.parse(game.Time));
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var h = teamsShortName[game.HostName];
    var v = teamsShortName[game.VisitName];

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
    liveService.addLive({
        GameID: game.GameID,
        Name: name,
        Link: link,
        Type: ~name.indexOf('文字') ? 2 : (~name.indexOf('比分') ? 3 : 1)
    }, function () {
        logger.info('add live:', game);
    });
};
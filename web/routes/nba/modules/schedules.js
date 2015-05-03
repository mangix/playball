/**
 * 直播列表模块
 *
 * 按Page加载赛程列表
 *
 * PageSize = 7;
 * Page 从0 开始
 *
 * Page＝0，从本周开始
 * */

var DateUtil = require("../../../../util/date_util");
var GameService = require("../../../../service/game_service");
var TeamService = require("../../../../service/team_service");
var moment = require("moment");

var PAGE_SIZE = 7;

module.exports = function (page, cb) {
    page = page || 0;
    /**
     * 计算起始日期
     * */

    var startDate = moment().weekday(-6).toDate();
    startDate.setDate(startDate.getDate() + page * PAGE_SIZE);

    var d = DateUtil.duration(PAGE_SIZE, startDate);

    GameService.loadGames({
        type: 1,
        fromDate: d.begin,
        endDate: d.end,
        live: true,
        replay: true,
        byDate: true,
        shortName: true
    }, function (err, games) {
        games = games || {};

        //补齐没有比赛的日期
        for (var i = d.begin; i <= d.end;) {
            if (!games[+i]) {
                games[+i] = [];
            }
            i = new Date(new Date(i).setDate(i.getDate() + 1));
        }

        //转成数组， 保证顺序
        var list = Object.keys(games).sort(function (o1, o2) {
            return o1 - o2;
        }).map(function (date, i) {
            games[date].forEach(function (game) {
                game.time = moment(game.Time).format("hh:mm");
                game.hostLogo = TeamService.logo(game.HostName);
                game.visitLogo = TeamService.logo(game.VisitName);
            });
            var isToday = DateUtil.isToday(new Date(+date));
            return {
                date: moment(new Date(+date)).format('MM-DD'),
                week: DateUtil.week(date, true),
                list: games[date],
                current: page == 0 ? isToday : i == 0
            };
        });

        cb(null, list);
    });

};
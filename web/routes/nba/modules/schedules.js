/**
 * 直播列表模块
 *
 * 按Page加载赛程列表
 *
 * PageSize = 7;
 * Page 从0 开始
 *
 * Page＝0，从当天开始
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
    var startDate = new Date();
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

        //转成数组， 保证顺序
        var list = Object.keys(games).map(function (date) {
            games[date].forEach(function (game) {
                game.time = moment(game.Time).format("hh:mm");
                game.hostLogo = TeamService.logo(game.HostName);
                game.visitLogo = TeamService.logo(game.VisitName);
            });
            return {
                date: moment(new Date(+date)).format('MM-DD'),
                week: DateUtil.week(date, true),
                list: games[date]
            };
        }).sort(function (o1, o2) {
            return o1.date - o2.date;
        });

        cb(null, list);
    });

};
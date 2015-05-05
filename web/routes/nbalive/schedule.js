/**
 *
 * 这个接口为 nbalive 提供赛程服务
 *
 * */

var GameService = require("../../../service/game_service");
var DateUtil = require("../../../util/date_util");
var moment = require("moment");

exports.execute = function (req, res) {
    var date = req.query.date;

    if (!date || !Date.parse(date)) {
        date = new Date();
    } else {
        date = new Date(Date.parse(date));
    }

    var d = DateUtil.duration(1, date);

    //response data
    var resData = {
        code: 200,
        data: {}
    };


    GameService.loadGames({
        type: 1,
        fromDate: d.begin,
        endDate: d.end,
        shortName: true
    }, function (err, results) {
        if (err) {
            resData.code = 500;
        } else {
            resData.data = parseData(results);
        }

        res.send(resData);
    });
};

var parseData = function (results) {
    return results.map(function (row) {
        return {
            time: moment(row.Time).format("hh:mm"),
            score: row.HostScore + "-" + row.VisitScore,
            host: row.hostShortName,
            visiting: row.visitShortName,
            status: row.Status,
            gameId: row.ThirdID,
            id: row.GameID,
            hostScore: row.HostScore,
            visitScore: row.VisitScore
        }
    });
};

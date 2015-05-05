/**
 *
 * 这个接口为 nbalive 提供赛程服务
 *
 * */

var StatisticService = require("../../../service/statistic_service");

exports.execute = function (req, res) {
    var gameID = req.query.id;

    var resData = {
        code: 200,
        data: {}
    };

    StatisticService.loadStatistic(gameID, function (err, statistic) {
        if (err) {
            resData.code = 500;
            resData.data = "error";
        } else {
            if (statistic) {
                try {
                    resData.data = statistic;
                } catch (e) {
                    resData.data = [];
                }
            } else {
                resData.data = [];
            }
        }
        res.send(resData);
    });

};

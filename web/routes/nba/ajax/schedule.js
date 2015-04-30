/**
 * 获取赛程Ajax
 *
 * url 参数
 * page
 * */
var schedule = require("../modules/schedules");

exports.execute = function (req, res) {

    var page = req.query.page || 0;


    schedule(page, function (err, list) {

        res.result("success", {
            lives: list
        });
    });
};

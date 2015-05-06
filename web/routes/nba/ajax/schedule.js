/**
 * 获取赛程Ajax
 *
 * url 参数
 * page
 * */
var schedule = require("../bricks/schedules");
var Lego = require("node-lego");

exports.execute = function (req, res) {
    new Lego().start({
        page: req.query.page || 0
    }).pipe(schedule).done(function(data){
        res.result("success", data);
    });
};

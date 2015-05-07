var async = require("async");
var _ = require("underscore");
var Lego = require("node-lego");
var PlayOffs = require("./bricks/index/playoff");
var Schedules = require("./bricks/index/schedules");

exports.execute = function (req, res) {
    new Lego().start({
        page: 0
    })
        .pipe(PlayOffs, Schedules)
        .done(function (data) {
            res.result("success", data);
        });
};


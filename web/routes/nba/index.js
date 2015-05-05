var async = require("async");
var _ = require("underscore");
var Lego = require("node-lego");
var PlayOffs = require("./bricks/playoff");
var Schedules = require("./bricks/schedules");

exports.execute = function (req, res) {
    new Lego().start({
        page: 0
    })
        .pipe(PlayOffs, Schedules)
        .done(function (data) {
            res.result("success", data);
        });
};


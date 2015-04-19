var liveDAO = require("./dao/live");
var LiveEntity = require("./entity/live");

exports.addLive = function (live, cb) {
    if (!live) {
        cb(new Error("live can't be empty"));
        return;
    }

    var data = LiveEntity.create(live).data();

    liveDAO.insert(data, function (err, id) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(err, id);
        }
    });
};


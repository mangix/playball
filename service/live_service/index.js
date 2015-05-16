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

exports.loadLiveByGameID = function (gameId, cb) {
    liveDAO.loadByGameID(gameId, function (err, list) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(null, list);
        }
    });
};

exports.hasLive = function (gameId, link) {
    liveDAO.loadByGameIdAndLink(gameId, link, function (err, results) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(err, results);
        }
    });

};


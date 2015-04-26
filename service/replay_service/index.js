var replayDAO = require("./dao/replay");
var ReplayEntity = require("./entity/replay");

exports.addReplay = function (replay, cb) {
    if (!replay) {
        cb(new Error("replay can't be empty"));
        return;
    }

    var data = ReplayEntity.create(replay).data();

    replayDAO.insert(data, function (err, id) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(err, id);
        }
    });
};

exports.loadReplayByGameID = function (gameId, cb) {
    replayDAO.loadByGameID(gameId, function (err, list) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(null, list);
        }
    });
};


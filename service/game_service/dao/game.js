var query = require("../../common/connection").query;

/**
 * game should contains
 * Type,HostID,HostName,VisitID,VisitName,Time,Status,Result,WinnerID,Memo
 * */
exports.insert = function (game, cb) {
    query('insert into playball.Game set ?', game, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result.insertId);
        }
    });
};
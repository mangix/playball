var query = require("../../common/connection").query;
var columns = ['GameID', 'Statistic'
];
/**
 * insert or update statistic
 *
 * */
exports.insertOrUpdate = function (gameId, statistic, cb) {
    query('insert into playball.Statistic(GameID,Statistic) values(?,?) ON DUPLICATE KEY UPDATE Statistic=?', [gameId , statistic, statistic], function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null);
        }
    });
};



exports.loadStatisticByGameID = function (gameId, cb) {
    query('select ?? from Game where GameID=?', [columns  , gameId], cb);
};
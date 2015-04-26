var query = require("../../common/connection").query;
var columns = ['ReplayID', 'GameID',
    'Link','Title','Type'
];


exports.insert = function (replay, cb) {
    query('insert into playball.Replay set ?', replay, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result.insertId);
        }
    });
};

/**
 * 根据GameID 获取Replay
 * */
exports.loadByGameID = function (gameId, cb) {
    query('select ?? from Replay where gameid=? order by Type asc', [columns ,gameId], cb);
};
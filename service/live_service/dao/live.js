var query = require("../../common/connection").query;
var columns = ['LiveID', 'GameID',
    'Link','Name','Type'
];


exports.insert = function (live, cb) {
    query('insert into playball.Live set ?', live, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result.insertId);
        }
    });
};

/**
 * 根据GameID 获取直播列表
 * */
exports.loadByGameID = function (gameId, cb) {
    query('select ?? from Live where gameid=? order by Type asc', [columns ,gameId], cb);
};
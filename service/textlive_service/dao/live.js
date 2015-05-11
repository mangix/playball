var query = require("../../common/connection").query;
var columns = ['ID', 'GameID',
    'Time', 'Score', 'Content'
];


exports.insert = function (live, cb) {
    query('insert into TextLive set ?', live, function (err, result) {
        if (err) {
            cb(err)
        } else {
            cb(null, result.insertId);
        }
    });
};

/**
 * 根据GameID 获取全部文字直播
 * */
exports.loadByGameID = function (gameId, channel , beginId, cb) {
    query('select ?? from TextLive where GameID=? and channel=? and ID>?', [columns , gameId, channel,beginId], cb);
};
var query = require("../../common/connection").query;
var columns = ['GameID', 'Type',
    'HostID', 'HostName', 'HostScore',
    'VisitID', 'VisitName', 'VisitScore',
    'Time', 'Status', 'Memo',
    'ThirdID'
];
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

/**
 * 根据
 * Type，
 * fromDate,endDate
 * 获取所有比赛
 * */
exports.loadByTypeTime = function (type, fromDate, endDate, cb) {
    query('select ?? from Game where Type=? and Time between ? and ?', [columns , type, fromDate , endDate], cb);
};

exports.loadGamesByRoundID = function (roundId, cb) {
    query('select ?? from Game where RoundID=?', [columns  , roundId], cb);
};
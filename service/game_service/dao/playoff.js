var query = require("../../common/connection").query;
var columns = ['RoundID',
    'HostID', 'HostName', 'HostRank','HostWin',
    'VisitID', 'VisitName', 'VisitRank','VisitWin',
    'Round', 'Area', 'Season'
];

/**
 *
 * */
exports.loadBySeason = function (season, cb) {
    query('select ?? from PlayOff where Season=?', [columns ,season], cb);
};
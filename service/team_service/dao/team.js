var query = require("../../common/connection").query;
var columns = ['TeamID', 'Name',
    'ShortName','Type','Logo'
];

/**
 * 获取所有的Team
 * */
exports.loadAllTeam = function (cb) {
    query('select ?? from Team', [columns], cb);
};
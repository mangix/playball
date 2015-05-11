var teams = [];
var teamDAO = require("./dao/team");
var teamLoad = false;
var waitQueue = [];
//load teams
teamDAO.loadAllTeam(function (err, list) {
    teams = list || [];
    teamLoad = true;
    while (waitQueue.length) {
        waitQueue.shift()();
    }
});

/**
 * 等teams初始化完成
 * */
exports.wait = function (cb) {
    if (!cb) {
        return;
    }
    if (teamLoad) {
        cb();
    } else {
        waitQueue.push(cb);
    }
};

exports.short = function (teamName) {
    var team = teams.filter(function (t) {
        return t.Name == teamName
    });
    return (team[0] && team[0].ShortName ) || '';
};

exports.logo = function (teamShortName) {
    teamShortName = exports.short(teamShortName) || teamShortName;

    var team = teams.filter(function (t) {
        return t.ShortName == teamShortName;
    });
    if (team.length) {
        return "/playball/static/images/logo/" + team[0].Logo;
    } else {
        return "";
    }
};

exports.id = function (teamName) {
    var team = teams.filter(function (t) {
        return t.ShortName == teamName || t.Name == teamName;
    });
    if (team.length) {
        return team[0].TeamID;
    }
    return 0;
};
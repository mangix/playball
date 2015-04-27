var teams = [];
var teamDAO = require("./dao/team");

//load teams
teamDAO.loadAllTeam(function (err, list) {
    teams = list || [];
});

exports.short = function (teamName) {
    var team = teams.filter(function (t) {
        return t.Name == teamName
    });
    return (team[0] && team[0].ShortName )|| '';
};

exports.logo = function (teamShortName) {
    teamShortName = exports.short(teamShortName) || teamShortName;

    var team = teams.filter(function (t) {
        return t.ShortName == teamShortName;
    });
    if(team.length){
        return "/playball/static/images/logo/"+ team[0].Logo;
    }else{
        return "";
    }
};
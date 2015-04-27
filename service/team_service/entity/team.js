/**
 * Team Entity
 * */


var util = require("util");
var _ = require("underscore");

var Team = function () {

    var column = this.column = {};

    column.Name = null;
    column.ShortName = null;
    column.Type = 1;
    column.Logo = null;

};

Team.prototype.data = function () {
    return this.column;
};

Team.create = function (team) {
    var instance = new Team();
    _.extendOwn(instance.column, team);
    return instance;
};


module.exports = Team;
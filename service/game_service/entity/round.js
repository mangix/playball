/**
 * PlayOff Round Entity
 * */


var _ = require("underscore");

var Round = function () {

    var column = this.column = {};

    column.RoundID = 0;
    column.HostID = 0;
    column.HostName = '';
    column.HostRank = 0;
    column.HostWin = 0;
    column.VisitID = 0;
    column.VisitName = 0;
    column.VisitRank = 0;
    column.VisitWin = 0;
    column.Round = 1;
    column.Area = Round.AREA_WEST;
    column.Season = 0;
    column.Status = 0;

};

Round.prototype.data = function () {
    return this.column;
};

Round.create = function (round) {
    var instance = new Round();
    _.extendOwn(instance.column, round);
    return instance;
};

Round.AREA_WEST = 1;
Round.AREA_EAST = 2;
Round.STATUS_IN = 1;
Round.STATUS_OVER = 2;

module.exports = Round;
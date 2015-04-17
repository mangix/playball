/**
 * Game Entity
 * */


var util = require("util");
var _ = require("underscore");

var Game = function () {

    var column = this.column = {};

    column.Type = 1;
    column.HostID = null;
    column.VisitID = null;
    column.HostName = null;
    column.VisitName = null;
    column.Time = null;
    column.Status = Game.STATUS_NOT_BEGIN;
    column.Result = null;
    column.WinnerID = null;
    column.Memo = null;
    column.HostScore = null;
    column.VisitScore = null;
    column.ThirdID = null;
    column.IsPlayOff = 1;
    column.RoundID = 0;

};

Game.prototype.data = function () {
    return this.column;
};

Game.create = function (game) {
    var instance = new Game();
    _.extendOwn(instance.column, game);
    return instance;
};


Game.STATUS_NOT_BEGIN = 0;
Game.STATUS_IN = 1;
Game.STATUS_OVER = 2;

module.exports = Game;
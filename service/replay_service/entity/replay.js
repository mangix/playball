/**
 * Game Entity
 * */


var util = require("util");
var _ = require("underscore");

var Replay = function () {

    var column = this.column = {};

    column.GameID = null;
    column.Link = null;
    column.Title = null;
    column.Type = 1;

};

Replay.prototype.data = function () {
    return this.column;
};

Replay.create = function (replay) {
    var instance = new Replay();
    _.extendOwn(instance.column, replay);
    return instance;
};


Replay.TYPE_VIDEO = 1;
Replay.TYPE_TEXT = 2;
module.exports = Replay;
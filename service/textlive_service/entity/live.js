/**
 * Game Entity
 * */


var util = require("util");
var _ = require("underscore");

var Live = function () {

    var column = this.column = {};

    column.GameID = null;
    column.Score = null;
    column.Time = null;
    column.Content = null;
    column.Channel = 1;

};

Live.prototype.data = function () {
    return this.column;
};

Live.create = function (live) {
    var instance = new Live();
    _.extendOwn(instance.column, live);
    return instance;
};


Live.CHANNEL_HUPU = 1;
Live.CHANNEL_SINA = 2;
module.exports = Live;
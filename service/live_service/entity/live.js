/**
 * Game Entity
 * */


var util = require("util");
var _ = require("underscore");

var Live = function () {

    var column = this.column = {};

    column.GameID = null;
    column.Link = null;
    column.Name = null;
    column.Type = 1;

};

Live.prototype.data = function () {
    return this.column;
};

Live.create = function (live) {
    var instance = new Live();
    _.extendOwn(instance.column, live);
    return instance;
};


Live.TYPE_VIDEO = 1;
Live.TYPE_TEXT = 2;
module.exports = Live;
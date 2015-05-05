/**
 * Statistic Entity
 * */


var util = require("util");
var _ = require("underscore");

var Statistic = function () {

    var column = this.column = {};

    column.GameID = 0;
    column.Statistic = "";
};

Statistic.prototype.data = function () {
    return this.column;
};

Statistic.create = function (statistic) {
    var instance = new Statistic();
    _.extendOwn(instance.column, statistic);
    return instance;
};



module.exports = Statistic;
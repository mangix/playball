var mysql = require('mysql');
var pool = mysql.createPool(require("./db"));

var query = function () {
    /*parse params as same as connection.query*/
    var args = Array.prototype.slice.call(arguments, 0);
    var cb = arguments[arguments.length - 1];
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            cb(err);
            return;
        }
        args[args.length - 1] = function (err, rows, fields) {
            connection.release();
            cb.call(this, err, rows, fields);
        };

        connection.query.apply(connection, args);
    });
};

exports.pool = pool;
exports.query = query;
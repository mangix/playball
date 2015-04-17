var Game = require("./game");
var gameDao = require("./dao/game");

/**
 * add a game
 *
 * */
exports.addGame = function (game, cb) {
    if (!game) {
        cb(new Error("game can't be empty"));
        return;
    }

    game = Game.create(game).data();

    gameDao.insert(game, function (err, id) {
        if (err) {
            cb(new Error('insert db error '))
        } else {
            cb(null, id)
        }

    });
};

/**
 * options :{
 *     type: 1, 比赛类型
 *     fromDate:
 *     endDate: 时间区间
 *     live:false, 是否需要直播信息,
 *     replay:false , 是否需要录像信息
 * }
 * */
exports.loadGames = function (options, cb) {
    gameDao.loadByTypeTime(options.type, options.fromDate, options.endDate,
        function (err, results) {
            if (err) {
                cb(new Error('db error'));
            } else {
                cb(err, results);
            }
        });
};
/**
 *
 * add a game
 * */
var Game = require("./game");
var gameDao = require("./dao/game");

exports.addGame = function (game, cb) {
    if (!game) {
        cb(new Error("game can't be empty"));
        return;
    }

    game = Game.create(game).data();

    gameDao.insert(game, cb);
};
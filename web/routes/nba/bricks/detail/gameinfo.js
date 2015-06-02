var Brick = require("node-lego").Brick;
var GameService = require("../../../../../service/game_service");
var TeamService = require("../../../../../service/team_service");
var logger = require("winston").loggers.get("app");
var moment = require("moment");
/**
 * 比赛基础信息
 * */

module.exports = Brick.create("GameInfo", function (params, finish) {
    var gameId = params.gameId;
    GameService.loadGameById(gameId, function (err, game) {
        if (err) {
            logger.error("Load Game Error", err);
            finish(Brick.FAIL);
        } else {
            if (game && game.length) {
                game = game[0];
            }
            if(game.Time){
                game.Time = moment(game.Time).format("YYYY年MM月DD日 HH点mm分")
            }
            if(game.HostName){
                game.HostLogo = TeamService.logo(game.HostName);
            }
            if(game.VisitName){
                game.VisitLogo = TeamService.logo(game.VisitName);
            }
            game.StatusText = GameService.status(game.Status);

            finish(Brick.SUCCESS, game);
        }
    });
},"/nba/modules/detail/gameinfo.jade");
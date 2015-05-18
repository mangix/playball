/**
 * 获取赛程job
 *
 * */
var request = require("request");

var START = new Date(2015, 4, 19);
var END = new Date(2015, 4, 30);
//var END = new Date(2014, 9, 30);
var fs = require("fs");
var path = require("path");
var CopyCat = require("../copycat");

var moment = require("moment");
var GameService = require("../../service/game_service");
var TeamService = require("../../service/team_service");

var format = function (date) {
    return moment(date).format("YYYY-MM-DD");
};

var nextDay = function () {
    current.setDate(current.getDate() + 1);
};

var current = new Date(START);

var result = [];
var logger = console;

var find = module.exports = function (runner) {
    logger = runner || console;
    if (current > END) {
        return;
    }
    console.log(format(current));
    CopyCat("http://g.hupu.com/nba/schedule/" + format(current), function ($) {
        var trs = $(".players_table tr");
        trs.each(function (i, tr) {
            tr = $(tr);
            if (tr.hasClass('linglei')) {
                //日期tr
                var match = tr.text().match(/(\d+)月(\d+)日/);
                if (match) {
                    current = new Date(current.getFullYear(), match[1] - 1, +match[2]);
                } else {
                    //TODO dom error
                }
            } else {
                var tds = tr.find("td");
                var time = tds.eq(0).text().match(/(\d+):(\d+)/);
                if (!time) {
                    return;
                }
                var gameTime = new Date(current);
                gameTime.setHours(+time[1]);
                gameTime.setMinutes(+time[2]);
                gameTime.setSeconds(0);
                gameTime.setMilliseconds(0);

                var gameTeams = tds.eq(1).find("a");
                var hostName = gameTeams.eq(0).text();
                var visitName = gameTeams.eq(1).text();
                var ThirdID = 0;

                var link = tds.eq(2).find("a");
                if (link.length) {
                    var match = link.attr("href").match(/boxscore_(\d+)/);
                    if (match) {
                        ThirdID = match[1];
                    }
                }

                //Save Game
                TeamService.wait(function () {


                    GameService.addGame({
                        Type: 1,
                        HostID: TeamService.id(hostName),
                        HostName: hostName,
                        VisitID: TeamService.id(visitName),
                        VisitName: visitName,
                        Time: gameTime,
                        Status: 0,
                        WinnerID: 0,
                        Memo: "NBA季后赛 " + TeamService.short(hostName) + "-" + TeamService.short(visitName),
                        IsPlayOff: 1,
                        Season: 20142015,
                        ThirdID: ThirdID,
                        HostScore: 0,
                        VisitScore: 0
                    }, function (e) {
                        if(e){
                            console.log(e)
                        }
                    })
                })
            }
        });

        nextDay();
        find();
    });


};

find();

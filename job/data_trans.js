var query = require("../service/common/connection").query;

var nbaQuery = require("../../nbaserver/dao/connection").query;

var gameService = require("../service/game_service");

nbaQuery('select * from schedule', function (err, results) {
    results.forEach(function (row) {
        var times = row.Time.split(":");
        var date = row.Date;
        date.setHours(times[0]);
        date.setMinutes(times[1]);
        date.setSeconds(times[2]);

        var game = {
            Type:1,
            HostName:row.Host,
            VisitName:row.Visiting,
            HostScore:row.HostScore,
            VisitScore:row.VisitingScore,
            Status:row.Status,
            Time: date,
            ThirdID:row.HupuID
        };

        gameService.addGame(game,function(err,id){
            if(err){
                console.log(err)
            }
            console.log('add game :'+id)

        });
    });
});
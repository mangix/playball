var gameService = require("../../service/game_service");

//gameService.addGame({
//
//}, function () {
//
//});

gameService.loadGames({
    type:1,
    fromDate:new Date(Date.parse('2015-04-17')),
    endDate :new Date(Date.parse('2015-04-20'))
},function(err , results){
//    console.log(results)

});

gameService.loadPlayOff(20142015, function(err,results){
    console.log(results)
});
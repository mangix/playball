var query = require("../service/common/connection").query;
//到5月15号的赛程

query("select * from Game where isPlayOff=1", function (err, results) {
    require("fs").writeFile("./playoff.json", JSON.stringify(results));
});
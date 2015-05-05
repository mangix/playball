var request = require('request'),
    cheerio = require('cheerio'),
    url = 'http://g.hupu.com/nba/daily/boxscore_';

var query = require("../../service/common/connection").query;
var CopyCat = require("../copycat");

var StatisticService = require("../../service/statistic_service");

var logger;
module.exports = function (runner) {
    logger = runner || console;

    query("select * from Game where ThirdID!=0 and Status=1", function (err, results) {
        if (results.length) {
            if (err) {
                logger.error('db query error!');
            } else {
                results.map(function (row) {
                    CopyCat(url + row.ThirdID + '.html', function ($) {
                        var statisticData = convertStatisticDataToJson($);

                        StatisticService.addOrUpdate(row.GameID, statisticData, function (err) {
                            if (err) {
                                logger.error("update statistic error, ", err);
                            } else {
                                logger.info("update game " + row.GameID + " suc");
                            }
                        });

                    });
                });
            }
        }
    });
};


function convertStatisticDataToJson($) {
    var result = [];

    $('.table_list_live').each(function (i, tableEle) {
        result.push([$(this).find('h2').text()]);
        $(this).find('tr').each(function (j, trEle) {
            var row = [];
            $(this).find('td').each(function (k, tdEle) {
                row.push($(this).text().trim());
            });
            result.push(row);
        });
    });

    return result;
}

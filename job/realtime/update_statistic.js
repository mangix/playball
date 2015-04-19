var request = require('request'),
	cheerio = require('cheerio'),
    query = require('../../dao/connection').query,
    url = 'http://g.hupu.com/nba/daily/boxscore_';

module.exports = function (){
    query("select * from nba.schedule where HupuID!=0 and status=1", function (err, results) {
        if(results.length){
            if (err) {
                console.log('db query error!');
            } else {
                results.map(function (row) {
                    request(url+row.HupuID+'.html', function (error, response, body) {
                    if (!error && response && response.statusCode == 200) {
                        var statisticData = convertStatisticDataToJson(body);
                        query("insert into nba.statistic set GameID=?, Data=? ON DUPLICATE KEY UPDATE Data=?", 
                            [row.ID, statisticData, statisticData], 
                            function (err) {
                                if (err) {
                                    console.log(err, row.ID+':'+statisticData);
                                }
                            });
                        }
                    });
                });
            }
        }
    });
};


function convertStatisticDataToJson(rawHtml){
	var $ = cheerio.load(rawHtml),
		result = [];

	$('.table_list_live').each(function(i, tableEle){
        result.push([$(this).find('h2').text()]);
		$(this).find('tr').each(function(j, trEle){	
            var row = [];		
			$(this).find('td').each(function(k, tdEle){
                row.push($(this).text().trim());	
			});
			result.push(row);
		});
	});

	return JSON.stringify(result);
}


var request = require("request");
var cheerio = require('cheerio');


module.exports = function (url, cb) {
    request({
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36"
        }
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            console.log("request:" + url + " error, " + (err || ("code:" + response.statusCode)));
            cb(cheerio.load('<div></div>'));
        } else {
            cb(cheerio.load(body));
        }
    });
};
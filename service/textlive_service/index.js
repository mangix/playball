var liveDAO = require("./dao/live");
var LiveEntity = require("./entity/live");
var _ = require("underscore");

exports.addTextLive = function (live, cb) {
    if (!live) {
        cb(new Error("live can't be empty"));
        return;
    }

    var data = LiveEntity.create(live).data();

    liveDAO.insert(data, function (err, id) {
        if (err) {
            cb(new Error('db error'));
        } else {
            cb(err, id);
        }
    });
};

/**
 * 加载文字直播信息
 * @param options{Object}
 * {
 *      gameId:Number,
 *      channel:Number , //default LiveEntity.CHANNEL_HUPU
 *      beginId:Number , //起始ID, default 0 ,用于直播
 * }
 * @param cb{Function}
 * */
exports.loadLiveByGameID = function (options, cb) {
    options = _.extend({
        gameId: 0,
        channel: LiveEntity.CHANNEL_HUPU,
        beginId: 0
    }, options || {});


    liveDAO.loadByGameID(options.gameId, options.channel, options.beginId, function (err, list) {
        if (err) {
            cb(new Error('db error'));
        } else {
            list = list || [];
            var lastId = options.beginId;
            if (list.length) {
                lastId = list[list.length - 1].ID;
            }
            cb(null, {
                lastId: lastId,
                list: list
            });
        }
    });

};


$(function () {
    //播放器
    var player = require("../modules/player");

    var playerBox = $("#J_player_box");
    if (!playerBox.length) {
        return;
    }

    var links = $('#J_relay_ist a');
    links.on('click', function () {
        var url = $(this).attr("data-url");
        if (url) {
            player(playerBox[0], url);
        }
        links.removeClass("on");
        $(this).addClass("on");
    });


});


$(function () {
    //文字直播
    var table = $('#J_textlive');
    if (!table.length || table.attr("data-live") != "1") {
        return;
    }
    var id = 0;
    var gameId = table.attr("data-game");

    var trs = table.find("tr");
    if (trs.length) {
        id = $(trs[0]).attr("data-id");
    }

    var loadLive = function () {
        setTimeout(function () {
            $.ajax({
                url: "/playball/nba/ajax/textlive",
                data: {
                    gameId: gameId,
                    beginId: id
                },
                success: function (res) {
                    var trs = $(res).prependTo(table);
                    if (trs.length) {
                        id = $(0).attr("data-id");
                    }
                },
                complete: function () {
                    loadLive();
                }
            })
        }, 2000);
    };

    loadLive();

});
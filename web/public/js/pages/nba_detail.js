$(function () {
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
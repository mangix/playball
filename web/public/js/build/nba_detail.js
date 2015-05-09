(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var template =
    '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10" type="application/x-shockwave-flash" height="100%" width="100%" >' +
    '<param name="allowfullscreen" value="true">' +
    '<param name="movie" value="{url}">' +
    '<param name="quality" value="High">' +
    '<param name="wmode" value="opaque">' +
    '<param name="allowscriptaccess" value="always">' +
    '<embed id="11815_swf" src="{url}" quality="High" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" wmode="opaque" allowscriptaccess="always" allowfullscreen="true" height="100%" width="100%">' +
    '</object>';

var play = function (container, url) {
    container.innerHTML = template.replace(/\{url\}/g, url);
};

module.exports = play;
},{}],2:[function(require,module,exports){
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
},{"../modules/player":1}]},{},[2])
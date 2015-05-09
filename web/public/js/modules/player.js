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
    container.innerHTML = $(template.replace(/\{url\}/g, url));
};
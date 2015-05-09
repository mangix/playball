(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @param triggers{$Elements} triggers jquery elements
 * @param contents{$Elements} contents jquery elements
 * */

module.exports = function (triggers, contents) {
    if (!triggers.length || !contents.length) {
        return;
    }
    triggers.each(function (i, t) {
        $(t).on("click", function () {
            triggers.removeClass("on");
            $(this).addClass("on");
            contents.addClass("Hide");
            contents.eq(i).removeClass("Hide");
        });
    });
};

},{}],2:[function(require,module,exports){
/**
 * nba index
 * */

var Tab = require("../modules/tab");

/**
 * init schedule default tab
 *
 *
 * */
(function () {
    //init default tab
    Tab($(".J_tab_t a"), $(".J_tab_c .J_games"));

})();

/**
 * init schedule page
 *
 * */

(function () {
    var pageHolder = $('.J_schedule_page');
    var page = 0;
    if (!pageHolder.length) {
        return;
    }
    var pageBox = pageHolder.find(".pages");
    var pages = {
        0: pageHolder.find(".J_page")
    };


    pageHolder.find(".J_operate").each(function (i, op) {
        $(op).on("click", function (e) {
            e.preventDefault();
            if (i == 0 ) {
                //pre
                loadPage(--page, true);
            } else if (i == 1 ) {
                //next
                loadPage(++page);
            }
        });
    });

    var loadPage = function (index, pre) {
        if (pages[index]) {
            //已加载
            hidePages();
            pages[index].removeClass("Hide");
            return;
        }

        hidePages();

        //空壳子先
        pages[index] = $('<div class="live_page J_page Loading"></div>')[pre ? "prependTo" : "appendTo"](pageBox);

        $.ajax({
            url: "/playball/nba/ajax/schedule?page=" + index,
            success: function (html) {
                //替换pages[index]
                var newPage = $(html).insertAfter(pages[index]);
                pages[index].remove();
                pages[index] = newPage;

                Tab(newPage.find(".J_tab_t a"), newPage.find(".J_tab_c .J_games"));
            },
            error: function () {

            }
        });
    };

    var hidePages = function () {
        for (var o in pages) {
            if (pages.hasOwnProperty(o)) {
                pages[o].addClass("Hide");
            }
        }
    };

})();

},{"../modules/tab":1}]},{},[2])
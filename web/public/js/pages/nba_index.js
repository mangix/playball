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
    Tab($(".J_tab_t a"), $(".J_tab_c ul.games"));

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

                Tab(newPage.find(".J_tab_t a"), newPage.find(".J_tab_c ul.games"));
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

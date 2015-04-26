/**
 * nba index
 * */

(function () {
    //Tab
    var trigger = $(".J_tab_t").find("a");
    var content = $(".J_tab_c").find("ul.games");
    trigger.each(function (i, a) {
        $(a).on("click",function(){
            trigger.removeClass("on");
            $(this).addClass("on");
            content.addClass("Hide");
            content.eq(i).removeClass("Hide");
        });

    })
})();
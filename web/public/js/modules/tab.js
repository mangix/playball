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

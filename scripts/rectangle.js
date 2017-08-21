var rect;

jQuery.fn.rectangle = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.rectangle.defs, opts);
    this.initialize = function () {
        return this;
    }
    jQuery.fn.rectangle.defs = {};

    var instance = this;
    var element = jQuery(this);

    this.fadeElementsIn = function () {
        setTimeout(function () {
            $("#rect-border").css("opacity", 1);
        }, 500);

        setTimeout(function () {
            $("#hand-despair").css("opacity", 1);
        }, 1200);

        setTimeout(function () {
            $("#hand-help").css("opacity", 1);
        }, 1400);

        setTimeout(function () {
            $("#menu-main").css("opacity", 1);
        }, 2000);
    }

    this.changeMenu = function (menu) {
        $(".rect-menu").each(function () {
            $(this).css("transition", "opacity 0.7s ease-in-out");
        });

        $(".rect-menu").each(function () {
            $(this).css("opacity", 0);
        });

        setTimeout(function (menu) {
            $(".rect-menu").each(function () {
                $(this).css("display", "none");
            });

            $("#" + menu).css("display", "flex");

            setTimeout(function (menu) {
                $("#" + menu).css("opacity", 1);
            }, 50, menu);
        }, 700, menu);
    }

    return this.initialize();
}

$('html').mousemove(function (e) {
    var wx = $(window).width();
    var wy = $(window).height();

    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var newx = x - wx / 2;
    var newy = y - wy / 2;

    $('span').text(newx + ", " + newy);

    $('#parallax-wrapper .parallax').each(function () {
        var speed = $(this).attr('data-speed');
        if ($(this).attr('data-revert')) speed *= -1;
        TweenMax.to($(this), 1, {
            x: (1 - newx * speed / 200),
            y: (1 - newy * speed / 200)
        });
    });
});

function initPage() {
    rect = $("#parallax-wrapper").rectangle({});
    rect.fadeElementsIn();

    $("#menu-main-title").click(function () {
        rect.changeMenu("menu-nav");
    });
}

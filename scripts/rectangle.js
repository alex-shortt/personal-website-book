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
            $("#rect-menu-container").css("opacity", 1);
        }, 2000);
    }

    this.changeMenu = function (menu) {
        //add active class to select whole page at once (for fading in/out)
        $(".rect-menu").each(function () {
            $(this).css("transition", "opacity 0.7s ease-in-out");
        });

        $(".rect-menu").each(function () {
            $(this).css("opacity", 0);
        });

        switch (menu) {
        case 'menu-contact':
            $("#rect-border").css("box-shadow", "inset 0 0 0 7px white");
            break;
        case 'menu-about':
            $("#rect-border").css("box-shadow", "inset 0 0 0 7px white");
            break;
        default:
            $("#rect-border").css("box-shadow", "inset 0 0 0 7px black");
            break;
        }

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

function initHash() {
    $(window).hashchange(function () {
        var hash = location.hash;
        var cleanHash = (hash.replace(/^#/, '') || 'blank');

        switch (cleanHash) {
        case 'blank':
            rect.changeMenu("menu-main");
            break;
        case 'nav':
            rect.changeMenu("menu-nav");
            break;
        case 'contact':
            rect.changeMenu("menu-contact");
            break;
        case 'about':
            rect.changeMenu("menu-about");
            break;
        default:
            rect.changeMenu("menu-main");
            break;
        }
    });

    $(window).hashchange();
}

function initParallax() {
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
}

function initPage() {
    rect = $("#parallax-wrapper").rectangle({});
    rect.fadeElementsIn();

    //main menu
    $("#menu-main-title").click(function () {
        window.location.hash = "nav";
    });

    //nav menu
    $("#menu-nav-about").click(function () {
        window.location.hash = "about";
    });
    $("#menu-nav-contact").click(function () {
        window.location.hash = "contact";
    });
    $("#menu-nav-back").click(function () {
        window.location.hash = "";
    });

    //contact menu
    $("#contact-facebook").click(function () {
        window.open("https://www.facebook.com/alex.shortt.98");
    });
    $("#contact-soundcloud").click(function () {
        window.open("https://soundcloud.com/alex_shortt");
    });
    $("#contact-twitter").click(function () {
        window.open("https://twitter.com/_alexshortt");
    });
    $("#contact-instagram").click(function () {
        window.open("https://www.instagram.com/alexander.shortt/");
    });
    $("#contact-linkedin").click(function () {
        window.open("https://www.linkedin.com/in/alexshortt/");
    });
    $("#contact-back").click(function () {
        window.location.hash = "nav";
    });
}

jQuery.fn.wibbly() = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.wibbly.defs, opts);
    this.initialize = function () {
        return this;
    }
    jQuery.fn.wibbly.defs = {};

    var instance = this;
    var element = jQuery(this);
    
    var canvas = document.querySelector('#wibbly-canvas');
    var context = canvas.getContext('2d');
    var ratio = window.devicePixelRatio || 1;

    var totalLineHeight = 140;
    var totalLines = 2;
    var totalDiff = totalLineHeight / totalLines;
    var fontHeight = 30 * ratio - 50; // Small centering

    var smallestWidth = 280; // width of smallest line;
    var offsetX = 5;
    var offsetY = 2;
    var iterations;
    var verticalAlign, line1Diff, line2Diff, iterations, iteration, animationFrame;

    var startRGB = [255, 255, 255];
    var endRGB = [255, 255, 255];
    var fullColorSet = [];

    this.initWibbly = function () {
        cancelAnimationFrame(animationFrame);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        context.font = '60px Montserrat';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.strokeStyle = "#000000";
        context.lineWidth = "3";
        context.textBaseline = "middle";
        verticalAlign = (window.innerHeight / 2 * ratio) - totalLineHeight / 2;
        line1Diff = totalLineHeight + fontHeight - totalDiff;
        line2Diff = totalLineHeight + fontHeight - totalDiff * 2;
        iterations = Math.floor(((window.innerWidth * ratio / 2) - (smallestWidth * ratio / 2)) / offsetX + 5);
        iterations = Math.round(iterations / 10);
        alert(iterations);
        prepareColorSets(iterations);
        iteration = 0;
        animationFrame = requestAnimationFrame(draw);
        window.onresize = initWibbly;
        $(window).mousemove(function (event) {
            offsetX = 20 * ((event.pageX / screen.width) - 0.5);
            offsetY = 20 * ((event.pageY / screen.height) - 0.5);
        });
    }

    this.draw = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = iterations - 1; i > 0; i--) {
            context.fillStyle = 'rgb(' + fullColorSet[i][0] + ',' + fullColorSet[i][1] + ',' + fullColorSet[i][2] + ')';
            var x = window.innerWidth / 2 * ratio - i * offsetX;
            var y = verticalAlign + i * offsetY + (Math.sin(i + iteration) * 2);
            drawText(x, y);
        }

        iteration += 0.09;
        animationFrame = requestAnimationFrame(draw);
    }

    this.draw = function (x, y) {
        context.fillText("Alex", x, y + line2Diff);
        context.strokeText("Alex", x, y + line2Diff);

        context.fillText("Shortt", x, y + line1Diff);
        context.strokeText("Shortt", x, y + line1Diff);
    }

    this.prepareColorSets = function (iterations) {
        fullColorSet = [];
        for (var i = 0; i < iterations; i++) {
            fullColorSet.push(colourGradientor(1 - i / iterations, startRGB, endRGB));
        }
    }

    this.colourGradientor = function (p, rgb_beginning, rgb_end) {
        var w = p * 2 - 1;
        var w1 = (w + 1) / 2.0;
        var w2 = 1 - w1;
        var rgb = [parseInt(rgb_beginning[0] * w1 + rgb_end[0] * w2),
             parseInt(rgb_beginning[1] * w1 + rgb_end[1] * w2),
             parseInt(rgb_beginning[2] * w1 + rgb_end[2] * w2)];
        return rgb;
    }
    
    return this.initialize();
}
var _rect;
var _light;

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
            $("#rect-menu-container").css("opacity", 1);
        }, 500);

        setTimeout(function () {
            $("#hand-despair").css("opacity", 1);
        }, 1200);

        setTimeout(function () {
            $("#hand-help").css("opacity", 1);
        }, 1400);
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
                $("#rect-menu-container").css("border", "7px solid white");
                break;
            case 'menu-about':
                $("#rect-menu-container").css("border", "7px solid white");
                break;
            default:
                $("#rect-menu-container").css("border", "7px solid black");
                break;
        }

        setTimeout(function (menu) {
            $(".rect-menu").each(function () {
                $(this).css("display", "none");
            });

            $("#" + menu).css("display", "flex");
            if (menu == "menu-projects") {
                $("#" + menu).css("display", "initial");
            }

            setTimeout(function (menu) {
                $("#" + menu).css("opacity", 1);
            }, 50, menu);
        }, 700, menu);
    }

    this.openModal = function (project) {
        $("#rect-menu-container").css("width", "0%");

        setTimeout(function () {
            $("#rect-menu-container").css("height", "0%");

            setTimeout(function () {
                $("#splash-svg").show();
                $(".splash-svg").addClass("splash-svg-open");
                $("#" + project).css("display", "initial");
                setTimeout(function () {
                    $("#" + project).css({
                        opacity: 1,
                        transform: "translateY(0)"
                    });
                    
                    var x = setInterval(function () {
                        _light.responsive();
                    }, 10);
                    setTimeout(function(){
                        clearInterval(x);
                    }, 1500);
                    
                }, 500);
            }, 750);
        }, 750);
    }

    this.closeModal = function (project) {
        $("#" + project).css({
            opacity: 0,
            transform: "translateY(-7.5vh)"
        });
        setTimeout(function () {
            $("#splash-svg").removeClass("splash-svg-open");
            $("#" + project).css("display", "none");
            setTimeout(function () {
                $("#splash-svg").hide();
                $("#rect-menu-container").css("height", "100%");
                setTimeout(function () {
                    $("#rect-menu-container").css("width", "100%");
                }, 750);
            }, 790);
        }, 500);
    }

    return this.initialize();
}

jQuery.fn.flashlight = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.flashlight.defs, opts);
    jQuery.fn.rectangle.defs = {};

    var instance = this;
    var element = jQuery(this);
    var draw;
    var path;

    var angle = 0; //mother angle (both shaft and handle)
    var posX = 0; //position of light shaft origin X
    var posY = 0; //position of light shaft origin Y
    var scale = 1; //scale if i can get responsiveness fucking working....
    var scaleWidth = 388.609; //match to imgElement width to get scale

    var imgPosX = 0.2683; //percentage distance in the X that the svg origin is in imgElement
    var imgPosY = 0.255; //percentage distance in the Y that the svg origin is in imgElement
    var imgElement = $("#modal-girl-image");

    var handle = $("#modal-handle");
    var handlePosX = 0.2616; //percentage distance in the X that the handle is in imgElement
    var handlePosY = 0.2024; //percentage distance in the Y that the handle is in imgElement

    var transPosX = 0.295; //percentage distance in the X that the transform origin is in imgElement
    var transPosY = 0.4519; //percentage distance in the Y that the transform origin is in imgElement

    this.initialize = function () {
        draw = SVG('light');
        path = draw.path("M431.901,263.82c57.33,0,103.804,46.475,103.804,103.805 c0,17.398-4.279,33.796-11.844,48.199l0.002-0.009l-68.74,279.721l-23.222-0.001l0,0c0,0,0,0,0,0l-23.223,0.001l-68.74-279.721 l0.002,0.009c-7.564-14.403-11.844-30.801-11.844-48.199C328.097,310.295,374.572,263.82,431.901,263.82z");
        //path = draw.path("M0,0v5272.492h5938.288V0H0z M1483.912,3865.3l-271.854,247.191L1170,4092.845l71.672-330.013 c6.326-70.161,65.177-123.925,136.985-123.925c76.027,0,137.66,61.633,137.66,137.661 C1516.318,3810.604,1504.378,3841.273,1483.912,3865.3z");
        var clip = draw.clip().add(path);
        path.move(0, 0);

        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');

        window.addEventListener('resize', function () {
            _light.responsive();
        });

        return this;
    }

    this.responsive = function () {
        var moveX = $(imgElement).offset().left + ($(imgElement).width() * imgPosX);
        var moveY = $(imgElement).offset().top + ($(imgElement).height() * imgPosY);
        //this.setScale($(imgElement).width() / scaleWidth);
        this.moveOrigin(moveX, moveY);
        this.updateHandle();
    }

    this.setScale = function (newScale) {
        return;
        path.scale(1);
        scale = newScale;
        path.scale(scale, posX + path.width() / 2, posY + path.height());
    }

    this.resetState = function () {
        this.setAngle(0);
        path.move(0, 0);
    }

    this.setAngle = function (newAngle, animate) {
        console.log("__________");
        angle = newAngle;
        console.log("angle: " + angle);

        var transX = $(imgElement).offset().left + (transPosX * $(imgElement).width());
        var transY = $(imgElement).offset().top + (transPosY * $(imgElement).height());
        
        console.log("transX: " + transX);
        console.log("transY: " + transY);
        
        //literally no idea why but this works
        if (animate) {
            path.animate().rotate(angle, transX, transY);
        } else {
            path.rotate(angle);
        }

        this.updateHandle();
    }

    this.moveOrigin = function (x, y) {
        var tempAngle = angle;
        this.resetState();
        
        posX = x - (path.width() / 2);
        posY = y - path.height();
        path.move(posX, posY);
        this.setAngle(tempAngle);
    }
    
    this.updateHandle = function () {
        $(handle).css("left", ($(imgElement).offset().left + ($(imgElement).width() * handlePosX)) + "px");
        $(handle).css("top", ($(imgElement).offset().top + ($(imgElement).height() * handlePosY)) + "px");
        $(handle).css("transform", "rotate(" + (angle - 25.5) + "deg)");
    }

    this.getPath = function () {
        return path;
    }

    return this.initialize();
}

function initHash() {
    $(window).hashchange(function () {
        var hash = location.hash;
        var cleanHash = (hash.replace(/^#/, '') || 'blank');

        switch (cleanHash.split("-")[0]) {
            case 'blank':
                _rect.changeMenu("menu-main");
                break;
            case 'nav':
                _rect.changeMenu("menu-nav");
                break;
            case 'contact':
                _rect.changeMenu("menu-contact");
                break;
            case 'about':
                _rect.changeMenu("menu-about");
                break;
            case 'projects':
                _rect.changeMenu("menu-projects");
                break;
            default:
                _rect.changeMenu("menu-main");
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
    _rect = $("#parallax-wrapper").rectangle({});
    _rect.fadeElementsIn();

    //universal modal
    $(".modal-close").click(function () {
        _rect.closeModal($(this).data("modal"));
    });

    _light = $(".modal-content").flashlight({});
    _light.setAngle(0);


    //project-1 modal

    //main menu
    $("#menu-main-title").click(function () {
        window.location.hash = "nav";
    });

    //nav menu
    $("#menu-nav-projects").click(function () {
        window.location.hash = "projects";
    });
    $("#menu-nav-about").click(function () {
        window.location.hash = "about";
    });
    $("#menu-nav-contact").click(function () {
        window.location.hash = "contact";
    });
    $("#menu-nav-back").click(function () {
        window.location.hash = "";
    });

    //projects menu
    $('#menu-projects').perfectScrollbar({
        wheelSpeed: 0.5
    });
    $("#projects-project-1").click(function () {
        _rect.openModal("project-1");
    });

    //about menu
    $("#about-page-up").click(function () {

    });
    $("#about-page-down").click(function () {

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

jQuery.fn.wibbly = function (opts) {
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

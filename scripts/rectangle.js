var _rect;
var _light;
var _carousel;
var _message;
var _modalUnits = [];

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
            case 'menu-social':
                $("#rect-menu-container").css("border", "7px solid white");
                this.enablePrevious(false);
                _message.hideSpeech();

                break;
            case 'menu-about':
                $("#rect-menu-container").css("border", "7px solid white");
                this.enablePrevious(true, "nav");
                _message.hideSpeech();

                break;
            case 'menu-projects':
                $("#rect-menu-container").css("border", "7px solid black");
                this.enablePrevious(true, "nav");
                _message.hideSpeech();
                break;
            case 'menu-message':
                $("#rect-menu-container").css("border", "7px solid black");
                this.enablePrevious(true, "nav");
                _message.showSpeech(750);
                break;
            default:
                $("#rect-menu-container").css("border", "7px solid black");
                this.enablePrevious(false);
                _message.hideSpeech();

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

    this.enablePrevious = function (enable, link) {
        $("#rect-previous").unbind();
        if (enable) {
            setTimeout(function () {
                $("#rect-previous").css("pointer-events", "all");
                $("#rect-previous").css("opacity", 1);
                $("#rect-previous").click(function () {
                    window.location.hash = link;
                });
            }, 700);
        } else {
            $("#rect-previous").css("opacity", 0);
            $("#rect-previous").css("pointer-events", "none");
        }
    }

    this.openModal = function (project) {
        $("#rect-menu-container").css("width", "0%");
        $("#rect-menu-container").css("overflow", "hidden");

        setTimeout(function () {
            $("#rect-menu-container").css("height", "0%");

            setTimeout(function () {
                $("#splash-svg").show();
                $(".splash-svg").addClass("splash-svg-open");
                $("#modal").css("display", "initial");
                setTimeout(function () {
                    $("#modal").css({
                        opacity: 1,
                        transform: "translateY(0)"
                    });
                    setTimeout(function () {
                        _light.responsive();
                        updateModalUnits();
                    }, (750 / 4));

                    setTimeout(function () {
                        _light.responsive();
                        updateModalUnits();
                    }, (750 / 2));

                    setTimeout(function () {
                        _light.responsive();
                        updateModalUnits();
                    }, (750 * 3 / 4));

                    setTimeout(function () {
                        updateModalUnits();
                        _light.responsive();
                        //_light.setAngle(17, true);

                    }, 750);
                }, 500);
            }, 750);
        }, 750);
    }

    this.closeModal = function () {
        $("#modal").css({
            opacity: 0,
            transform: "translateY(-7.5vh)"
        });
        setTimeout(function () {
            $("#splash-svg").removeClass("splash-svg-open");
            $("#modal").css("display", "none");
            setTimeout(function () {
                $("#splash-svg").hide();
                $("#rect-menu-container").css("height", "100%");
                setTimeout(function () {
                    $("#rect-menu-container").css("width", "100%");
                    setTimeout(function () {
                        $("#rect-menu-container").css("overflow", "initial");
                    }, 750);
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
    var rect;
    var clip;
    var isMoving = false;
    var flashlightOpen = false;

    var svg_biggest = "M1369.275,15.326c150.669,0,272.807,122.141,272.807,272.807 c0,45.723-11.245,88.819-31.126,126.67l0.005-0.023l-218.463,735.127l-23.223-0.002l0,0h0.003l-23.224,0.001l-218.46-735.126 l0.006,0.023c-19.88-37.852-31.129-80.947-31.129-126.67C1096.471,137.467,1218.612,15.326,1369.275,15.326z";
    var svg_big = "M782.529,3.328c109.238,0,197.791,88.555,197.791,197.791 c0,33.15-8.153,64.396-22.567,91.839l0.004-0.017L805.751,825.925l-23.223-0.002l0,0h0.002l-23.223,0.001L607.305,292.941 l0.004,0.017c-14.413-27.443-22.569-58.688-22.569-91.839C584.74,91.882,673.294,3.328,782.529,3.328z";
    var svg_small = "M431.901,263.82c57.33,0,103.804,46.475,103.804,103.805 c0,17.398-4.279,33.796-11.844,48.199l0.002-0.009l-68.74,279.721l-23.222-0.001l0,0c0,0,0,0,0,0l-23.223,0.001l-68.74-279.721 l0.002,0.009c-7.564-14.403-11.844-30.801-11.844-48.199C328.097,310.295,374.572,263.82,431.901,263.82z";
    var svg_handDrawn = "M0,0v5272.492h5938.288V0H0z M1483.912,3865.3l-271.854,247.191L1170,4092.845l71.672-330.013 c6.326-70.161,65.177-123.925,136.985-123.925c76.027,0,137.66,61.633,137.66,137.661 C1516.318,3810.604,1504.378,3841.273,1483.912,3865.3z";

    var angle = 0; //mother angle (both shaft and handle)
    var posX = 0; //position of light shaft origin X
    var posY = 0; //position of light shaft origin Y
    var scale = 1; //scale if i can get responsiveness fucking working....
    var scaleWidth = 388.609; //match to imgElement width to get scale

    var imgPosX = 0.2683; //percentage distance in the X that the svg origin is in imgElement
    var imgPosY = 0.255; //percentage distance in the Y that the svg origin is in imgElement
    var imgElement = $("#modal-girl-image");

    var slider = $("#modal-slider");
    var arrow = $("#modal-arrow");
    var projects = $("#modal-project");

    var handle = $("#modal-handle");
    var handlePosX = 0.2616; //percentage distance in the X that the handle is in imgElement
    var handlePosY = 0.2024; //percentage distance in the Y that the handle is in imgElement

    var transPosX = 0.295; //percentage distance in the X that the transform origin is in imgElement
    var transPosY = 0.4519; //percentage distance in the Y that the transform origin is in imgElement

    this.initialize = function () {
        //flashlight
        draw = SVG('light');
        path = draw.path(svg_biggest);
        clip = draw.clip().add(path);
        path.move(0, 0);
        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('-webkit-clip-path', 'url(#' + clipID + ')');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');

        //slider
        $(slider).roundSlider({
            circleShape: "quarter-top-right",
            mouseScrollAction: true,
            radius: 50,
            width: 1,
            handleSize: "+60",
            showTooltip: false,
            change: "traceEvent",
            drag: "traceEvent",
            tooltipFormat: "traceEvent"
        });
        $("#modal-slider").css("bottom", $(window).height() - this.getTransPoint().y);
        $("#modal-slider").css("left", this.getTransPoint().x);

        //misc
        window.addEventListener('resize', function () {
            _light.responsive();
            _light.updateSliderPos();
        });

        $(document).click(function (e) {
            return;
            //console.log(e.pageX, e.pageY);
            var trans = _light.getTransPoint();

            var width = e.pageX - trans.x;
            var height = trans.y - e.pageY;
            var angle = 90 - (Math.atan(height / width) * 180 / Math.PI);
            _light.setAngle(angle, true);
        });

        window.onmousemove = function (e) {
            return;
            var trans = _light.getTransPoint();

            var width = e.pageX - trans.x;
            var height = trans.y - e.pageY;
            var angle = 90 - (Math.atan(height / width) * 180 / Math.PI);
            _light.setAngle(angle);
        };

        return this;
    }

    this.updateSliderPos = function () {
        $(slider).css("bottom", $(window).height() - this.getTransPoint().y);
        $(slider).css("left", this.getTransPoint().x);
    }

    this.responsive = function () {
        if (isMoving || flashlightOpen) return;
        isMoving = true;
        this.updateSliderPos();
        var moveX = $(imgElement).offset().left + ($(imgElement).width() * imgPosX);
        var moveY = $(imgElement).offset().top + ($(imgElement).height() * imgPosY);
        //this.setScale($(imgElement).width() / scaleWidth);
        this.moveOrigin(moveX, moveY);
        this.updateHandle();
        isMoving = false;
    }

    this.setScale = function (newScale) {
        return;
        path.scale(1);
        scale = newScale;
        path.scale(scale, posX + path.width() / 2, posY + path.height());
    }

    this.resetState = function () {
        if (path != null) path.remove();
        if (clip != null) clip.remove();

        path = draw.path(svg_biggest);
        clip = draw.clip().add(path);
        path.move(0, 0);

        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('-webkit-clip-path', 'url(#' + clipID + ')');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');
        this.setAngle(0, false);
        path.move(0, 0);
    }

    this.setAngle = function (newAngle, animate, time) {
        angle = newAngle;

        var transX = $(imgElement).offset().left + (transPosX * $(imgElement).width());
        var transY = $(imgElement).offset().top + (transPosY * $(imgElement).height());

        //literally no idea why but this works
        path.stop();

        $(handle).css("transition", "opacity 0.5s linear");
        if (animate) {
            if (time != null) {
                path.animate(time, '<>').rotate(angle, transX, transY);
                $(handle).css("transition", "transform linear " + time + "ms, opacity 0.5s linear");
            } else {
                path.animate().rotate(angle, transX, transY);
                $(handle).css("transition", "transform linear 1s, opacity 0.5s linear");
            }
        } else {
            path.rotate(angle, transX, transY);
        }

        this.updateHandle();
    }

    this.getTransPoint = function () {
        var transX = $(imgElement).offset().left + (transPosX * $(imgElement).width());
        var transY = $(imgElement).offset().top + (transPosY * $(imgElement).height());

        var send = {
            x: transX,
            y: transY
        }

        return send;
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

    this.isFlashlightOpen = function () {
        return flashlightOpen;
    }

    this.setProjectsVisible = function (visible) {
        var opacity = (visible ? 1 : 0);
        var pointer = (visible ? "all" : "none");

        var oppOpacity = (visible ? 0 : 1);
        var oppPointer = (visible ? "none" : "all");

        $(projects).css("pointer-events", oppPointer);
        $(arrow).css("pointer-events", pointer);
        $(handle).css("pointer-events", pointer);
        $(slider).css("pointer-events", pointer);
        $(".modal-unit").each(function (obj, elem) {
            $(elem).css("pointer-events", pointer);
        });

        $(projects).css("opacity", oppOpacity);
        $(arrow).css("opacity", opacity);
        $(handle).css("opacity", opacity);
        $(".modal-unit").each(function (obj, elem) {
            $(elem).css("opacity", opacity);
        });
    }

    this.openFlashlight = function () {
        path.animate(1000).scale(10, 10);
        this.setProjectsVisible(false);
        flashlightOpen = true;
        setTimeout(function () {
            $('.modal-content').css('-webkit-clip-path', 'none');
            $('.modal-content').css('clip-path', 'none');
        }, 1000);
    }

    this.closeFlashlight = function () {
        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('-webkit-clip-path', 'url(#' + clipID + ')');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');
        this.setProjectsVisible(true);
        path.scale(10, 10);
        path.animate(1000).scale(1, 1);
        flashlightOpen = false;
    }

    return this.initialize();
}

jQuery.fn.modalUnits = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.modalUnits.defs, opts);
    jQuery.fn.modalUnits.defs = {
        angle: 45,
        distPerc: 0.85,
        image: "assets/jupiter.png",
        link: "projects-default",
        id: 'modal-unit-default',
        text: "default"
    };

    var angle = opts.angle;
    var distPerc = opts.distPerc;
    var image = opts.image;
    var link = opts.link;
    var text = opts.text;
    var id = opts.id;

    var instance = this;
    var element = jQuery(this);

    this.getScaledXY = function (angle, perc) {
        var transPoint = _light.getTransPoint();
        var ratioX = Math.cos((90 - angle) * Math.PI / 180);
        var ratioY = Math.sin((90 - angle) * Math.PI / 180);
        var widthX = $(window).width() - transPoint.x; // / Math.min($(window).height(), $(window).width());
        var heightY = transPoint.y; // / Math.min($(window).height(), $(window).width());
        var iterationX = widthX / ratioX;
        var iterationY = heightY / ratioY;
        var triWidth;
        var triHeight;
        if (iterationX < iterationY) {
            triWidth = widthX;
            triHeight = iterationX * ratioY;
        } else {
            triWidth = iterationY * ratioX;
            triHeight = heightY;
        }
        var dist = Math.hypot(triWidth, triHeight) * perc;

        dist = Math.min(dist * perc, _light.getPath().height() * 0.8);

        var x = transPoint.x + (ratioX * dist);
        var y = transPoint.y - (ratioY * dist);
        return {
            x: x,
            y: y
        };
    }

    this.updatePos = function () {
        var newCoords = this.getScaledXY(angle, distPerc);
        $("#" + id).css("top", newCoords.y + "px");
        $("#" + id).css("left", newCoords.x + "px");
    }

    this.initialize = function () {
        id = "modal-unit-" + text.replace(/ /g, "-");

        var elem = $("<div class='modal-unit'></div>");
        elem.css("background-image", "url(" + image + ")");
        elem.attr('id', id);
        elem.click(function () {
            window.location.hash = link;
        });
        elem.append("<h2 class='modal-unit-text'>" + text + "</h2>");
        $(element).append(elem);
        return this;
    }

    return this.initialize();
}

jQuery.fn.carousel = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.carousel.defs, opts);
    this.initialize = function () {
        return this;
    }
    jQuery.fn.carousel.defs = {};

    var instance = this;
    var element = jQuery(this);
    var totalPages = $("#about-carousel").children().length;
    var currentPage = 1;

    this.changePage = function (step) {
        $("#about-page-down").css({
            color: "white",
            cursor: "pointer"
        });

        $("#about-page-up").css({
            color: "white",
            cursor: "pointer"
        });


        currentPage += step;

        if (currentPage > 1) {
            currentPage = 1;
        }
        if (currentPage < 1 - totalPages + 1) {
            currentPage = 1 - totalPages + 1;
        }

        if (currentPage == 1) {
            $("#about-page-up").css({
                color: "gray",
                cursor: "pointer"
            });
        }

        if (currentPage == 1 - totalPages + 1) {
            $("#about-page-down").css({
                color: "gray",
                cursor: "pointer"
            });
        }

        $("#about-carousel").css("transform", "translateY(calc(100% / 3 * " + currentPage + "))");
    }

    return this.initialize();
}

jQuery.fn.message = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.message.defs, opts);

    jQuery.fn.message.defs = {};

    var name = $("#message-name");
    var message = $("#message-message");
    var speech = $("#menu-message-speech");

    var contact = $(".menu-message-contact");
    var confirm = $(".menu-message-confirm");

    var rect = $("#rect-menu-container");
    var send = $("#menu-message-contact-send");
    var redo = $("#menu-message-confirm-redo");

    var speechClosed = "M 0 0 L 75 0   L 75 0";
    var speechOpen = "M 0 0 L 75 100 L 75 0";

    var draw;
    var path;
    var visible = false;

    this.initialize = function () {
        draw = SVG($(speech).attr('id'));
        window.addEventListener('resize', function () {
            _message.positionSVG();
        });
        return this;
    }

    this.checkCompletion = function () {
        var nameText = $(name).val();
        var messageText = $(message).val();

        var good = true;

        if (nameText == "") {
            $(name).css("animation", "shake 0.5s both");
            setTimeout(function () {
                $(name).css("animation", "none");
            }, 500);
            good = false;
        }

        if (messageText == "") {
            $(message).css("animation", "shake 0.5s both");
            setTimeout(function () {
                $(message).css("animation", "none");
            }, 500);
            good = false;
        }

        return good;
    }

    this.sendMessage = function () {
        var nameText = $(name).val();
        var messageText = $(message).val();

        if (!this.checkCompletion()) {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "./scripts/email.php?name=" + encodeURIComponent(nameText) + "&message=" + encodeURIComponent(messageText), true);
        xhr.send();

        $(redo).css("animation", "none");
        $(send).css("animation", "sendButton 1s ease-in-out forwards");

        setTimeout(function () {
            $(contact).css("opacity", 0);
            setTimeout(function () {
                $(contact).css("display", "none");
                $(confirm).css("display", "initial");
                $(confirm).css("opacity", 1);
                $(name).val("");
                $(message).val("");
            }, 1000);
        }, 1200);
    }

    this.redoMessage = function () {
        $(send).css("animation", "none");
        $(redo).css("animation", "sendButton 1s ease-in-out forwards");

        setTimeout(function () {
            $(confirm).css("opacity", 0);
            setTimeout(function () {
                $(confirm).css("display", "none");
                $(contact).css("display", "flex");
                $(contact).css("opacity", 1);
            }, 1000);
        }, 1200);
    }

    this.showSpeech = function (delay) {
        if (visible) return;

        if (delay == null) {
            path = draw.path(speechClosed);
            path.move(0, 0);
            this.positionSVG();
            path.animate(750, '<>').plot(speechOpen);
            visible = true;
        } else {
            setTimeout(function () {
                path = draw.path(speechClosed);
                path.move(0, 0);
                _message.positionSVG();
                path.animate(750, '<>').plot(speechOpen);
                visible = true;
            }, delay);
        }
    }

    this.positionSVG = function () {
        if (path == null) return;
        var x = $(rect).offset().left + $(rect).width() + 14 - path.width() - 50;
        var y = $(rect).offset().top + $(rect).height() + 7;
        $(speech).css("left", x);
        $(speech).css("top", y);
    }

    this.hideSpeech = function () {
        if (!visible) return;
        path.animate(750, '<>').plot(speechClosed);
        setTimeout(function () {
            path.remove();
            $(speech).css("left", 0);
            $(speech).css("top", 0);

            visible = false;
        }, 750);
    }

    return this.initialize();
}


function updateModalUnits() {
    _modalUnits.forEach(function (obj) {
        obj.updatePos();
    });
}

function traceEvent(e) {
    if (_light != null) _light.setAngle(e.value);
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
            case 'social':
                _rect.changeMenu("menu-social");
                break;
            case 'message':
                _rect.changeMenu("menu-message");
                break;
            case 'about':
                _rect.changeMenu("menu-about");
                break;
            case 'projects':
                _rect.openModal();
                if (cleanHash.split("-")[1] != null) {
                    _light.openFlashlight();
                    switch (cleanHash.split("-")[1]) {

                    }
                } else {
                    if (_light.isFlashlightOpen()) {
                        _light.closeFlashlight();
                    }
                }
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

        //$('span').text(newx + ", " + newy);

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

function initModal() {
    $(".modal-close").click(function () {
        _rect.closeModal($(this).data("modal"));
        setTimeout(function () {
            window.location.hash = "nav";
        }, 750)
    });

    _light = $(".modal-content").flashlight({});
    _light.setAngle(0);

    $("#modal-link").click(function () {
        _light.setAngle(17, true);
    });
    $("#modal-about").click(function () {
        _light.setAngle(55, true);
    });
    $("#modal-gallery").click(function () {
        _light.setAngle(85, true);
    });

    _modalUnits.push($(".modal-content").modalUnits({
        angle: 45,
        distPerc: 1,
        image: "assets/saturn.png",
        link: "projects-awge",
        text: "AWGE"
    }));
    _modalUnits.push($(".modal-content").modalUnits({
        angle: 10,
        distPerc: 0.8,
        image: "assets/jupiter.png",
        link: "projects-revenge",
        text: "Revenge X Storm"
    }));
    _modalUnits.push($(".modal-content").modalUnits({
        angle: 38,
        distPerc: 0.7,
        image: "assets/moon.png",
        link: "projects-sounddown",
        text: "Sound Down"
    }));
    _modalUnits.push($(".modal-content").modalUnits({
        angle: 80,
        distPerc: 1,
        image: "assets/jupiter.png",
        link: "projects-nessly",
        text: "Nessly"
    }));
    _modalUnits.push($(".modal-content").modalUnits({
        angle: 69,
        distPerc: 0.54,
        image: "assets/saturn.png",
        link: "projects-portal",
        text: "GTAV Portal Gun Mod"
    }));

    window.addEventListener('resize', function () {
        _modalUnits.forEach(function (obj) {
            obj.updatePos();
        });
    });
}

function initSocial() {
    $("#social-github").click(function () {
        window.open("https://github.com/alex-shortt");
    });
    $("#social-soundcloud").click(function () {
        window.open("https://soundcloud.com/alex_shortt");
    });
    $("#social-twitter").click(function () {
        window.open("https://twitter.com/_alexshortt");
    });
    $("#social-instagram").click(function () {
        window.open("https://www.instagram.com/alexander.shortt/");
    });
    $("#social-linkedin").click(function () {
        window.open("https://www.linkedin.com/in/alexshortt/");
    });
    $("#social-back").click(function () {
        window.location.hash = "nav";
    });
}

function initAbout() {
    _carousel = $("#about-carousel").carousel({});

    $("#about-page-up").click(function () {
        _carousel.changePage(1);
    });
    $("#about-page-down").click(function () {
        _carousel.changePage(-1);
    });
}

function initNavMain() {
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
    $("#menu-nav-social").click(function () {
        window.location.hash = "social";
    });
    $("#menu-nav-message").click(function () {
        window.location.hash = "message";
    });
    $("#menu-nav-back").click(function () {
        window.location.hash = "";
    });
}

function initMessage() {
    _message = $("#menu-message").message({})

    $("#menu-message-contact-send").click(function () {
        _message.sendMessage();
    });
    $("#menu-message-confirm-redo").click(function () {
        _message.redoMessage();
    });
}

function initPage() {
    _rect = $("#parallax-wrapper").rectangle({});
    _rect.fadeElementsIn();

    initModal();
    initNavMain();
    initAbout();
    initSocial();
    initMessage();
}

var _rect;
var _light;
var _gallery;
var _modalUnits;

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
            this.enablePrevious(false);
            break;
        case 'menu-about':
            $("#rect-menu-container").css("border", "7px solid white");
            this.enablePrevious(true, "nav");
            break;
        case 'menu-projects':
            $("#rect-menu-container").css("border", "7px solid black");
            this.enablePrevious(true, "nav");
            break;
        default:
            $("#rect-menu-container").css("border", "7px solid black");
            this.enablePrevious(false);
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
                    _modalUnits.updateModal(project);

                    setTimeout(function () {
                        _light.responsive();
                        _modalUnits.updateGallery();
                        _modalUnits.updatePortal();
                        _modalUnits.updateAbout();
                    }, (750 / 4));

                    setTimeout(function () {
                        _light.responsive();
                        _modalUnits.updateGallery();
                        _modalUnits.updatePortal();
                        _modalUnits.updateAbout();
                    }, (750 / 2));

                    setTimeout(function () {
                        _light.responsive();
                        _modalUnits.updateGallery();
                        _modalUnits.updatePortal();
                        _modalUnits.updateAbout();
                    }, (750 * 3 / 4));

                    setTimeout(function () {
                        _light.responsive();
                        _modalUnits.updateGallery();
                        _modalUnits.updatePortal();
                        _modalUnits.updateAbout();
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
    var clip;
    var isMoving = false;

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

    var handle = $("#modal-handle");
    var handlePosX = 0.2616; //percentage distance in the X that the handle is in imgElement
    var handlePosY = 0.2024; //percentage distance in the Y that the handle is in imgElement

    var transPosX = 0.295; //percentage distance in the X that the transform origin is in imgElement
    var transPosY = 0.4519; //percentage distance in the Y that the transform origin is in imgElement

    this.initialize = function () {
        draw = SVG('light');
        //biggest symmetrical
        path = draw.path(svg_biggest);

        clip = draw.clip().add(path);
        path.move(0, 0);

        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');

        window.addEventListener('resize', function () {
            _light.responsive();

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

    this.responsive = function () {
        if (isMoving) return;
        isMoving = true;
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
        path.remove();
        clip.remove();

        path = draw.path(svg_biggest);
        clip = draw.clip().add(path);
        path.move(0, 0);

        var clipID = $(".light clipPath").attr('id');
        $('.modal-content').css('clip-path', 'url(#' + clipID + ')');
        this.setAngle(0, false);
        path.move(0, 0);
    }

    this.setAngle = function (newAngle, animate) {
        angle = newAngle;

        var transX = $(imgElement).offset().left + (transPosX * $(imgElement).width());
        var transY = $(imgElement).offset().top + (transPosY * $(imgElement).height());

        //literally no idea why but this works
        path.stop();
        if (animate) {
            path.animate().rotate(angle, transX, transY);
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

    return this.initialize();
}

jQuery.fn.gallery = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.gallery.defs, opts);
    jQuery.fn.gallery.defs = {};

    var instance = this;
    var element = jQuery(this);
    var category = "";
    var gallery = ["assets/css3-drawn.png",
                  "assets/girl.png",
                  "assets/jungle.jpg",
                  "assets/moon.png",
                  "assets/jupiter.png",
                  "assets/girl-hand.png"];
    var catInd = 0;
    var index = 0;
    var images = [];

    this.initialize = function () {
        this.updateImage();
        return this;
    }

    this.updateImage = function () {
        $(element).css("background-image", "url(" + this.currentGallery()[index] + ")");
    }

    this.transitionImage = function () {
        $(element).css("opacity", 0);
        setTimeout(function (obj) {
            obj.updateImage();
        }, 250, this);
        setTimeout(function () {
            $(element).css("opacity", 1);
        }, 500);
    }

    this.next = function () {
        index++;
        if (index > this.currentGallery().length - 1) {
            index = 0;
        }
        this.transitionImage();
    }

    this.previous = function () {
        index--;
        if (index < 0) {
            index = this.currentGallery().length - 1;
        }
        this.transitionImage();
    }

    this.setGallery = function (cat) {
        category = cat;
        index = 0;
        this.updateImage();
    }

    this.currentGallery = function () {
        switch (category) {
        case "awge":
            return [
                    "assets/awge/awge-landing.png",
                    "assets/awge/awge-home.png",
                    "assets/awge/awge-shop.png",
                    "assets/awge/awge-videos.png",
                    "assets/awge/awge-contact.png"];
            break;
        case "revenge":
            return [
                    "assets/revenge/revenge-landing.png",
                    "assets/revenge/revenge-shop.png",
                    "assets/revenge/revenge-shoe.png",
                    "assets/revenge/revenge-kylie.png"];
            break;
        case "sounddown":
            return [
                    "assets/sounddown/sounddown-listing.png",
                    "assets/sounddown/sounddown-download.png",
                    "assets/sounddown/sounddown-modal.png",
                    "assets/sounddown/sounddown-popup.png"];
            break;
        case "nessly":
            return [
                    "assets/nessly/nessly-home.png",
                    "assets/nessly/nessly-model.png",
                    "assets/nessly/nessly-store.png"];
            break;
        case "portal":
            return [
                    "assets/portal/portal-poster.png",
                    "assets/portal/portal-listing.png",
                    "assets/portal/portal-game.png",
                    "assets/portal/portal-youtube.png",
                    "assets/portal/portal-kwebbelkop.png"];
            break;
        default:
            return [
                    "assets/awge/awge-landing.png",
                    "assets/awge/awge-home.png",
                    "assets/awge/awge-shop.png",
                    "assets/awge/awge-videos.png",
                    "assets/awge/awge-contact.png"];
            break;
        }
        return gallery;
    }

    return this.initialize();
}

jQuery.fn.modalUnits = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.modalUnits.defs, opts);
    jQuery.fn.rectangle.defs = {};

    var instance = this;
    var element = jQuery(this);

    var gallery = {
        elem: "#modal-unit-gallery",
        angle: 85,
        distPerc: 0.75
    };
    var portal = {
        elem: "#modal-unit-portal",
        elem2: "#modal-unit-portal-text",
        angle: 54,
        distPerc: 0.85
    };
    var about = {
        elem: "#modal-unit-about",
        elem2: "#modal-unit-about-text",
        angle: 17,
        distPerc: 0.75
    };

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

    this.updateModal = function (project) {
        //project.aboutText, project.link, project.linkText, project.galleryName

        //update gallery images
        _gallery.setGallery(project.galleryName);

        //set new link for project
        $(portal.elem).unbind();
        if (project.link != null) {
            $(portal.elem).click(function () {
                window.open(project.link);
            });
        }

        //set link text
        $(portal.elem2).text(project.linkText);

        //set about text
        $(about.elem2).text(project.aboutText);

        //set title of modal
        $("#modal-nav-title").text(project.title);
    }

    this.updateGallery = function () {
        var newCoords = this.getScaledXY(gallery.angle, gallery.distPerc);
        $(gallery.elem).css("top", newCoords.y + "px");
        $(gallery.elem).css("left", newCoords.x + "px");
    }

    this.updatePortal = function () {
        var newCoords = this.getScaledXY(portal.angle, portal.distPerc);
        $(portal.elem).css("top", newCoords.y + "px");
        $(portal.elem).css("left", newCoords.x + "px");
    }

    this.updateAbout = function () {
        var newCoords = this.getScaledXY(about.angle, about.distPerc);
        $(about.elem).css("top", newCoords.y + "px");
        $(about.elem).css("left", newCoords.x + "px");
    }

    this.initialize = function () {
        //this.updateGallery();
        //this.updateBlackHole();

        window.addEventListener('resize', function () {
            _modalUnits.updateGallery();
            _modalUnits.updatePortal();
            _modalUnits.updateAbout();
        });
        return this;
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

function initPage() {
    _rect = $("#parallax-wrapper").rectangle({});
    _rect.fadeElementsIn();

    //universal modal
    $(".modal-close").click(function () {
        _rect.closeModal($(this).data("modal"));
    });

    _light = $(".modal-content").flashlight({});
    _light.setAngle(0);

    $("#modal-link").click(function () {
        _light.setAngle(55, true);
    });
    $("#modal-about").click(function () {
        _light.setAngle(85, true);
    });
    $("#modal-gallery").click(function () {
        _light.setAngle(15, true);
    });

    //gallery modal 
    _gallery = $("#modal-unit-gallery").gallery({});
    $("#modal-gallery-left").click(function () {
        _gallery.previous();
    });
    $("#modal-gallery-right").click(function () {
        _gallery.next();
    });

    _modalUnits = $(".modal-content").modalUnits({});

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
    $("#projects-awge").click(function () {
        _rect.openModal({
            aboutText: "This is a lie",
            title: "AWGE",
            link: "https://awgeshit.com",
            linkText: "VISIT",
            galleryName: "awge"
        });
    });
    $("#projects-revenge").click(function () {
        _rect.openModal({
            aboutText: "This is a lie",
            title: "Revenge x Storm",
            link: "https://revengexstorm.com",
            linkText: "VISIT",
            galleryName: "revenge"
        });
    });
    $("#projects-sounddown").click(function () {
        _rect.openModal({
            aboutText: "This is a lie",
            title: "SoundDown",
            link: "https://chrome.google.com/webstore/detail/sounddown/ljjaomnfoepedhkncdffdadnpmckoohb",
            linkText: "VISIT",
            galleryName: "sounddown"
        });
    });
    $("#projects-nessly").click(function () {
        _rect.openModal({
            aboutText: "This is a lie",
            title: "Nessly",
            link: null,
            linkText: "UNDER CONSTRUCTION",
            galleryName: "nessly"
        });
    });
    $("#projects-portal").click(function () {
        _rect.openModal({
            aboutText: "This is a lie",
            title: "GTAV Portal Gun Mod",
            link: "https://www.gta5-mods.com/scripts/portal-gun-net",
            linkText: "VISIT",
            galleryName: "portal"
        });
    });


    //about menu
    $("#about-page-up").click(function () {

    });
    $("#about-page-down").click(function () {

    });

    //contact menu
    $("#contact-github").click(function () {
        window.open("https://github.com/alex-shortt");
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
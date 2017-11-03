var _rect;
var _light;
var _gallery;
var _wibbly;

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

                    _light.responsive();
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
        //big symmetrical
        path = draw.path("M782.529,3.328c109.238,0,197.791,88.555,197.791,197.791 c0,33.15-8.153,64.396-22.567,91.839l0.004-0.017L805.751,825.925l-23.223-0.002l0,0h0.002l-23.223,0.001L607.305,292.941 l0.004,0.017c-14.413-27.443-22.569-58.688-22.569-91.839C584.74,91.882,673.294,3.328,782.529,3.328z");
        //small symmetrical
        //path = draw.path("M431.901,263.82c57.33,0,103.804,46.475,103.804,103.805 c0,17.398-4.279,33.796-11.844,48.199l0.002-0.009l-68.74,279.721l-23.222-0.001l0,0c0,0,0,0,0,0l-23.223,0.001l-68.74-279.721 l0.002,0.009c-7.564-14.403-11.844-30.801-11.844-48.199C328.097,310.295,374.572,263.82,431.901,263.82z");
        //hand drawn
        //path = draw.path("M0,0v5272.492h5938.288V0H0z M1483.912,3865.3l-271.854,247.191L1170,4092.845l71.672-330.013 c6.326-70.161,65.177-123.925,136.985-123.925c76.027,0,137.66,61.633,137.66,137.661 C1516.318,3810.604,1504.378,3841.273,1483.912,3865.3z");
        var clip = draw.clip().add(path);
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
            var trans = _light.getTransPoint();

            var width = e.pageX - trans.x;
            var height = trans.y - e.pageY;
            var angle = 90 - (Math.atan(height / width) * 180 / Math.PI);
            _light.setAngle(angle);
        };

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
    var categories = ["awge", "revengexstorm", "sounddown", "nessly", "portalgun"];
    var gallery = ["assets/css3-drawn.png",
                  "assets/girl.png",
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

    this.next = function () {
        index++;
        if (index > this.currentGallery().length - 1) {
            index = 0;
        }
        $(element).css("opacity", 0);
        setTimeout(function (obj) {
            obj.updateImage();
        }, 250, this);
        setTimeout(function () {
            $(element).css("opacity", 1);
        }, 500);
    }

    this.previous = function () {
        index--;
        if (index < 0) {
            index = this.currentGallery().length - 1;
        }
        $(element).css("opacity", 0);
        setTimeout(function (obj) {
            obj.updateImage();
        }, 250, this);
        setTimeout(function () {
            $(element).css("opacity", 1);
        }, 500);
    }

    this.currentGallery = function () {
        return gallery;
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

    //_light = $(".modal-content").flashlight({});
    //_light.setAngle(0);

    //gallery modal 
    _gallery = $("#modal-unit-gallery").gallery({});
    $("#modal-gallery-left").click(function () {
        _gallery.previous();
    });
    $("#modal-gallery-right").click(function () {
        _gallery.next();
    });

    //wibble modal
    _wibbly = $("#modal-unit-wibbly").wibbly({});
    _wibbly.initWibbly();
    
    //blackhole modal
    blackhole('#blackhole');

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

    var canvas = $(element).get(0);
    var context = canvas.getContext('2d');
    var ratio = window.devicePixelRatio || 1;

    var totalLineHeight = 680;
    var totalLines = 4;
    var totalDiff = totalLineHeight / totalLines;
    var fontHeight = 60 * ratio - 50; // Small centering

    var smallestWidth = 280; // width of smallest line;
    var offsetX = 20;
    var offsetY = 8;
    var iterations;
    var verticalAlign, line1Diff, line2Diff, line3Diff, line4Diff, iterations, iteration, animationFrame;

    var startRGB = [255, 255, 255];
    var endRGB = [255, 255, 255];
    var fullColorSet = [];

    this.initWibbly = function () {
        cancelAnimationFrame(animationFrame);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        context.font = '180px Montserrat';
        context.textAlign = 'center';
        context.fillStyle = '#fff';
        context.strokeStyle = "#000000";
        context.lineWidth = "3";
        context.textBaseline = "middle";
        verticalAlign = (window.innerHeight / 2 * ratio) - totalLineHeight / 2;
        line1Diff = totalLineHeight + fontHeight - totalDiff;
        line2Diff = totalLineHeight + fontHeight - totalDiff * 2;
        line3Diff = totalLineHeight + fontHeight - totalDiff * 3;
        line4Diff = totalLineHeight + fontHeight - totalDiff * 4;
        iterations = Math.floor(((window.innerWidth * ratio / 2) - (smallestWidth * ratio / 2)) / offsetX + 5);
        iterations = Math.round(iterations / 10);
        this.prepareColorSets(iterations);
        iteration = 0;
        animationFrame = requestAnimationFrame(function () {
            _wibbly.draw();
        });
        //window.onresize = this.initWibbly();
        $(window).mousemove(function (event) {
            return;
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
            this.drawText(x, y);
        }

        iteration += 0.09;
        animationFrame = requestAnimationFrame(function () {
            _wibbly.draw();
        });
    }

    this.drawText = function (x, y) {
        context.fillText("AWGE", x, y + line4Diff);
        context.strokeText("AWGE", x, y + line4Diff);

        context.fillText("A website for A$AP Rocky", x, y + line3Diff);
        context.strokeText("A website for A$AP Rocky", x, y + line3Diff);

        context.fillText("Full E-Commerce and media distribution", x, y + line2Diff);
        context.strokeText("Full E-Commerce and media distribution", x, y + line2Diff);

        context.fillText("3/4 of a million users", x, y + line1Diff);
        context.strokeText("3/4 of a million users", x, y + line1Diff);
    }

    this.prepareColorSets = function (iterations) {
        fullColorSet = [];
        for (var i = 0; i < iterations; i++) {
            fullColorSet.push(this.colourGradientor(1 - i / iterations, startRGB, endRGB));
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

function blackhole(element) {
        var h = $(element).height(),
            w = $(element).width(),
            cw = w,
            ch = h,
            maxorbit = 255, // distance from center
            centery = ch / 2,
            centerx = cw / 2;

        var startTime = new Date().getTime();
        var currentTime = 0;

        var stars = [],
            collapse = false, // if hovered
            expanse = false; // if clicked

        var canvas = $('<canvas/>').attr({
                width: cw,
                height: ch
            }).appendTo(element),
            context = canvas.get(0).getContext("2d");

        context.globalCompositeOperation = "multiply";

        function setDPI(canvas, dpi) {
            // Set up CSS size if it's not set up already
            if (!canvas.get(0).style.width)
                canvas.get(0).style.width = canvas.get(0).width + 'px';
            if (!canvas.get(0).style.height)
                canvas.get(0).style.height = canvas.get(0).height + 'px';

            var scaleFactor = dpi / 96;
            canvas.get(0).width = Math.ceil(canvas.get(0).width * scaleFactor);
            canvas.get(0).height = Math.ceil(canvas.get(0).height * scaleFactor);
            var ctx = canvas.get(0).getContext('2d');
            ctx.scale(scaleFactor, scaleFactor);
        }

        function rotate(cx, cy, x, y, angle) {
            var radians = angle,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
                ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            return [nx, ny];
        }

        setDPI(canvas, 192);

        var star = function () {

            // Get a weighted random number, so that the majority of stars will form in the center of the orbit
            var rands = [];
            rands.push(Math.random() * (maxorbit / 2) + 1);
            rands.push(Math.random() * (maxorbit / 2) + maxorbit);

            this.orbital = (rands.reduce(function (p, c) {
                return p + c;
            }, 0) / rands.length);
            // Done getting that random number, it's stored in this.orbital

            this.x = centerx; // All of these stars are at the center x position at all times
            this.y = centery + this.orbital; // Set Y position starting at the center y + the position in the orbit

            this.yOrigin = centery + this.orbital; // this is used to track the particles origin

            this.speed = (Math.floor(Math.random() * 2.5) + 1.5) * Math.PI / 180; // The rate at which this star will orbit
            this.rotation = 0; // current Rotation
            this.startRotation = (Math.floor(Math.random() * 360) + 1) * Math.PI / 180; // Starting rotation.  If not random, all stars will be generated in a single line.  

            this.id = stars.length; // This will be used when expansion takes place.

            this.collapseBonus = this.orbital - (maxorbit * 0.7); // This "bonus" is used to randomly place some stars outside of the blackhole on hover
            if (this.collapseBonus < 0) { // if the collapse "bonus" is negative
                this.collapseBonus = 0; // set it to 0, this way no stars will go inside the blackhole
            }

            stars.push(this);
            this.color = 'rgba(255,255,255,' + (1 - ((this.orbital) / 255)) + ')'; // Color the star white, but make it more transparent the further out it is generated

            this.hoverPos = centery + (maxorbit / 2) + this.collapseBonus; // Where the star will go on hover of the blackhole
            this.expansePos = centery + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1); // Where the star will go when expansion takes place


            this.prevR = this.startRotation;
            this.prevX = this.x;
            this.prevY = this.y;

            // The reason why I have yOrigin, hoverPos and expansePos is so that I don't have to do math on each animation frame.  Trying to reduce lag.
        }
        star.prototype.draw = function () {
            // the stars are not actually moving on the X axis in my code.  I'm simply rotating the canvas context for each star individually so that they all get rotated with the use of less complex math in each frame.



            if (!expanse) {
                this.rotation = this.startRotation + (currentTime * this.speed);
                if (!collapse) { // not hovered
                    if (this.y > this.yOrigin) {
                        this.y -= 2.5;
                    }
                    if (this.y < this.yOrigin - 4) {
                        this.y += (this.yOrigin - this.y) / 10;
                    }
                } else { // on hover
                    this.trail = 1;
                    if (this.y > this.hoverPos) {
                        this.y -= (this.hoverPos - this.y) / -5;
                    }
                    if (this.y < this.hoverPos - 4) {
                        this.y += 2.5;
                    }
                }
            } else {
                this.rotation = this.startRotation + (currentTime * (this.speed / 2));
                if (this.y > this.expansePos) {
                    this.y -= Math.floor(this.expansePos - this.y) / -140;
                }
            }

            context.clearRect(0, 0, cw, ch);
            //context.save();
            //context.fillStyle = this.color;
            context.strokeStyle = this.color;
            context.beginPath();
            var oldPos = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR);
            context.moveTo(oldPos[0], oldPos[1]);
            context.translate(centerx, centery);
            context.rotate(this.rotation);
            context.translate(-centerx, -centery);
            context.lineTo(this.x, this.y);
            context.stroke();
            //context.restore();

            this.prevR = this.rotation;
            this.prevX = this.x;
            this.prevY = this.y;
        }


        $('.modal-unit-blackhole-centerHover').on('click', function () {
            collapse = false;
            expanse = true;

            $(this).addClass('open');
            $('.fullpage').addClass('open');
            setTimeout(function () {
                $('.header .welcome').removeClass('gone');
            }, 500);
        });
        $('.modal-unit-blackhole-centerHover').on('mouseover', function () {
            if (expanse == false) {
                collapse = true;
            }
        });
        $('.modal-unit-blackhole-centerHover').on('mouseout', function () {
            if (expanse == false) {
                collapse = false;
            }
        });

        window.requestFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        function loop() {
            var now = new Date().getTime();
            currentTime = (now - startTime) / 50;

            context.fillStyle = 'rgba(25,25,25,1)'; // somewhat clear the context, this way there will be trails behind the stars 
            context.fillRect(0, 0, cw, ch);
            
            for (var i = 0; i < stars.length; i++) { // For each star
                if (stars[i] != stars) {
                    stars[i].draw(); // Draw it
                }
            }

            requestFrame(loop);
        }

        function init(time) {
            //context.fillStyle = 'rgba(25,25,25,1)'; // Initial clear of the canvas, to avoid an issue where it all gets too dark
            //context.fillRect(0, 0, cw, ch);
            for (var i = 0; i < 1000; i++) { // create 2500 stars
                new star();
            }
            loop();
        }
        init();
    }
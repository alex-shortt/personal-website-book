var rect;
var _gravity;

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

jQuery.fn.gravity = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.gravity.defs, opts);
    this.initialize = function () {
        return this;
    }
    jQuery.fn.gravity.defs = {};

    var instance = this;
    var element = jQuery(this);
    var world;
    var viewWidth = $(element).width();
    var viewHeight = $(element).height();

    var bodies = [{
        radius: 30,
        labels: ['intro']
    }, {
        radius: 30,
        labels: ['intro']
    }, {
        radius: 10,
        labels: ['skills']
    }, {
        radius: 10,
        labels: ['skills']
    }];

    var gravity;
    var bounds;

    this.initGravity = function () {
        world = Physics({
            timestep: 1000.0 / 160,
            maxIPF: 16,
            integrator: 'verlet'
        }, function (thisWorld) {
            world = thisWorld;

            var renderer = Physics.renderer('canvas', {
                el: (element).attr('id'),
                width: viewWidth,
                height: viewHeight,
                meta: true, // don't display meta data
                styles: {
                    'circle': {
                        strokeStyle: '#351024',
                        lineWidth: 1,
                        fillStyle: '#ffffff',
                        angleIndicator: '#351024'
                    },
                    'rectangle': {
                        strokeStyle: '#351024',
                        lineWidth: 1,
                        fillStyle: '#ffffff',
                        angleIndicator: '#351024'
                    }
                }
            });

            world.add(renderer);
            world.on('step', function () {
                world.render();
            });
            var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
            bounds = Physics.behavior('edge-collision-detection', {
                aabb: viewportBounds,
                restitution: 0.99,
                cof: 0.99
            });
            world.add(bounds);

            instance.addBodySet('intro', 0, viewWidth);

            gravity = Physics.behavior('constant-acceleration');
            world.add(gravity);
            gravity.setAcceleration({
                x: 0,
                y: 0
            });

            world.add(Physics.behavior('body-impulse-response'));
            world.add(Physics.behavior('body-collision-detection'));
            world.add(Physics.behavior('sweep-prune'));

            Physics.util.ticker.on(function (time, dt) {
                world.step(time);
            });
            Physics.util.ticker.start();
        });
    }

    this.addBodySet = function (type, minY, maxY) {
        bodies.forEach(function (body) {
            if (body.labels.indexOf(type) > -1) {
                world.add(new Physics.body('circle', {
                    x: getRandomRange(body.radius, viewWidth),
                    y: getRandomRange(minY, maxY),
                    vx: getRandomRange(-0.15, 0.15),
                    vy: getRandomRange(-0.15, 0.15),
                    radius: body.radius,
                    labels: body.labels
                }));
            }
        });
    }

    this.hasBodyType = function (type) {
        var has = false;
        world._bodies.forEach(function (body) {
            if (body.labels.indexOf(type) > -1) {
                has = true;
            }
        });

        return has;
    }

    this.addText = function (text) {
        Physics.body('text', 'rectangle', function (parent) {

            var defaults = {
                text: 'Enter Text Here...',
                font: 'Arial',
                fontSize: '10px'
            };

            return {
                init: function (options) {

                    // call parent init method
                    parent.init.call(this, options);

                    options = Physics.util.extend({}, defaults, options);

                    this.geometry = Physics.geometry('circle', {
                        radius: options.radius
                    });

                    this.recalc();
                },

                recalc: function () {
                    parent.recalc.call(this);
                    this.moi = this.mass * this.geometry.radius * this.geometry.radius / 2;
                }
            };
        });
    }

    this.swapElements = function (type) {
        bounds.setAABB(Physics.aabb(0, 0, viewWidth, viewHeight * 2));
        gravity.setAcceleration({
            x: 0,
            y: 0.004
        });

        function catchBodyRise() {
            console.log("riseRun");
            var hasAll = true;
            world._bodies.forEach(function (body) {
                if (body.state.pos.y > viewHeight) {
                    hasAll = false;
                }
            });
            if (hasAll) {
                console.log("good");
                instance.resetWorldState();
                Physics.util.ticker.off(catchBodyRise);
            }
        }

        function catchBodyFall() {
            console.log(world._bodies.length);

            world._bodies.forEach(function (body) {
                if (body.state.pos.y > viewHeight) {
                    world.removeBody(body);
                    console.log("Removed!");
                }
            });
            if (world._bodies.length == 0) {
                Physics.util.ticker.off(catchBodyFall);
                gravity.setAcceleration({
                    x: 0,
                    y: -0.0006
                });
                bodies.forEach(function (body) {
                    var circle;
                    if (body.labels.indexOf(type) > -1) {
                        circle = new Physics.body('circle', {
                            x: getRandomRange(0, viewWidth),
                            y: (viewHeight * 1.25),
                            vx: getRandomRange(-0.15, 0.15),
                            vy: 0,
                            radius: body.radius,
                            labels: body.labels
                        })
                        world.add(circle);
                        var domRenderer = Physics.renderer('dom', {
                            el: (element).attr('id'),
                            width: viewWidth,
                            height: viewHeight,
                            meta: true, // don't display meta data
                            styles: {
                                'circle': {
                                    strokeStyle: '#351024',
                                    lineWidth: 1,
                                    fillStyle: '#ffffff',
                                    angleIndicator: '#351024'
                                },
                                'rectangle': {
                                    strokeStyle: '#351024',
                                    lineWidth: 1,
                                    fillStyle: '#ffffff',
                                    angleIndicator: '#351024'
                                }
                            }
                        });
                        var text = document.createElement("p");
                        var node = document.createTextNode("This is a new paragraph.");
                        text.appendChild(node);

                        domRenderer.attach(text);
                    }
                });
                Physics.util.ticker.on(catchBodyRise);
            }
        }

        Physics.util.ticker.on(catchBodyFall);
    }

    this.resetWorldState = function () {
        bounds.setAABB(Physics.aabb(0, 0, viewWidth, viewHeight));

        gravity.setAcceleration({
            x: 0,
            y: 0
        });
    }

    this.getWorld = function () {
        return world;
    }

    return this.initialize();
}

function initHash() {
    $(window).hashchange(function () {
        var hash = location.hash;
        var cleanHash = (hash.replace(/^#/, '') || 'blank');

        switch (cleanHash.split("-")[0]) {
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
        case 'projects':
            rect.changeMenu("menu-projects");
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

    _gravity = $("#about-physics").gravity({});
    _gravity.initGravity();

    //universal modal
    $(".modal-close").click(function () {
        rect.closeModal($(this).data("modal"));
    });

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
        rect.openModal("project-1");
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

function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}
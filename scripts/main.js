var _rect;
var _carousel;
var _message;
var _book;

jQuery.fn.rectangle = function(opts) {
  opts = jQuery.extend({}, jQuery.fn.rectangle.defs, opts);
  this.initialize = function() {
    return this;
  }
  jQuery.fn.rectangle.defs = {};

  var instance = this;
  var element = jQuery(this);

  this.fadeElementsIn = function() {
    setTimeout(function() {
      $("#rect-menu-container").css("opacity", 1);
    }, 500);

    setTimeout(function() {
      $("#hand-despair").css("opacity", 1);
    }, 1200);

    setTimeout(function() {
      $("#hand-help").css("opacity", 1);
    }, 1400);
  }

  this.setupProjects = function() {
    $("#hand-despair").css("opacity", 0);

    setTimeout(function() {
      $("#hand-help").css("opacity", 0);
    }, 200);

    setTimeout(function() {
      $("#rect-menu-container").addClass("rect-menu-container-skew");
    }, 1000);
  }

  this.resetRect = function(options) {
    $("#rect-menu-container").css("border", "7px solid " + options.color);
    this.enablePrevious(options.prev, (
      options.prev
      ? options.prevLink
      : null));
    options.speech
      ? _message.showSpeech(750)
      : _message.hideSpeech();
    this.fadeElementsIn();
    $("#rect-menu-container").removeClass("rect-menu-container-skew");
  }

  this.changeMenu = function(menu) {
    //add active class to select whole page at once (for fading in/out)
    $(".rect-menu").each(function() {
      $(this).css("transition", "opacity 0.7s ease-in-out");
    });

    $(".rect-menu").each(function() {
      $(this).css("opacity", 0);
    });

    switch (menu) {
      case 'menu-social':
        this.resetRect({prev: false, color: "white"});
        break;
      case 'menu-gallery':
        this.resetRect({prev: true, prevLink: "nav", color: "black"});
        break;
      case 'menu-about':
        this.resetRect({prev: true, prevLink: "nav", color: "white"});
        break;
      case 'menu-projects':
        //this.resetRect({prev: true, prevLink: "nav", color: "black", fadeIn: "false"});
        $("#rect-menu-container").css("border", "7px solid transparent");
        _rect.setupProjects();
        this.enablePrevious(false);
        _message.hideSpeech();
        _book.changePage(0);
        setTimeout(function() {
          _book.changePage(1);
        }, 1250);
        break;
      case 'menu-message':
        this.resetRect({prev: true, prevLink: "nav", color: "black", speech: true});
        break;
      default:
        this.resetRect({prev: false, color: "black"});
        break;
    }

    setTimeout(function(menu) {
      $(".rect-menu").each(function() {
        $(this).css("display", "none");
      });

      $("#" + menu).css("display", "flex");
      if (menu == "menu-projects") {
        $("#" + menu).css("display", "initial");
      }

      setTimeout(function(menu) {
        $("#" + menu).css("opacity", 1);
      }, 50, menu);
    }, 700, menu);
  }

  this.enablePrevious = function(enable, link) {
    $("#rect-previous").unbind();
    if (enable) {
      setTimeout(function() {
        $("#rect-previous").css("pointer-events", "all");
        $("#rect-previous").css("opacity", 1);
        $("#rect-previous").click(function() {
          window.location.hash = link;
        });
      }, 700);
    } else {
      $("#rect-previous").css("opacity", 0);
      $("#rect-previous").css("pointer-events", "none");
    }
  }

  return this.initialize();
}

jQuery.fn.carousel = function(opts) {
  opts = jQuery.extend({}, jQuery.fn.carousel.defs, opts);
  this.initialize = function() {
    return this;
  }
  jQuery.fn.carousel.defs = {};

  var instance = this;
  var element = jQuery(this);
  var totalPages = $("#about-carousel").children().length;
  var currentPage = 1;

  this.changePage = function(step) {
    $("#about-page-down").css({color: "white", cursor: "pointer"});

    $("#about-page-up").css({color: "white", cursor: "pointer"});

    currentPage += step;

    if (currentPage > 1) {
      currentPage = 1;
    }
    if (currentPage < 1 - totalPages + 1) {
      currentPage = 1 - totalPages + 1;
    }

    if (currentPage == 1) {
      $("#about-page-up").css({color: "gray", cursor: "pointer"});
    }

    if (currentPage == 1 - totalPages + 1) {
      $("#about-page-down").css({color: "gray", cursor: "pointer"});
    }

    $("#about-carousel").css("transform", "translateY(calc(100% / 3 * " + currentPage + "))");
  }

  return this.initialize();
}

jQuery.fn.message = function(opts) {
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

  this.initialize = function() {
    draw = SVG($(speech).attr('id'));
    window.addEventListener('resize', function() {
      _message.positionSVG();
    });
    return this;
  }

  this.checkCompletion = function() {
    var nameText = $(name).val();
    var messageText = $(message).val();

    var good = true;

    if (nameText == "") {
      $(name).css("animation", "shake 0.5s both");
      setTimeout(function() {
        $(name).css("animation", "none");
      }, 500);
      good = false;
    }

    if (messageText == "") {
      $(message).css("animation", "shake 0.5s both");
      setTimeout(function() {
        $(message).css("animation", "none");
      }, 500);
      good = false;
    }

    return good;
  }

  this.sendMessage = function() {
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

    setTimeout(function() {
      $(contact).css("opacity", 0);
      setTimeout(function() {
        $(contact).css("display", "none");
        $(confirm).css("display", "initial");
        $(confirm).css("opacity", 1);
        $(name).val("");
        $(message).val("");
      }, 1000);
    }, 1200);
  }

  this.redoMessage = function() {
    $(send).css("animation", "none");
    $(redo).css("animation", "sendButton 1s ease-in-out forwards");

    setTimeout(function() {
      $(confirm).css("opacity", 0);
      setTimeout(function() {
        $(confirm).css("display", "none");
        $(contact).css("display", "flex");
        $(contact).css("opacity", 1);
      }, 1000);
    }, 1200);
  }

  this.showSpeech = function(delay) {
    if (visible)
      return;

    if (delay == null) {
      path = draw.path(speechClosed);
      path.move(0, 0);
      this.positionSVG();
      path.animate(750, '<>').plot(speechOpen);
      visible = true;
    } else {
      setTimeout(function() {
        path = draw.path(speechClosed);
        path.move(0, 0);
        _message.positionSVG();
        path.animate(750, '<>').plot(speechOpen);
        visible = true;
      }, delay);
    }
  }

  this.positionSVG = function() {
    if (path == null)
      return;
    var x = $(rect).offset().left + $(rect).width() + 14 - path.width() - 50;
    var y = $(rect).offset().top + $(rect).height() + 7;
    $(speech).css("left", x);
    $(speech).css("top", y);
  }

  this.hideSpeech = function() {
    if (!visible)
      return;
    path.animate(750, '<>').plot(speechClosed);
    setTimeout(function() {
      path.remove();
      $(speech).css("left", 0);
      $(speech).css("top", 0);

      visible = false;
    }, 750);
  }

  return this.initialize();
}

jQuery.fn.book = function(opts) {
  opts = jQuery.extend({}, jQuery.fn.book.defs, opts);
  this.initialize = function() {
    this.hideAllPages();
    return this;
  }
  jQuery.fn.book.defs = {};

  var instance = this;
  var element = jQuery(this);

  // 0 is front cover
  var curPage = 0;
  // not including cover
  const numPages = $(".book-page > li").length;

  this.changePage = function(newPage) {
    curPage = newPage;
    this.updatePage();
  }

  this.updatePage = function() {
    this.hideAllPages();
    this.showPage(curPage);

    var randomInterval = .125;

    // front cover: open or close
    this.closePage(0);
    if (curPage != 0) {
      this.openPage(0, -145);
    }

    // pages that flip towards front cover
    var numFront = curPage - 1;
    var frontAngles = [-145, -110];
    var frontTimes = [1.2, 1.8];
    for (var i = 1; i <= numFront; i++) {
      var angle = ((frontAngles[1] - frontAngles[0]) / numFront) * i;
      angle += frontAngles[0];
      var time = ((frontTimes[1] - frontTimes[0]) / numFront) * i;
      time += frontTimes[0]
      time += (Math.random() - 0.5) * randomInterval;
      this.openPage(i, angle, time);
    }

    // pages that flip towards back cover
    var numBack = numPages - curPage + 1;
    var backAngles = [-16, -35];
    var backTimes = [1.8, 2];
    for (var i = curPage; i <= numPages; i++) {
      var angle = ((backAngles[1] - backAngles[0]) / numBack) * (numPages - i);
      angle += backAngles[0];
      var time = ((backTimes[1] - backTimes[0]) / numBack) * (numPages - i);
      time += backTimes[0]
      time += (Math.random() - 0.5) * randomInterval;
      this.openPage(i, angle, time);
    }
  }

  this.openPage = function(numPage, angle, time) {
    this.closePage(numPage);
    if (numPage == 0) {
      var selector = ".book-cover-front";

      $(selector).css("-webkit-transform", "rotateY(" + angle + "deg)  translateZ(0)");
      $(selector).css("-moz-transform", "rotateY(" + angle + "deg)  translateZ(0)");
      $(selector).css("transform", "rotateY(" + angle + "deg)  translateZ(0)");
      if (time) {
        $(selector).css("-webkit-transition-duration", time + "s");
        $(selector).css("-moz-transition-duration", time + "s");
        $(selector).css("transition-duration", time + "s");
      }
      $(selector).css("z-index", 0);
    } else {
      var selector = ".book-page li:nth-child(" + numPage + ")";

      $(selector).css("-webkit-transform", "rotateY(" + angle + "deg)");
      $(selector).css("-moz-transform", "rotateY(" + angle + "deg)");
      $(selector).css("transform", "rotateY(" + angle + "deg)");
      $(selector).css("-webkit-transition-duration", time + "s");
      $(selector).css("-moz-transition-duration", time + "s");
      $(selector).css("transition-duration", time + "s");
    }
  }

  this.hideAllPages = function() {
    $(".page:not(.page-toc)").each(function(ind, obj) {
      console.log("hide " + ind);
      $(obj).find(".page-content").addClass("hidden");
      $(obj).find(".page-back").addClass("hidden");
    });
  }

  this.showPage = function(numPage) {
    console.log("SHOW --" + numPage);
    $(".book-page li:nth-child(" + numPage + ")").find(".page-content").removeClass("hidden");
    $(".book-page li:nth-child(" + numPage + ")").find(".page-back").removeClass("hidden");
  }

  this.closePage = function(numPage) {
    var selector = numPage == 0
      ? ".book-cover-front"
      : ".book-page li:nth-child(" + numPage + ")";
    $(selector).removeAttr("style");
  }

  return this.initialize();
}

function initHash() {
  $(window).hashchange(function() {
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
      case 'gallery':
        _rect.changeMenu("menu-gallery");
        break;
      case 'message':
        _rect.changeMenu("menu-message");
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
  $('html').mousemove(function(e) {
    var wx = $(window).width();
    var wy = $(window).height();

    var x = e.pageX - this.offsetLeft;
    var y = e.pageY - this.offsetTop;

    var newx = x - wx / 2;
    var newy = y - wy / 2;

    //$('span').text(newx + ", " + newy);

    $('#parallax-wrapper .parallax').each(function() {
      var speed = $(this).attr('data-speed');
      if ($(this).attr('data-revert'))
        speed *= -1;
      TweenMax.to($(this), 1, {
        x: (1 - newx * speed / 200),
        y: (1 - newy * speed / 200)
      });
    });
  });
}

function initSocial() {
  $("#social-github").click(function() {
    window.open("https://github.com/alex-shortt");
  });
  $("#social-soundcloud").click(function() {
    window.open("https://soundcloud.com/alex_shortt");
  });
  $("#social-twitter").click(function() {
    window.open("https://twitter.com/_alexshortt");
  });
  $("#social-instagram").click(function() {
    window.open("https://www.instagram.com/alexander.shortt/");
  });
  $("#social-linkedin").click(function() {
    window.open("https://www.linkedin.com/in/alexshortt/");
  });
  $("#social-back").click(function() {
    window.location.hash = "nav";
  });
}

function initAbout() {
  _carousel = $("#about-carousel").carousel({});

  $("#about-page-up").click(function() {
    _carousel.changePage(1);
  });
  $("#about-page-down").click(function() {
    _carousel.changePage(-1);
  });
}

function initNavMain() {
  //main menu
  $("#menu-main-title").click(function() {
    window.location.hash = "nav";
  });

  //nav menu
  $("#menu-nav-projects").click(function() {
    window.location.hash = "projects";
  });
  $("#menu-nav-about").click(function() {
    window.location.hash = "about";
  });
  $("#menu-nav-social").click(function() {
    window.location.hash = "social";
  });
  $("#menu-nav-gallery").click(function() {
    window.location.hash = "gallery";
  });
  $("#menu-nav-message").click(function() {
    window.location.hash = "message";
  });
  $("#menu-nav-back").click(function() {
    window.location.hash = "";
  });
}

function initProjects() {
  _book = $(".book").book({});

  _book.updatePage();

  $(".page").each(function(ind, obj) {
    $(obj).children().each(function(ind, obj) {
      $(obj).click(function() {
        if ($(this).data("page") == "0") {
          _book.changePage(0);
          setTimeout(function() {
            window.location.hash = "nav";
          }, 1750);
        } else if ($(this).data("page")) {
          _book.changePage(parseInt($(this).data("page")));
        }
      })
    });
  })
}

function initMessage() {
  _message = $("#menu-message").message({})

  $("#menu-message-contact-send").click(function() {
    _message.sendMessage();
  });
  $("#menu-message-confirm-redo").click(function() {
    _message.redoMessage();
  });
}

function initPage() {
  _rect = $("#parallax-wrapper").rectangle({});

  setTimeout(function() {
    $("#rect-menu-container").css("opacity", 1);
  }, 500);

  initNavMain();
  initAbout();
  initSocial();
  initMessage();
  initProjects();
}
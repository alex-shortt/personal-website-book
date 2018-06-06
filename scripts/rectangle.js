var _rect;
var _light;
var _carousel;
var _message;

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
        $("#rect-menu-container").css("border", "7px solid white");
        this.enablePrevious(false);
        _message.hideSpeech();

        break;
      case 'menu-gallery':
        $("#rect-menu-container").css("border", "7px solid black");
        this.enablePrevious(true, "nav");
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

function traceEvent(e) {
  if (_light != null)
    _light.setAngle(e.value);
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
  _rect.fadeElementsIn();

  initNavMain();
  initAbout();
  initSocial();
  initMessage();
}

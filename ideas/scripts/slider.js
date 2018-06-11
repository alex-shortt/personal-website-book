var pagation;

function initHash() {
    $(window).hashchange(function () {
        var hash = location.hash;
        var cleanHash = (hash.replace(/^#/, '') || 'blank');
        
        switch (cleanHash) {
            case 'blank':
                pagation.scrollPage(0);
                break;
            case 'projects':
                pagation.scrollPage(1);
                break;
            case 'about':
                pagation.scrollPage(2);
                break;
            default:
                pagation.scrollPage(0);
                break;
        }
    });

    $(window).hashchange();
}

jQuery.fn.pagation = function (opts) {
    opts = jQuery.extend({}, jQuery.fn.pagation.defs, opts);

    var instance = this;
    var element = jQuery(this);
    var pages = opts.page;
    var currentPage = 0;

    this.scrollPage = function (page) {
        var speed = 1;
        var distance = Math.abs(page - currentPage);
        
        element.css("transition", "all " + (distance / speed) + "s ease");
        element.css("transform", "translateX(-" + page + "00%)");
        
        currentPage = page;
    }

    this.initialize = function () {
        return this;
    }

    return this.initialize();


    jQuery.fn.pagation.defs = {
        pages: 0
    };
}

function initPage() {
    pagation = $("#shortt-content-wrapper").pagation({
        pages: 2
    });
    
    $("#link-home").click(function(){
        window.location.hash = "";
    });
    
    $("#link-projects").click(function(){
        window.location.hash = "projects";
    });
    
    $("#link-about").click(function(){
        window.location.hash = "about";
    });
}

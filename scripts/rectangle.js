  window.onload = function () {
      var svgCSS = $("#svg-css").html();
      $("#rect-hand").setSVGStyle(svgCSS);
      var svg = $("#rect-hand").getSVG();
      //use jquery functions to do some thing
      svg.find("g path:first-child()").attr('fill', "#78ab73");
  };

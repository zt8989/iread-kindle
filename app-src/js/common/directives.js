const commonDirectives = angular.module('commonDirectives', []);

commonDirectives.directive("kindleBottom", function(){
  return {
    require: "^resetViewport",
    link(scope, el, attr, controllers){
      scope.$watch(() => controllers.zoom, value => {
        ve = document.documentElement.clientHeight,
        ke = window.outerHeight
        el.css("padding-bottom", value * Math.abs(ke - ve) + "px !important")
      })
    }
  }
}).directive("resetViewport", function(){
  var targetRatio = 300;
  function resetViewport(setZoom) {
      var e = window.screen.width
        , t = window.screen.height;
      1e3 < e || 1e3 < t ? window.cookie_utils && (setZoom(zoom),
      window.cookie_utils.set("wr_scaleRatio", 1)) : (t = document.getElementById("wr_size_detect").getBoundingClientRect()) && (t = e / t.width,
      targetRatio === t || (t = t / targetRatio) && 1.1 < t && (setZoom(t),
      window.cookie_utils && window.cookie_utils.set("wr_scaleRatio", t)))
  }
  return {
    controller: function($scope, $element, $attrs, $transclude){
      this.zoom = 1
    },
    link(scope, el, attr, controller){
      resetViewport(zoom => {
        controller.zoom = zoom
        el[0] = zoom
      })
    }
  }
}).directive("initFont", function(){
  return {
    link(scope, el, attr){
      el[0].style.fontSize = (12 * 0.75) +'pt';
    }
  }
});
import "./common/global.35483d"
import "./common/cookie.0e551c"
import "./common/services"
import "./bookDetail"
import "./bookList"

const ireadApp = angular.module('ireadApp', [
    'ngRoute',
    'bookDetail',
    'bookList',
]);

ireadApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/books.html',
        controller: 'BookListCtrl'
      }).
      when('/detail', {
        templateUrl: 'partials/detail.html',
        controller: 'BookDetailCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]).directive("resetViewport", function(){
  var targetRatio = 300;
  function resetViewport(el) {
      var e = window.screen.width
        , t = window.screen.height;
      1e3 < e || 1e3 < t ? window.cookie_utils && (el.zoom = 1,
      window.cookie_utils.set("wr_scaleRatio", 1)) : (t = document.getElementById("wr_size_detect").getBoundingClientRect()) && (t = e / t.width,
      targetRatio === t || (t = t / targetRatio) && 1.1 < t && (el.zoom = t,
      window.cookie_utils && window.cookie_utils.set("wr_scaleRatio", t)))
  }
  return {
    link(scope, el, attr){
      resetViewport(el[0])
    }
  }
}).directive("initFont", function(){
  return {
    link(scope, el, attr){
      el[0].style.fontSize = (12 * 0.75) +'pt';
    }
  }
});


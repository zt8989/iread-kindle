var targetRatio = 300;
function resetViewport() {
    var e = window.screen.width
      , t = window.screen.height;
    1e3 < e || 1e3 < t ? window.cookie_utils && (document.body.style.zoom = 1,
    window.cookie_utils.set("wr_scaleRatio", 1)) : (t = document.getElementById("wr_size_detect").getBoundingClientRect()) && (t = e / t.width,
    targetRatio === t || (t = t / targetRatio) && 1.1 < t && (document.body.style.zoom = t,
    window.cookie_utils && window.cookie_utils.set("wr_scaleRatio", t)))
}

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.fontSize = (12 * 0.75) +'pt';
  resetViewport()
})

const ireadApp = angular.module('ireadApp', [
    'ngRoute',
    'ireadControllers'
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
  }]);

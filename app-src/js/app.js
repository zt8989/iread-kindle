import "./common/global.35483d"
import "./common/cookie.0e551c"
import "./common/services"
import "./common/directives"
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
}])


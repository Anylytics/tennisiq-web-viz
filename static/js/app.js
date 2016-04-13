var ngApp = angular.module('ngApp', ['ngRoute', 'ngAppControllers']);

ngApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      /*when('/home/:player/:topn/:ser_ret', {
        templateUrl: './static/partials/home.html',
        controller: 'networkController'
      }).*/
      when('/home/', {
        templateUrl: './static/partials/home.html',
        reloadOnSearch: false,
        controller: 'networkController'
      }).
      otherwise({
        redirectTo: '/home'
      });
}]);

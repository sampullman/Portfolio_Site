'use strict';

/* App Module */

angular.module('portfolio', ['portfolioFilters', 'portfolioServices', 'portfolioDirectives']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/home', {templateUrl: 'static/partials/home_view.html', controller: HomeController}).
      when('/portfolio/', {templateUrl: 'static/partials/portfolio_view.html', controller: PortfolioController,
  						  reloadOnSearch: false}).
      when('/games', {templateUrl: 'static/partials/games_view.html', controller: GamesController}).
      when('/resume', {templateUrl: 'static/partials/resume_view.html'}).
      otherwise({redirectTo: '/home'});
}]);
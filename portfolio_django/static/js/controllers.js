'use strict';

/* Controllers */


function BaseController($scope, $location) {
	$scope.changeView = function(view) {
		$location.path(view.toLowerCase());
	};
	$scope.load = function() {
		loadMainStyles();
	};
}

function HomeController($scope) {
	loadHome();
	$scope.$on('$destroy', function(){ pauseGame(); });
}

function PortfolioController($scope, $location) {
	var base = "https://dl.dropbox.com/sh/631wm7d11mdr3mj/";
	$scope.apps = {'SciGraph_Calculator': base+'FTQwavQAQL/portfolio/static/images/app_icons/scigraph_calc.png',
				   'Molecular_Mass_Calculator': base+'gruXDpML5w/portfolio/static/images/app_icons/molecular_mass.png',
				   'Cube_Droid': base+'tQhSkYZ_t6/portfolio/static/images/app_icons/cube_droid.png',
				   'Quiz_Droid': base+'8E3AJh4lOt/portfolio/static/images/app_icons/quiz_droid.png',
				   'Web_Comic_Reader': base+'SJfb4r-QQo/portfolio/static/images/app_icons/comic_reader.png',
				   'Number_Slide': base+'Ceg1PeNLrH/portfolio/static/images/app_icons/number_slide.png'};
	loadPortfolio();
	$scope.$on('$routeUpdate', function() {
		$scope.curApp = $location.search().app;
	});
	if(!$location.search().app) {
		$location.search('app', 'Cube_Droid');
	}
	$scope.$on('$destroy', function() {
		$location.search('app', null);
	});
}

function GamesController($scope) {
	
}
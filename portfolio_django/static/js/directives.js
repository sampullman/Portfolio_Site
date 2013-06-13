'use strict';

/* Directives */
angular.module('portfolioDirectives', [])
.directive('activeLink', ['$location', function(location) {
    return {
        link: function(scope, element, attrs, controller) {
            var cls = attrs.activeLink;
            scope.location = location;
			var path = '';
			scope.$watch('attrs.id', function (newId) {
            	path = attrs.id;
			});
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath.split('/')[1]) {
					var elem = jQuery(element);
					var pos = elem.position();
					jQuery('#nav_arrow').animate({
						top: pos.top+(elem.height()/2.1),
					});
                    element.addClass(cls);
                } else {
                    element.removeClass(cls);
                }
            });
        }

    };
}])
.directive('appNav', ['$location', function(location) {
	return {
		link: function(scope, element, attrs, controller) {
			var app = '';
			scope.$watch('attrs.id', function (newId) {
            	app = attrs.id;
			});
            scope.$watch('curApp', function(newPath) {
				var newApp = location.search().app;
                if (app === newApp) {
				    appNum = appNames.indexOf(newApp);
				    imgInd = 0;
				    setImg();
				    $("#android_portfolio_subtitle").html(getAppTitle(appNum));
				    $("#android_portfolio_text").html($("#"+newApp+".hidden_portfolio_text").html());
				    $("#img_nav_right").css('visibility','visible');
				    $("#img_nav_left").css('visibility','hidden');
					var elem = jQuery(element);
					var pos = elem.position();
					var arrow = $('#app_arrow');
					console.log(pos.left+" "+(elem.width()/2));
					arrow.animate({
						left: pos.left+(elem.width()/2)-(arrow.width()/2)
					});
				}
			});
		}
	}
}])
.directive('appTip', [function(location) {
	return {
		link: function(scope, element, attrs, controller) {
			$(element).tipsy({title: function() {
				return attrs.appTip.replace(/_/g, ' ');},
				fade: true, gravity: 's' });
		}
	}
}])
.directive('courseControl', [function() {
	return {
		link: function(scope, element, attrs) {
			var text = $(attrs.courseControl);
			element.bind('click', function(e) {
				if(text.is(':visible')) {
					text.stop(true, true).slideUp();
					jQuery(element).find('.course_symbol').text('+');
				} else {
					text.stop(true, true).slideDown();
					jQuery(element).find('.course_symbol').text('-');
				}
			});
		}
	}
}]);
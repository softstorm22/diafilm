'use strict';

// Declare app level module which depends on filters, and services
angular.module('diafilm', [
	'ng',
	'ngSanitize'
	])
	.config([
	'$routeProvider',
	'$httpProvider',
	function($routeProvider, $httpProvider) {
		
		$routeProvider.when('/dashboard', {
			templateUrl: 'partials/dashboard.html',
			controller: 'Dashboard'
		});

		$routeProvider.otherwise({
			redirectTo: '/dashboard'
		});
		
	}
]).run([
	'$rootScope',
	'$location',
	'data',
	function($rootScope, $location, data) {

		// global models
		$rootScope.carouselInterval = 3000;
		
		$rootScope.runningCarousel = false;
		
		// photos store
		$rootScope.photos = data.getPhotos();
		
		// current location
		$rootScope.location = $location;
		
		// methods
		$rootScope.GoTop = function() {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		};
		
		// safeApply to solve issues with calling $apply too early
		$rootScope.SafeApply = function(fn) {
			var phase = this.$root.$$phase;
			
			if(!fn) fn = function(){};
			
			if(phase == '$apply' || phase == '$digest') {
				fn();
			} else {
				this.$apply(fn);
			}
		};
		
		
		
	}
]);

// inject logging ability
angular.module('diafilm').$inject = [ '$log' ];
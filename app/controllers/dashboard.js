/* Dashboard Controller */
angular.module('diafilm').controller('Dashboard', [
	'$scope',
	'$rootScope',
	'data',
	function($scope, $rootScope, data) {
		
		// add image from url
		$scope.imageUrl = '';
		
		$scope.AddImageFromUrl = function() {
		
			data.addPhoto({
				src: $scope.imageUrl
			});
		
		}
		
		// control slideshow
		
		// get carousel object
		$scope.carousel = $('.carousel');
		
		// stop slideshow
		$scope.StopCarousel = function() {
		
			// if running, stop it
			if($rootScope.runningCarousel) {
			
				$rootScope.runningCarousel = false;
				
				$('.carousel').carousel('pause');
			};
		
		};
		
		// start slideshow
		$scope.StartCarousel = function() {
			
			$rootScope.runningCarousel = true;
			$('.carousel').carousel('cycle');
			
		};
		
	}
]);
/* Carousel Directive */
angular.module('diafilm').directive('carousel', [
	'$rootScope',
	'$compile',
	function($rootScope, $compile){
		
		var carouselTemplate = '<div class="carousel slide">' +
				'<div class="carousel-inner">' +
				'<div class="item" ng-repeat="photo in photos.content" carousel-item>' +
					'<img ng-src="{{ photo.src }}" alt="">' +
				'</div>' +
				'</div>' +
			'</div>';
		
		return {
			replace: true,
			template: carouselTemplate,
			link: function(scope, element, attrs) {
				
				// watch for interval changes
				$rootScope.$watch('carouselInterval', function(event) {
					
					// clear previous carousel instance
					element.carousel('pause');
					element.removeData();
					
					// recompile html
					element.html( $compile(carouselTemplate)(scope) );
					
					// update bootstrap carousel
					element.carousel({
						interval: $rootScope.carouselInterval
					});
					
					element.carousel('pause');
					$rootScope.runningCarousel = false;
					
				});
				
			}
		}
	}
]);

/* Carousel-Item Directive */
angular.module('diafilm').directive('carouselItem', [
	'$rootScope',
	function($rootScope) {
		
		return function(scope, element, attrs) {
		
			// add active class on first element
			if(scope.$first) {
				element.addClass('active');
			}
		
			// when last item is ready
			if(scope.$last) {
				
			}
			
		};
	
	}
]);
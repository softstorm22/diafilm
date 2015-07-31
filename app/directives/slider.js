/* Slider Directive */
angular.module('diafilm').directive('slider', [
	'$rootScope',
	function($rootScope) {
	
		return function(scope, element, attrs) {
				
			// init jquery-ui slider
			element.slider({
				range: 'min',
				min: 500,
				step: 500,
				max: 20000,
				value: $rootScope.carouselInterval,
				slide: function(event, ui) {
				
					// update global model
					$rootScope.carouselInterval = ui.value;
				
					$rootScope.$apply();
					
				}
			});
				
		}
	
	}
]);
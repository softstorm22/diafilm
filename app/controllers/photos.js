/* Photos Controller */
angular.module('diafilm').controller('Photos', [
	'$scope',
	'data',
	function($scope, data) {
		
		// Drag-n-Drop functionality
		var $photoDropbox = $('.photos-dropbox');
	
		function imagesSelected(files) {
			for (var i = 0, f; f = files[i]; i++) {
				
				var imageReader = new FileReader();
				imageReader.onload = (function(aFile) {
					return function(e) {
						
						data.addPhoto({
							src: e.target.result
						});
						
					};
				})(f);
				
				imageReader.readAsDataURL(f);
			}
		}

		function dropIt(e) {
			imagesSelected(e.dataTransfer.files); 
			e.stopPropagation();  
			e.preventDefault();   
		}
		
		// drop event
		$photoDropbox[0].addEventListener('drop', dropIt, false);
		
		$photoDropbox.bind('dragenter', function() {
			// TODO add class
			return false;
		});
		
		$photoDropbox.bind('dragover', function() {
			return false;
		});
		
		// Remove photos
		$scope.RemovePhoto = function(key) {
		
			data.removePhoto({
				key: key
			});
		
		}
	
	}
]);
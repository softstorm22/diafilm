fs = require('fs');
path = require('path');

// See docs at http://brunch.readthedocs.org/en/latest/config.html.

exports.config = {

	modules: {
		definition: false,
		wrapper: false
	},

	paths: {
		public: 'public'
	},
	
	files: {
	
		javascripts: {
			defaultExtension: 'js',
			joinTo: 'javascripts/app.js',
			order: {
				before: [
					'vendor/jquery-1.8.2.min.js',
					'vendor/angular/angular.js',
					
					'vendor/lawnchair.js',
					'vendor/lawnchair-adapter-indexed-db.js',
					'vendor/lawnchair-adapter-dom.js',
					
					'vendor/bootstrap/js/bootstrap.js',
					
					'vendor/angular/angular-sanitize.js',
					'vendor/angular/angular-resource.js',
					'vendor/angular/angular-loader.js',
					'vendor/angular/angular-cookies.js',
					
					'vendor/moment.js',
					
					'app/app.js',
					'app/filters.js'
				]
			}
		},

		stylesheets: {
			defaultExtension: 'scss',
			joinTo: 'stylesheets/app.css',
			order: {
				before: []
			}
		}

	},
  
	server: {
		port: 3333,
		base: '/',
		run: 'no'
	}

};
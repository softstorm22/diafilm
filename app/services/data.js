// Data service
angular.module('diafilm').factory('data', [
	'$rootScope',
	function($rootScope) {
	
		// check support for indexed-db
		var indexedDBSupport = ('webkitIndexedDB' in window || 'mozIndexedDB' in window || 'indexedDB' in window);
		
		// lawnchair storage adapter
		var storageAdapter = (indexedDBSupport) ? 'indexed-db' : 'dom';

		// init lawnchair db
		$rootScope.store = new Lawnchair({
			name: 'photos',
			record: 'photo',
			adapter: storageAdapter
		}, function(photos) {})
	
		// data cache
		var photos = {
				readyState: 'complete',
				content: []
			};
		
		return {
			getPhotos: function(params) {
				
				if(photos.length) {
					
					photos.readyState = 'complete';
					
				} else {
				
					photos.readyState = 'loading';
					
					$rootScope.store.all(function(storePhotos) {
						
						photos.readyState = 'complete';
						
						angular.copy(storePhotos, photos.content);
						
						$rootScope.$apply();
						
					});
				
				}
				
				return photos;
			
			},
			
			addPhoto: function(params) {
			
				var imageId = 'image' + new Date().getTime();
			
				// add local
				$rootScope.photos.content.push({
					key: imageId,
					src: params.src
				});
			
				// add to store
				$rootScope.store.save({
					key: imageId,
					src: params.src
				});
				
				$rootScope.SafeApply();
			
			},
			
			removePhoto: function(params) {
			
				// remove local
				var i;
				for(i = 0; i < $rootScope.photos.content.length; i++) {
					if($rootScope.photos.content[i].key == params.key) {
						$rootScope.photos.content.splice(i, 1);
					}
				}
			
				// remove from store
				$rootScope.store.remove({
					key: params.key
				});
				
				//$rootScope.$apply();
			
			}
			
			/*
			getUser: function() {
			
				return store.get('user');
			
			},
			
			setUser: function() {
				
			},
			
			getUserById: function(params) {
			
				// if not in cache
				if(users[params.id]) {
				
					users[params.id].readyState = 'complete';
				
				} else {
					
					// get from api
					users[params.id] = {
						readyState: 'loading',
						content: {}
					};
					
					// api
					API.GetUserById({
						data: {
							user_id: params.id
						},
						success: function(response) {
							
							users[params.id].readyState = 'complete';
							
							angular.copy(response.user, users[params.id].content);
							
							$rootScope.$apply();
							
						},
						error: function(status) {
							
							users[params.id].readyState = 'error';
							
							$rootScope.$apply();
						
						}
					});
					
				}
				
				return users[params.id];
			
			},

			getCity: function  (params) {
				
				town = {
					readyState : 'loading',
					content : {}
				}

				API.GetCity({
					data: params,
					success: function (response) {
						
						angular.copy(response.town, town.content);
						town.readyState = 'complete';

						$rootScope.$apply();
						
					},
					error: function (response) {
						
					}
				});
				
				return town;

			},

			getCities: function (params) {
				
				// if not in cache
				if(cities) {
				
					cities.readyState = 'complete';
				
				} else {
				
					cities = {
						readyState: 'loading',
						content: []
					};
					
					API.GetCities({
						data: params,
						success: function (response) {
							
							angular.copy(response.cities, cities.content);
							cities.readyState = 'complete';

							$rootScope.$apply();
							
						},
						error: function (response) {
							
						}
					});
					
				}

				return cities;

			},

			createIssue: function (params) {
				
				// api
				API.CreateIssue({
					data: params,
					success: function(response) {

						var newIssue = {
							readyState: 'complete',
							content: response
						};
					
						// create in issues
						issues[response.issue.id] = newIssue;
					
						// add new issue to user issues
						userIssues.content.push(response.issue);
						
						$rootScope.$apply();
						
					},
					error: function(status) {
						
						//issues[params.id].readyState = 'error';
						
					}
				});
				
			},
			
			updateIssue: function (params) {
				
				// api
				API.UpdateIssue({
					data: params,
					success: function(response) {

						issues[params.id].readyState = 'complete';
						
					},
					error: function(status) {

						issues[params.id].readyState = 'error';
						
					}
				});
			},

			getIssue: function(params) {
			
				// if not in cache
				if(issues[params.id]) {
				
					issues[params.id].readyState = 'complete';
				
				} else {
					
					// get from api
					issues[params.id] = {
						readyState: 'loading',
						content: {}
					};
					
					// api
					API.ViewIssue({
						data: {
							id: params.id
						},
						success: function(response) {
							
							issues[params.id].readyState = 'complete';
							
							angular.copy(response, issues[params.id].content);
							
							
							$rootScope.$apply();
							
						},
						error: function(status) {
							
							issues[params.id].readyState = 'error';
							
						}
					});
					
				}
				
				return issues[params.id];
			
			},
			
			deleteIssue: function(params) {
			
				// delete from local
				delete issues[params.id];
				
				// delete from user issues
				var i;
				for(i = 0; i < userIssues.content.length; i++) {
					if(userIssues.content[i].id == params.id) {
						userIssues.content.splice(i, 1);
					}
				}
				
				// delete from subscribed issues
				for(i = 0; i < subscribedIssues.content.length; i++) {
					if(subscribedIssues.content[i].id == params.id) {
						subscribedIssues.content.splice(i, 1);
					}
				}

				// delete from api
				API.DeleteIssue({
					data: {
						id: params.id
					},
					success: function (response) {
						
					}
				});
				
				return true;
			
			},
			
			supportIssue: function(params) {
			
				// local
				if(!issues[params.id]) {
					issues[params.id] = {
						readyState: 'complete',
						content: {
							issue: {}
						}
					};
				}
				
				issues[params.id].content.issue.supported = true;

				$rootScope.SafeApply();

				// api
				API.SupportIssue({
					data: {
						id: params.id
					}
				});
			
			},
			
			unsupportIssue: function(params) {
			
				// local
				if(!issues[params.id]) {
					issues[params.id] = {
						readyState: 'complete',
						content: {
							issue: {}
						}
					};
				}
				
				issues[params.id].content.issue.supported = false;
				
				//$rootScope.$apply();

				// api
				API.UnsupportIssue({
					data: {
						id: params.id
					}
				});
				
				return true;
			
			},
			
			subscribeIssue: function(params) {
			
				// local
				if(!issues[params.id]) {
					issues[params.id] = {
						readyState: 'complete',
						content: {}
					};
				}
			
				issues[params.id].content.issue.isSubscribed = true;
				
				// api
				API.SubscribeIssue({
					data: {
						id: params.id
					}
				});
			
			},
			
			unsubscribeIssue: function(params) {
			
				// local
				if(!issues[params.id]) {
					issues[params.id] = {
						readyState: 'complete',
						content: {}
					};
				}
			
				issues[params.id].content.issue.isSubscribed = false;
				
				// api
				API.UnsubscribeIssue({
					data: {
						id: params.id
					}
				});
			
			},
			
			// get comments
			getComments: function(params) {
			
				// if in cache
				if(comments[params.id]) {
				
					comments[params.id].readyState = 'complete';
				
				} else {
					
					// get from api
					comments[params.id] = {
						readyState: 'loading',
						content: []
					};
					
					// api
					API.GetComments({
						data: {
							id: params.id
						},
						success: function(response) {
							
							comments[params.id].readyState = 'complete';
							
							angular.copy(response.comments, comments[params.id].content);
							
							$rootScope.$apply();
							
						},
						error: function(status) {
							
							comments[params.id].readyState = 'error';
							
						}
					});
					
				};
				
				return comments[params.id];
			
			},
			
			// post new comment
			postComment: function(params) {
			
				// if there are no comments for the issue
				if(!comments[params.id]) {
					comments[params.id] = {
						readyState: 'complete',
						content: []
					};
				}
			
				// add in local
				comments[params.id].content.push({
					liked: false,
					comment: params.comment,
					date: new Date(),
					likes: 0,
					user: $rootScope.user
				});
				
				// api
				API.PostComment({
					data: {
						id: params.id,
						comment: params.comment
					}
				});
				
				return true;
			
			},
			
			likeComment: function(params) {
			
				// if there are no comments for the issue
				var commentIndex,
					i;
				
				// find comment by id
				for(i = 0; i < comments[params.issueId].content.length; i++) {
					if(comments[params.issueId].content[i].id  == params.id) {
						commentIndex = i;
					};
				};
				
				// add in local
				comments[params.issueId].content[commentIndex].liked = true;
				comments[params.issueId].content[commentIndex].likes++;
				
				// api
				API.LikeComment({
					data: {
						id: params.id
					}
				});
				
				return true;
			
			},
			
			unlikeComment: function(params) {
			
				// if there are no comments for the issue
				var commentIndex,
					i;
					
				// find comment by id
				for(i = 0; i < comments[params.issueId].content.length; i++) {
					if(comments[params.issueId].content[i].id == params.id) {
						commentIndex = i;
					};
				};
				
				// add in local
				comments[params.issueId].content[commentIndex].liked = false;
				comments[params.issueId].content[commentIndex].likes--;
				
				// api
				API.UnlikeComment({
					data: {
						id: params.id
					}
				});
				
				return true;
			
			},
			
			getUserIssues: function(params) {
			
				// if not in cache
				if(userIssues) {
				
					userIssues.readyState = 'complete';
				
				} else {
					
					// get from api
					userIssues = {
						readyState: 'loading',
						content: []
					};
					
					// api
					API.UserIssues({
						success: function(response) {
							
							userIssues.readyState = 'complete';
							
							angular.copy(response.issueList, userIssues.content);
							
							// copy to issues
							var i = 0;
							for(i = 0; i < response.issueList.length; i++) {
								if(!issues[response.issueList[i].id]) {
									issues[response.issueList[i].id] = {
										readyState: 'complete',
										content: {
											issue: response.issueList[i]
										}
									}
								}
							}
							
							$rootScope.$apply();
							
						},
						error: function(status) {
							
							userIssues.readyState = 'error';
							
						}
					});
					
				}
				
				return userIssues;
			
			},
			
			getSubscribedIssues: function(params) {
			
				// if not in cache
				if(subscribedIssues) {
				
					subscribedIssues.readyState = 'complete';
				
				} else {
					
					// get from api
					subscribedIssues = {
						readyState: 'loading',
						content: []
					};
					
					// api
					API.SubscribedIssues({
						success: function(response) {
							
							subscribedIssues.readyState = 'complete';
							
							angular.copy(response.issues, subscribedIssues.content);
							
							// copy to issues
							var i = 0;
							for(i = 0; i < response.issues.length; i++) {
								if(!issues[response.issues[i].id]) {
									issues[response.issues[i].id] = {
										readyState: 'complete',
										content: {
											issue: response.issues[i]
										}
									}
								}
							}
							
							$rootScope.$apply();
							
						},
						error: function(status) {
							
							subscribedIssues.readyState = 'error';
							
						}
					});
					
				}
				
				return subscribedIssues;
			
			},
		
			*/
		}
	}
]);

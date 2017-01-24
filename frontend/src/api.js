var apiUrl = 'http://jnp3-dev.eu-central-1.elasticbeanstalk.com/api/';
// var apiUrl = 'http://localhost:8000/api/'
// var wsUrl = 'ws://localhost:8080/ws'
var wsUrl = 'ws://ec2-54-93-49-189.eu-central-1.compute.amazonaws.com:8080/ws'

angular.module('JNPAPP.api', ['ngResource'])
    .config(['$resourceProvider', function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    }])
    .factory('User', ['$resource', function ($resource) {
        return $resource(apiUrl + 'users/:username/', {},
            {'save': {method: 'POST', url: apiUrl + "users/create/"}}, {stripTrailingSlashes: false});
    }])
    .factory('Post', ['$resource', function($resource) {
        return $resource(apiUrl + 'posts/:id/', {id: '@id'});
    }])
    .factory('UserPosts', ['$resource', function($resource) {
        return $resource(apiUrl + 'users/:username/posts/');
    }])
    .factory('UserFriends', ['$resource', function($resource) {
        return $resource(apiUrl + 'users/:username/friends/');
    }])
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';
    }]);

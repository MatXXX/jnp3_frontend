angular.module('JNPAPP', ['ngCookies', 'ui.router', 'JNPAPP.api', 'angular-websocket'])
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', function($httpProvider, $stateProvider, $urlRouterProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.interceptors.push('authInterceptor');

        $stateProvider
            .state('wall', {
                url: '/',
                templateUrl: 'pages/wall.html',
                controller: 'WallPostsController'
            })
            .state('userDetails', {
                url: '/user/:username',
                templateUrl: 'pages/userDetail.html',
                controller: 'UserDetailController'
            })
            .state('userDetails.posts', {
                url: '/posts',
                views: {
                    'content': {
                        templateUrl: 'pages/postList.html',
                        controller: 'UserPostsController',
                    }
                }
            })
            .state('userDetails.friends', {
                url: '/friends',
                views: {
                    'content': {
                        templateUrl: 'pages/friendList.html',
                        controller: 'UserFriendsController'
                    }
                }
            })
            .state('searchResult', {
                url: '/search/:query',
                templateUrl: 'pages/searchResult.html',
                controller: 'SearchResultController'
            })
       $urlRouterProvider.otherwise('/');
    }])
    .run(function($http, $cookies) {
        var auth = $cookies.get('Authorization');
        if (auth == null) {
            window.location = "/login.html";
        }
        $http.defaults.headers.common['Authorization'] = auth;
    })
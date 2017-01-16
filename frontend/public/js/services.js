angular.module('JNPAPP')
    .service('authInterceptor', function($q) {
        this.responseError = function(response) {
            if(response.status == 401) {
                window.location = "/login.html";
            }
            return $q.reject(response);
        }
    })
    .service('UserService', ['User', 'UserPosts', 'UserFriends', function(User, UserPost, UserFriends) {
        this.getUser = function(username) {
            return User.get({'username': username});
        };

        this.getPosts = function(username) {
            return UserPost.query({'username': username});
        };

        this.getFriends = function(username) {
            this.friends = UserFriends.query({'username': username});
            return this.friends;
        };
    }])
    .service('CurrentUserService', ['$cookies', 'User', 'UserPosts', 'UserFriends', 'Post', function($cookies, User, UserPost, UserFriends, Post) {
        var user = User.get({'username': 'current'});
        this.getUser = function() {
            return user;
        };

        this.getPosts = function() {
            return UserPost.query({'username': 'current'});
        };

        this.getFriends = function() {
            return UserFriends.query({'username': 'current'});
        };

        this.addFriend = function(newFriend, onSuccess, onError) {
            newFriend.$save({'username': 'current'}).then(function(result) {
                onSuccess(result);
            }).then(function () {
            }, function (rejection) {
                onError(rejection);
            });
        };

        this.logout = function() {
            $cookies.remove('Authorization');
            window.location = '/login.html';
        };
    }])
    .service('WallService', ['$http', 'Post', function($http, Post) {
        this.getPosts = function(pageNumber, onSuccess, onError) {
            if(pageNumber == 0)
                return;
            $http({
                method: 'GET',
                url: apiUrl + 'wallPosts/',
                params: {
                    page: pageNumber
                },
            }).then(function(response) {
                onSuccess(response.data.results);
            }).then( function(){}, function(rejection) {
                onError(rejection);
            })
        };

        this.addPost = function (post, onSuccess, onError) {
            post.$save().then(function(result) {
                onSuccess(result);
            })
            .then(function() {},
                function(rejection) {
                    onError(rejection);
                }
            )
        };

        return this;
    }])
    .service('ElasticSearchService', ['$http', 'Post', function($http, Post) {
        var randStr = function(n) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < n; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        };
        
        this.search = function(query, onSuccess, onFailure) {
            p1 = new Post();
            p1.author = { username: "MOCK" };
            p1.body = randStr(20);
            p2 = new Post();
            p2.author = { username: "MOCK2" };
            p2.body = randStr(20);
            onSuccess([p1, p2]);
        }
    }]);
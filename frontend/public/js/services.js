angular.module('JNPAPP')
    .service('authInterceptor', function($q) {
        this.responseError = function(response) {
            if(response.status == 401) {
                window.location = "/login.html";
            }
            else if(response.status == 500) {
                alert("SERVER ERROR");
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
        var user = User.get({'username': 'current'})

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
        this.search = function(query, onSuccess, onFailure) {
            $http.post(apiUrl + "posts/search/", {text: query})
                .then(function(result) {
                    onSuccess(result.data);
                }, function(rejection) {
                    alert(rejection.error);
                })
        }
    }])
    .factory('ChatFactory', ['$websocket', '$rootScope', function($websocket, $rootScope) {
        var conn = $websocket(wsUrl);

        var messages = [];

        conn.onMessage(function(message) {
            messages.push(JSON.parse(message.data));
        });

        var send = function(username, token, message) {
            messages.push({ username: 'You', message: message });
            conn.send({ username: username, token: token, message: message });
        };

        return {
            messages: messages,
            send: send
        }
    }])
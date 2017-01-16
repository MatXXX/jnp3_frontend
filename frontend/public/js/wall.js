angular.module('JNPAPP')
    .controller('WallPostsController', ['$scope', 'UserPosts', function($scope, CurrentUserPosts) {
        $scope.posts = CurrentUserPosts.query({'username': 'current'});

        $scope.newPostError = null;
        $scope.newPost = new CurrentUserPosts();
        $scope.Post = function () {
            $scope.newPost.$save().then(function(result) {
                $scope.newPost = new CurrentUserPosts();
                $scope.posts.push(result);
            })
            .then(function() {
                    $scope.newPostError = null;
                },
                function(rejection) {
                    $scope.newPostError = rejection.data;
                }
            )
        };
    }])

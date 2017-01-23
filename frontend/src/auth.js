angular.module('JNPAPP.auth', ['ngCookies', 'JNPAPP.api']).
    config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    }])
    .run(function() {
        hello.init({google: '624176282643-4o1ofqvtca1glkb44jthrriqhc46o92u.apps.googleusercontent.com'});
    })
    .controller('RegisterController', ['$scope', 'User', function($scope, User) {
        $scope.newUser = new User();
        $scope.registerMessage = null;

        var rejectionFunc = function(rejection) {
            $scope.registerErrors = rejection.data;
        }

        var resultFunc = function(result) {
            $scope.newUser = new User();
            $scope.registerErrors = null;
            $scope.registerMessage = "Account created, login plz";
        }

        $scope.Register = function() {
            $scope.newUser.$save()
                .then(
                    resultFunc,
                    rejectionFunc
                );
        }

        var rejectionGoogleFunc = function(rejection) {
            if (rejection.error != null)
                $scope.registerErrors = { Google: [ rejection.error.message == null ? rejection.error.code : rejection.error.message] }
            else
                $scope.registerErrors = rejection.data
            $scope.$apply();
        }

        var googleRegisterFunc = function (username, email, client_id) {
            var user = new User();
            user.username = username.replace(/ /g, '_');
            user.password = client_id;
            user.email = email;
            user.$save()
                .then(
                    resultFunc,
                    rejectionGoogleFunc
                );
        }

        $scope.RegisterGoogle = function() {
            hello('google').login(
                {
                    scope: 'email',
                    force: true
                })
                .then(
                    function(result) {
                        hello(result.network).api('/me')
                        .then(
                            function(result) {
                                googleRegisterFunc(result.name, result.email, result.id);
                            }, 
                            rejectionGoogleFunc
                        );
                    }, 
                    rejectionGoogleFunc
                );
            };
    }])
    .controller('LoginController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
        $scope.user = new Object();
        $scope.user.username = null;
        $scope.user.password = null;
        $scope.loginError = null;

        var loginSuccessful = function(data) {
            $scope.userToken = data.data.token;
            $scope.loginError = null;
            $cookies.put('Authorization', "Token " + $scope.userToken, { 'path': '/' });
            window.location.replace("/");
        }

        $scope.Login = function() {
            var credentials = { username: $scope.user.username, password: $scope.user.password };
            $http.post(apiUrl + 'token/auth/', credentials)
                .then(loginSuccessful)
                .then(
                    function() {
                        $scope.loginError = null;
                    }, 
                    function(data) {
                        $scope.loginError = data.data;
                    }
                );
        };
        
        var rejectionFunc = function(rejection) {
            $scope.registerErrors = { Google: [ rejection.error.message == null ? rejection.error.code : rejection.error.message ] }
            $scope.$apply();
        }

        var googleLoginFunc = function(username, client_id) {
            var credentials = { username: username.replace(/ /g, '_'), password: client_id };
            $http.post(apiUrl + 'token/auth/', credentials)
                .then(
                    loginSuccessful, 
                    rejectionFunc
                )
                .then(
                    function() {
                        $scope.loginError = null;
                    },
                    rejectionFunc
                );

        }

        $scope.LoginGoogle = function() {
            hello('google').login({
                    scope: 'email',
                    force: true
                })
                .then(
                    function(result) {
                        hello(result.network).api('/me')
                        .then(
                            function(result) {
                                googleLoginFunc(result.name, result.id);
                            }, 
                            rejectionFunc);
                    }, 
                    rejectionFunc
                );
        }
    }])

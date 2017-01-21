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
            $scope.registerErrors = { Google: [ rejection.error.message == null ? rejection.error.code : rejection.error.message] }
            $scope.$apply();
        }

        var googleRegisterFunc = function (username, email) {
            $http.post(apiUrl + 'users/create/google/', { email: email, username: username }).then(
                resultFunc,
                rejectionGoogleFunc);
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
                                googleRegisterFunc(result.name, result.email);
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
            var credentials = {username: $scope.user.username, password: $scope.user.password};
            $http.post(apiUrl + 'token/auth/', credentials)
                .then(
                    loginSuccessful)
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
            $scope.registerErrors = { Google: [ rejection.error.message == null ? rejection.error.code : rejection.error.message] }
            $scope.$apply();
        }

        var googleLoginFunc = function(email) {
            $http.post(apiUrl + 'token/auth/google/', { email: email })
                .then(
                    loginSuccessful, 
                    rejectionFunc
                )
                .then(
                    function(){
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
                                googleLoginFunc(result.email);
                            }, 
                            rejectionFunc);
                    }, 
                    rejectionFunc
                );
        }
    }])

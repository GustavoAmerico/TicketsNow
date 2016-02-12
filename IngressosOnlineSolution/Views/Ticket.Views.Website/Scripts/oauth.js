var OAuth;
(function (OAuth) {
    "use strict";
    var Address = (function () {
        function Address() {
            this.city = "";
            this.state = "";
            this.street = "";
            this.zipCode = "";
        }
        return Address;
    })();
    var Login = (function () {
        function Login() {
            this.password = "";
            this.email = "";
            this.remeberMe = false;
        }
        Login.prototype.singIn = function () {
            var form = document.forms["login"];
            if (!form.checkValidity())
                return;
            var loginData = {
                username: this.email,
                password: this.password,
                grant_type: "password"
            };
            Ajax.form("/Token", loginData, this.authenticate, this.authenticateFail);
        };
        Login.prototype.authenticateFail = function (response) {
            switch (response.status) {
                case 400:
                    {
                        if (response.responseJSON && response.responseJSON.error_description)
                            return alert(response.responseJSON.error + ":" + response.responseJSON.error_description);
                        return alert("Bad Request, your sender dada not valid");
                    }
                case 404:
                    return alert("Não foi possivel se conectar ao servidor de autenticação");
                    break;
                case 500:
                    return alert(response.messageText);
                    break;
                default:
                    if (response.message)
                        alert(response.message);
                    break;
            }
        };
        Login.prototype.authenticate = function (model) {
            if (!model)
                return;
            window.localStorage.clear();
            window.sessionStorage.clear();
            var storage = this.remeberMe
                ? window.localStorage
                : window.sessionStorage;
            var json = JSON.stringify(model);
            storage[Login.storageKey] = json;
            User.fromJson(json, User.instancia);
            window.location.assign("/");
        };
        Login.loadLocalAuthenticate = function () {
            var user = window.localStorage[Login.storageKey];
            if (user == null)
                user = window.sessionStorage[Login.storageKey];
            if (user != null)
                User.fromJson(user, User.instancia);
        };
        Login.singOut = function () {
            window.localStorage.clear();
            window.sessionStorage.clear();
        };
        Login.configurarAngular = function (modulo) {
            var controllerName = "LoginCtrl";
            modulo.controller(controllerName, [
                "$scope", function ($scope) {
                    $scope.rsx = win.rsx;
                    $scope.model = new Login();
                    document.title = win.rsx.pageTitles.login;
                }
            ]);
            modulo.config(function ($routeProvider) {
                $routeProvider
                    .when("/login", {
                    templateUrl: "Login.html",
                    controller: controllerName,
                    caseInsensitiveMatch: true
                });
            });
            modulo.config(function ($routeProvider) {
                $routeProvider
                    .when("/", {
                    templateUrl: "Login.html",
                    controller: controllerName,
                    caseInsensitiveMatch: true
                });
            });
        };
        Login.storageKey = "oauth_user";
        return Login;
    })();
    var Register = (function () {
        function Register() {
            this.name = "";
            this.email = "";
            this.gender = 0;
            this.cpf = "";
            this.password = "";
            this.confirmPassword = "";
            this.address = new Address();
        }
        Register.prototype.register = function () {
            var form = document.forms["registerForm"];
            if (!form || !form.checkValidity()) {
                console.log("Form not valid");
                return alert("Check the red form fields");
            }
            var model = this;
            var dataJson = JSON.stringify(model);
            var success = function () {
                alert("you have been successfully registered");
                win.location.assign("/oauth");
            };
            var error = function (request) {
                if (!request)
                    return;
                switch (request.status) {
                    case 500:
                        {
                            var error_1 = request.responseJSON;
                            if (error_1 == null || !error_1.message)
                                return alert("Internal error");
                            else
                                return alert("Internal error: " + error_1.message);
                        }
                    default:
                        var erros = request.responseJSON ? request.responseJSON.modelState : [""];
                        if (!erros || !erros[""] || erros[""].length === 0)
                            return;
                        var msg = "";
                        for (var i = 0; i < erros[""].length; i++) {
                            msg += erros[""][i];
                        }
                        win.alert(msg);
                        break;
                }
            };
            Ajax.post("/account/register", dataJson, success, error);
        };
        Register.configurarAngular = function (modulo) {
            var controllerName = "RegisterCtrl";
            modulo.controller(controllerName, [
                "$scope", function ($scope) {
                    $scope.rsx = win.rsx;
                    $scope.model = new Register();
                    document.title = win.rsx.pageTitles.register;
                }
            ]);
            modulo.config(function ($routeProvider) {
                $routeProvider
                    .when("/register", {
                    templateUrl: "register.html",
                    controller: controllerName,
                    caseInsensitiveMatch: true
                });
            });
        };
        return Register;
    })();
    var AppStart = (function () {
        function AppStart() {
        }
        AppStart.prototype.run = function () {
            var modulo = win.angular.module("oauth", ["ngRoute"]);
            Register.configurarAngular(modulo);
            Login.configurarAngular(modulo);
            modulo.config(function ($routeProvider) {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            Login.loadLocalAuthenticate();
        };
        AppStart.prototype.configTaskService = function (modulo) {
            modulo.factory("taskService", function ($q) {
                return {
                    run: function (e, task) {
                        var deferred = $q.defer();
                        task(function () { return deferred.resolve(e); });
                        return deferred.promise;
                    }
                };
            });
        };
        return AppStart;
    })();
    OAuth.AppStart = AppStart;
})(OAuth || (OAuth = {}));
var app = new OAuth.AppStart();
app.run();

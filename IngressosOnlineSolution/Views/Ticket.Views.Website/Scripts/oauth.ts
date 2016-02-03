module OAuth {
    "use strict";
  
    /**abstraction of the characteristics of an address*/
    class Address {
        /**Get and sends name of city from address*/
        city: string = "";

        /**Get and sends initials of state or province*/
        state: string = "";

        /**Get and sends of street*/
        street: string = "";

        /**Get and sends of zip code*/
        zipCode: string = "";
    }

    class Login {
        password = "";

        email = "";

        remeberMe = false;

        private static storageKey = "oauth_user";

        singIn() {
            const form: HTMLFormElement = document.forms["login"];
            if (!form.checkValidity()) return;

            const loginData = {
                username: this.email,
                password: this.password,
                grant_type: "password"
            };

            Ajax.form("/Token", loginData, this.authenticate, this.authenticateFail);
        }

        authenticateFail(response) {
            switch (response.status) {
                case 400:
                    {
                        if (response.responseJSON && response.responseJSON.error_description)
                            return alert(response.responseJSON.error + ":" + response.responseJSON.error_description);
                        return alert("Bad Request, your sender dada not valid");
                    }

                case 404:
                    return alert("Não foi possivel se conectar ao servidor de autenticação"); break;
                case 500:
                    return alert(response.messageText);

                    break;
                default:
                    if (response.message)
                        alert(response.message); break;
            }
        }

        authenticate(model: Object): void {
            if (!model) return;
            window.localStorage.clear();
            window.sessionStorage.clear();

            const storage = this.remeberMe
                ? window.localStorage
                : window.sessionStorage;

            let json = JSON.stringify(model);

            storage[Login.storageKey] = json;
            User.fromJson(json, User.instancia);
            window.location.assign("/");
        }

        static loadLocalAuthenticate() {
            let user = window.localStorage[Login.storageKey];
            if (user == null)
                user = window.sessionStorage[Login.storageKey];
            if (user != null)
                User.fromJson(user, User.instancia);

        }

        static singOut() {
            window.localStorage.clear();
            window.sessionStorage.clear();
        }

        /**Configurar essa classe como controle do Angular*/
        static configurarAngular(modulo: any): void {
            var controllerName = "LoginCtrl";
            modulo.controller(controllerName, [
                "$scope", $scope => {
                    $scope.rsx = win.rsx;
                    $scope.model = new Login();
                    document.title = win.rsx.pageTitles.login;
                }
            ]);

            modulo.config($routeProvider => {
                $routeProvider
                    .when("/login",
                    {
                        templateUrl: "Login.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
            });
            modulo.config($routeProvider => {
                $routeProvider
                    .when("/",
                    {
                        templateUrl: "Login.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
            });
        }
    }

    class Register {
        /**Get and send name of user*/
        name: string = "";

        /**Get and send email of user*/
        email: string = "";

        /**Get and send birth date of user*/
        birthDate: Date;

        /**Get and send gender of user*/
        gender: number = 0;

        /**Get and send cpf of user*/
        cpf: string = "";

        /**Get and send password of user*/
        password: string = "";

        /**Get and send password of user*/
        confirmPassword: string = "";

        /**Get and send address of user*/
        address: Address = new Address();

        /**Create a user to the system*/
        register(): void {
            var form = document.forms["registerForm"] as HTMLFormElement;
            if (!form || !form.checkValidity()) {
                console.log("Form not valid");
                return alert("Check the red form fields");
            }
            const model = this;
            const dataJson = JSON.stringify(model);

            const success = () => {
                alert("you have been successfully registered");
                win.location.assign("/oauth");
            };
            const error = (request) => {
                if (!request) return;
                switch (request.status) {
                    case 500:
                        {
                            const error: any = request.responseJSON;

                            if (error == null || !error.message)
                                return alert("Internal error");
                            else
                                return alert(`Internal error: ${error.message}`);
                        }
                    default:
                        const erros = request.responseJSON ? request.responseJSON.modelState : [""];

                        if (!erros || !erros[""] || erros[""].length === 0) return;

                        let msg = "";
                        for (let i = 0; i < erros[""].length; i++) {
                            msg += erros[""][i];
                        } win.alert(msg); break;
                }
            };

            Ajax.post("/account/register", dataJson, success, error);
        }

        /**Configurar essa classe como controle do Angular*/
        static configurarAngular(modulo: any): void {
            var controllerName = "RegisterCtrl";
            modulo.controller(controllerName, [
                "$scope", $scope => {
                    $scope.rsx = win.rsx;
                    $scope.model = new Register();
                    document.title = win.rsx.pageTitles.register;
                }
            ]);

            modulo.config($routeProvider => {
                $routeProvider
                    .when("/register",
                    {
                        templateUrl: "register.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
            });
        }
    }

    
    export class AppStart {
        run(): void {
            const modulo = win.angular.module("oauth", ["ngRoute"]);
            Register.configurarAngular(modulo);
            Login.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            Login.loadLocalAuthenticate();
        }

        private configTaskService(modulo) {

            modulo.factory("taskService", ($q) => {

                return {
                    run: (e: any, task: (completed: () => void) => void) => {
                        var deferred = $q.defer();
                        task(() => deferred.resolve(e));
                        return deferred.promise;
                    }
                };


            });

        }
    }
}

var app = new OAuth.AppStart();
app.run();
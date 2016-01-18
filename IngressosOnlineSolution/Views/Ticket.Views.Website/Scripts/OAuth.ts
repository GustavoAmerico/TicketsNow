/**Instancia do DOMWindow*/
var win: any = (() => window)();

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

/// <reference path="Scripts/i18n/dicionario.js" />
/// <reference path="Scripts/ticket.js" />
module OAuth {
    export class User {
        private static _intancia = new User();

        /** Nome do usuário que esta logado*/
        get nomeUsuario(): string { return this.nome }

        /**Imagem do usuário*/
        avatar = "http://icons.iconarchive.com/icons/icons-land/flat-emoticons/256/Ninja-icon.png";

        private static storageKey = "oauth_user";

        private _email = "";
        private _senha = "";

        nome: string = "Gustavo Américo";
        id: string = "";

        get senha() { return this._senha.trim() }

        set senha(valor: string) {
            if (valor == null) valor = "";
            this._senha = valor;
        }

        get email() { return this._email.trim() }

        set email(valor: string) {
            if (valor == null) valor = "";
            this._email = valor;
        }

        constructor() {
            const userJson = win.localStorage.getItem(User.storageKey);
            User.fromJson(userJson, this);
        }

        static fromJson(json: string, user?: User): User {
            if (!user) user = new User();
            if (!json) return user;

            var data = JSON.parse(json);
            for (var attr in data)
                if (User.hasOwnProperty(attr))
                    user[attr] = data[attr];
            return user;
        }

        static get instancia(): User {
            return User._intancia;
        }

        autenticar(model: Object): void {
            //TODO: Implementar o login
            window.localStorage["user"] = { nome: this.nome, image: this.avatar, id: "" }
            if (!model) return;
            for (var item in model) {
                if (this.hasOwnProperty(item))
                    this[item] = model[item];
            }
            window.localStorage["user"] = model;

        }

        estaLogado(): boolean {
            return this.id !== "" && window.localStorage["user"];
        }

        parse() {
            return {
                email: this.email,
                nome: this.nomeUsuario,
                avatar: this.avatar,
                key: this.id
            }
        }
    }

    class Login {

        password: string = "";

        email: string = "";

        remeberMe: boolean = false;

        singIn() {
            var form: HTMLFormElement = document.forms["login"];
            if (!form.checkValidity()) return;
            var route = win.rsx.hostname + "/account/singin";
            var model = this;

            const dataJson = JSON.stringify(model);
            //TODO: Implementar login
            const x = (e) => {
                try {
                    User.instancia.autenticar(model);
                    win.location.assign("/#/cart");

                    return;

                    if (e.status == 200) {
                        User.instancia.autenticar(model);
                        win.location.assign("/#/cart");
                    }
                    else
                        alert(e.responseText);
                } catch (ex) {
                    win.location.assign("/#/cart");
                }
            };

            Ajax.post(route, dataJson, x, x);



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
            var rota = win.rsx.hostname + "account/register";
            var model = this;
            var dataJson = JSON.stringify(model);
            var settings = {
                "async": true,
                "crossDomain": true,
                "processData": false,
                "url": rota,
                "data": dataJson,
                "method": "POST",
                "dataType": "json",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache"
                }
            }
            win.$.ajax(settings)
                .done(this.registered)
                .fail(this.registered);
        }

        private registered(request) {
            if (request.status === 200) {
                win.location.assign("/oauth");
            }
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

    class Start {
        run() {
            this.startAngularJs();
        }

        private startAngularJs() {
            const modulo = win.angular.module("oauth", ["ngRoute"]);
            Register.configurarAngular(modulo);
            Login.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
        }
    }

    var start = new Start();
    start.run();
}

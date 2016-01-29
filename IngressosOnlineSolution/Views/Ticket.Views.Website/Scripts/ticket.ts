
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
module Ticket {

    class Ajax {


        private static getSettings(method: string, route: string, dataJson?: string) {
            var user = OAuth.User.instancia;
            var headers = {
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                    "Authorization": user.token_type + " " + user.access_token
                }
            };
            var settings = {
                "async": true,
                "crossDomain": true,
                "processData": false,
                "url": route,
                "method": method,
                "dataType": "json",
                "headers": headers,
                "data": dataJson
            };
            return settings;
        }

        private static createType<T>(typeConstructor: () => T, item: any): T {

            var t = typeConstructor();
            for (var attr in item) {
                if (t.hasOwnProperty(attr))
                    t[attr] = item[attr];
            }
            return t;
        }

        private static createTypeArray<T>(typeConstructor: () => T, result: any[]): T[] {
            var itens: T[] = [];
            for (var i = 0; i < result.length; i++)
                itens.push(Ajax.createType<T>(typeConstructor, result[i]));

            return itens;
        }


        static get<T>(route: any, success: (result: T[]) => void, error: (ex: string) => void,
            typeConstructor?: () => T) {

            try {
                win.$.ajax(Ajax.getSettings("GET", win.rsx.hostname + route))
                    .done((result, status) => {
                        if (status === "success") {
                            if (typeConstructor == null) {
                                success(result);
                            }
                            else {
                                success(Ajax.createTypeArray<T>(typeConstructor, result));
                            }
                        }
                    }).fail(e => {
                        if (e.resultJson)
                            error(e.resultJson);
                        else if (e.resultText)
                            error(e.resultText);
                        else
                            error(e);
                    });

            } catch (e) {
                console.error(e);
            }
        }

        static post(route: string, dataJson: any, success?: (result) => void, error?: (result) => void, headers?: Object) {
            win.$.ajax(Ajax.getSettings("POST", win.rsx.hostname + route), dataJson)
                .done(success)
                .fail(error);
        }


        static form(route: string, dataJson: any, success?: (result) => void, error?: (result) => void, header?: Object) {
            route = win.rsx.hostname + route;

            if (header == null)
                header = {
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache"
                };

            const settings = {
                "async": true,
                "crossDomain": true,
                "url": route,
                "data": dataJson,
                "method": "POST",
                "headers": header
            }
            win.$.ajax(settings)
                .done(success)
                .fail(error);
        }
    }

    export class AppStart {
        run(): void {
            this.iniciarAngularJs();
            this.initStoreIndexedDb();

        }


        runOAuthApp() {
            const modulo = win.angular.module("oauth", ["ngRoute"]);
            OAuth.Register.configurarAngular(modulo);
            OAuth.Login.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            OAuth.Login.loadLocalAuthenticate();
        }

        private iniciarAngularJs() {
            const modulo = win.angular.module("app", ["ngRoute"]);

            Controls.Dashboard.configurarAngular(modulo);
            Controls.Cart.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            Controls.MyRequest.configurarAngular(modulo);
            Directive.MyHeader.configurarAngular(modulo);
            Directive.myMenu.configurarAngular(modulo);
            Directive.Feast.configurarAngular(modulo);
            OAuth.User.configAngularJs(modulo);
            this.configurarCredCartDirective(modulo);
        }

        private ConfigTaskService(modulo) {

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

        private configurarCredCartDirective(modulo) {

            modulo.directive("credit", () => ({
                restrict: "E",
                templateUrl: "controles/CreditCart.html",
                scope: { model: "=", rsx: "=" },
                //    link: start
            }));
        }

        private initStoreIndexedDb() {
            const start = Controls.Cart.instancia;
        }
    }

    module Controls {

        export class MyRequest {

            /**Add this class how controlller in AngularJs*/
            static configurarAngular(modulo: any): void {
                var controllerName = "MyRequestCtrl";
                modulo.controller(controllerName, [
                    "$scope", "oAuth", ($scope, oAuth) => {
                        $scope.oauth = oAuth.oauth();
                        if (!$scope.oauth.IsAutentication)
                            win.location.assing("/");

                        document.title = win.rsx.pageTitles.myRequest;
                        MyRequest.getAll(result=> $scope.requests = result, e=> {
                            console.log(e);
                            alert(e);
                        });
                    }
                ]);
                modulo.config($routeProvider => {
                    $routeProvider
                        .when("/myrequest",
                        {
                            templateUrl: "myrequest.html",
                            controller: controllerName,
                            caseInsensitiveMatch: true
                        });
                });
            }

            static getAll(onsucess: (result: any[]) => void, onerror: (erro: any) => void) {

                Ajax.get<MyRequest>("/request", onsucess, onerror, () => new MyRequest());
            }

        }

        /**Abstraction from the home*/
        export class Dashboard {

            /**Featured events */
            private _feasts: Directive.Feast[] = [];

            /**Featured events 
             * @returns {'Featured events to diplay in screen'} 
             */
            get feasts(): Directive.Feast[] {
                return (this._feasts) ? this._feasts : [];
            }


            /**Add this class how controlller in AngularJs*/
            static configurarAngular(modulo: any): void {
                var controllerName = "DashboardCtrl";



                modulo.factory("loadFeast", ($q) => {
                    var load = () => {
                        var deferred = $q.defer();

                        Ajax.get<Directive.Feast>("/event", e => {
                            deferred.resolve(e);
                        }, win.alert, () => new Directive.Feast());
                        return deferred.promise;
                    };

                    return {
                        run: load
                    };


                });


                modulo.controller("DashboardCtrl", [
                    "$scope", "loadFeast", ($scope, loadFeast) => {

                        var dash = new Dashboard();
                        loadFeast.run()
                            .then((result) => {
                                dash._feasts = result;
                            });

                        $scope.x = dash;
                        $scope.rsx = win.rsx;
                        $scope.oauth = OAuth.User.instancia;
                        document.title = win.rsx.pageTitles.home;

                    }
                ]);

                modulo.config($routeProvider => {
                    $routeProvider
                        .when("/",
                        {
                            templateUrl: "dashboard.html",
                            controller: controllerName,
                            caseInsensitiveMatch: true
                        });
                    $routeProvider
                        .when("",
                        {
                            templateUrl: "dashboard.html",
                            controller: controllerName,
                            caseInsensitiveMatch: true
                        });
                });
            }
        }
    
        /**Abstraction from the Cart page*/
        export class Cart {


            private static dbName = "ShoppingCart";

            /**Model for Credit card*/
            creditCard = new Directive.CreditCard();

            /**Provider DataBase JS */
            private db: IDBDatabase;      

            /**Singleton instance*/
            private static _instancia: Cart;

            /**It indicates whether x is initialized*/
            private isStarted = false;

            private static objectStoreName = "requests";

            /**Singleton item*/
            static get instancia() {
                if (Cart._instancia == null)
                    Cart._instancia = new Cart();
                return Cart._instancia;
            }

            /**Gets an store to executes operation en JS databas */
            get requestStore(): IDBObjectStore {
                const transiction = this.db.transaction([Cart.objectStoreName], "readwrite");
                const objectStore = transiction.objectStore(Cart.objectStoreName);
                return objectStore;
            }

            totalPrice: number;

            constructor() {
                this.openIndexeddb();
            }

            /**responsible for add, change and remove cart items, is triggered by button add to buy
             * @param item  item scheduled  modification
             * @param key key of item
             * @param exp control for attemps async
             */
            addOrUpdate(item: any, key: any, exp = 0): void {
                if (item == null || key == null)
                    return;

                if (!this.isStarted) {
                    //Se o a conexão com a api do navegador não estiver sido estabelecida é tentado novamente em alguns segundos
                    win.setTimeout(this.addOrUpdate(item, key, (3 + exp)), ((20 + exp) * 1000));
                    return;
                }
                var x = this;
                const func = (i) => {
                    var store = x.requestStore;
                    if (i == null)
                        store.add(item);
                    else
                        store.put(item);
                };
                this.get(key, func);
            }

            /** Search for item in JS database
             * @param key 
             * @param func function executable before load
             */
            get(key: any, func: (e) => void): void {
                const request = this.requestStore.get(key);
                request.onsuccess = e => {
                    var cursor = (e.target as IDBRequest).result;
                    func(cursor);
                };
            }

            /**It is to treat the recovered items JS database
            * @param itens 
             * @returns {} 
             */
            onLoadAllRequest: (itens: Directive.Feast[]) => void;

            /**Removes the item associated with the id of the cart
             * @param key ideitification from item in cart
             * @param onSuccess function that will be performed after removal 
            */
            delete(key: any, onSuccess: (e: Event) => void) {
                const store = this.requestStore;
                const request = store.delete(key);
                request.onsuccess = onSuccess;
            }


            /*** get all itens from current user
               * @returns {all tickets select to buy per user}
               */
            loadAllRequest() {
                const store = this.requestStore;
                const request = store.openCursor();
                var list = [];
                var its = this;
                var allPrice = 0;
                request.onerror = (e) => console.log(e);
                request.onsuccess = (event) => {
                    var cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
                    if (cursor) {
                        if (cursor.value && cursor.value.qtd > 0) {
                            list.push(cursor.value);
                            allPrice += (cursor.value.price * cursor.value.qtd);
                        }
                        cursor.continue();
                    } else {
                        try {
                            if (its.onLoadAllRequest)
                                its.onLoadAllRequest(list);
                            its.totalPrice = allPrice;
                        } catch (e) {
                            console.error("your function triggered an error {0}", e);
                        }
                    }
                };

            }

        
            /**updates the cart with the selected items, it runs after removing an item to access the screen */
            refresh(): void {
                var m = this;
                this.onLoadAllRequest = (list) => {
                    win.$("#shoppingCart tr").remove();
                    list.forEach(x => Cart.addItensInTable(x, m));
                };
                this.loadAllRequest();

            }

            /**
             * Add the @item in htmltableElement reference cart
             * @param item to be added in HtmlTableElemente
             * @param cart cart from item 
             * @returns {} 
             */
            static addItensInTable(item: Directive.Feast, cart: Cart) {
                const tableBody = win.$("#shoppingCart")[0];
                if (tableBody == null || item == null) return;
                const cellImg = document.createElement("td") as HTMLTableCellElement;
                const img = document.createElement("img") as HTMLImageElement;
                img.alt = item.title;
                img.src = item.image;
                img.style.maxWidth = "150px";
                img.style.maxHeight = "90px";
                cellImg.appendChild(img);

                const celltitle = document.createElement("td") as HTMLTableCellElement;
                celltitle.innerText = item.title;
                const cellqtd = document.createElement("td") as HTMLTableCellElement;
                cellqtd.innerText = item.qtd.toString();
                const celldescription = document.createElement("td") as HTMLTableCellElement;
                celldescription.innerText = item.decription;

                const cellprice = document.createElement("td") as HTMLTableCellElement;
                cellprice.innerText = item.price.toFixed(2);

                const cellaction = document.createElement("td") as HTMLTableCellElement;
                const btnRemove = document.createElement("input") as HTMLButtonElement;
                btnRemove.type = "button";
                btnRemove.value = "remove";
                btnRemove["eventId"] = item.id;

                btnRemove.onclick = (e) => {
                    var input = e.target as Element;
                    var id = input["eventId"];
                    if (id && cart.delete) {
                        cart.delete(id, e => input.parentElement.parentElement.parentElement
                            .removeChild(input.parentElement.parentElement));
                    }
                };
                btnRemove.classList.add("btn", "btn-danger");
                cellaction.appendChild(btnRemove);
                const row = document.createElement("tr") as HTMLTableRowElement;
                row.appendChild(cellImg);
                row.appendChild(celltitle);
                row.appendChild(celldescription);
                row.appendChild(cellqtd);
                row.appendChild(cellprice);
                row.appendChild(cellaction);
                tableBody.appendChild(row);
            }


            /**Add this class how controlller in AngularJs*/
            static configurarAngular(modulo: any): void {
                var controllerName = "CartCtrl";
                modulo.controller("CartCtrl", [
                    "$scope", "oAuth", ($scope, oAuth) => {
                        $scope.rsx = win.rsx;
                        document.title = win.rsx.pageTitles.cart;
                        $scope.model = Cart.instancia;
                        $scope.exibirPagamento = oAuth.oauth().IsAutentication;
                        try {
                            $scope.model.onLoadAllRequest = (list) => {
                                win.$("#shoppingCart tr").remove();
                                list.forEach(x => Cart.addItensInTable(x, $scope.model));
                            };
                            $scope.model.loadAllRequest();

                        } catch (e) {

                        }

                    }
                ]);
                modulo.config($routeProvider => {
                    $routeProvider
                        .when("/cart",
                        {
                            templateUrl: "cart.html",
                            controller: controllerName,
                            caseInsensitiveMatch: true
                        });
                });
            }

            /**responsible for opening the connection to the IndexedDB*/
            private openIndexeddb(): void {
                var este = this;
                try {

                    var dbRequest = window.indexedDB.open(Cart.dbName, 1);
                    if (dbRequest != null) {
                        dbRequest.onsuccess = (evento) => {
                            este.db = dbRequest.result;
                            este.db.onerror = event => {
                                // Função genérica para tratar os erros de todos os requests desse banco!
                                alert(`Database error: ${(event.target as any).errorCode}`);
                            };
                            este.isStarted = true;
                        };
                        dbRequest.onupgradeneeded = event => {
                            var db = (event.target as any).result;

                            var objectStore = db.createObjectStore(Cart.objectStoreName, { keyPath: "id" });

                            objectStore.createIndex("title", "title", { unique: false });
                            objectStore.createIndex("price", "price", { unique: false });
                            objectStore.createIndex("qtd", "qtd", { unique: false });
                            objectStore.createIndex("userId", "userId", { unique: false });
                        };
                    }

                } catch (e) {
                    alert("your browser not suported indexedDb, try again with google chrome");
                }
            }


        }

    }

    module Directive {

        /**Abstraction from the controller to credit card*/
        export class CreditCard {

            cartCvv: number;
            validYear: number;
            validMonth: number;
            cartNumber: string;
            saveCard: boolean;
            name: string;

            /**generates valid number for validity numbers
            * @returns {valid number  for year validate of card} 
             */
            get validYears(): number[] {
                const currentYear = new Date().getFullYear();
                const years = [];

                for (let i = currentYear; i < (currentYear + 10); i++) {
                    years.push(i);
                }
                return years;
            }

            /**Runs payment of items in cart*/
            pay() {
                const form = document.querySelector("#crediCartForm") as HTMLFormElement;
                if (!form || !form.checkValidity()) {
                    return alert("Form not valid");
                }
                //TODO: validar preço do pedido com preço atual

                var now = new Date();
                if (this.validYear < now.getFullYear() || (this.validYear === now.getFullYear() && now.getMonth() + 1 <= this.validMonth))
                    return alert("your card is expired");

                var regex = new RegExp("\d+");

                var requestsItens = [];

                var pay = (itens) => {
                    for (let i = 0; i < itens.length; i++) {
                        requestsItens.push({
                            id: itens[i].id,
                            price: itens[i].price,
                            qtd: itens[i].qtd
                        });
                    }
                    var data = JSON.stringify({
                        cardCvv: this.cartCvv,
                        cardNumber: this.cartNumber.replace(regex, ""),
                        validMonth: this.validMonth,
                        validYear: this.validYear,
                        name: this.name,
                        saveCard: this.saveCard,
                        itens: requestsItens
                    });

                    var funcObserver = result => {

                        if (result.responseText)
                            alert(result.responseText);
                        else
                            alert(result);

                    }

                    Ajax.post("/request", data, funcObserver, funcObserver);
                };

                Controls.Cart.instancia.onLoadAllRequest = pay;
                Controls.Cart.instancia.loadAllRequest();


            }
        }

        export class Feast {
            id = "";
            title = "";
            decription = "";
            image = "";
            price = 0;
            private _qtd = 0;

            get qtd(): number {
                return this._qtd;
            }

            set qtd(value: number) {
                if (value && value > 0)
                    this._qtd = value;
                else
                    this._qtd = 0;
            }

            addToBuy() {
                if (this.qtd > 0) {
                    Controls.Cart.instancia.addOrUpdate({
                        id: this.id,
                        title: this.title,
                        decription: this.decription,
                        image: this.image,
                        price: this.price,
                        qtd: this.qtd
                    }, this.id);
                    alert(win.rsx.msgs.ticketReserved.format(this.qtd, this.title));
                } else {
                    Controls.Cart.instancia.delete(this.id, () => console.log);
                }
            }

            /**Configurar as directivas do angular   */
            static configurarAngular(modulo: any): void {
                var start = (scope, elementos, attributes) => {
                };

                modulo.directive("feast", () => ({
                    restrict: "E",

                    templateUrl: "/controles/feast.html",
                    scope: { event: "=", rsx: "=" },
                    link: start
                }));
            }
        }

        export class MyHeader {

            get singText() {
                return OAuth.User.instancia.IsAutentication ? "Sing Out" : "Sing In";
            }

            singOut() {
                OAuth.User.singOut();
                win.location.assign("oauth/");
            }


            /**Configurar as directivas do angular*/
            static configurarAngular(modulo: any): void {

                var start = (scope, elementos, attri) => {
                    win.adminLTE.EnableSidebarToggle();

                    scope.model = new MyHeader();
                };
                modulo.directive("myheader", () => ({
                    restrict: "E",
                    templateUrl: "/controles/header.html",
                    scope: { oauth: "=", rsx: "=", model: "=" },
                    link: start
                }));
            }


        }

        export class myMenu {
            /**Configurar as directivas do angular   */
            static configurarAngular(modulo: any): void {

                var start = (scope, elementos, attributes) => {
                    myMenu.iniciarMenu();
                    scope.oauth = OAuth.User.instancia;
                    scope.rsx = win.rsx;
                };

                modulo.directive("mymenu",
                    () => ({
                        restrict: "E",
                        templateUrl: "/controles/menu.html",
                        scope: { oauth: "=", rsx: "=" },
                        link: start
                    })
                );
            }

            private static iniciarMenu(): void {
                try {
                    win.$(".sidebar").tree();
                    win.adminLTE.Slimscroll();
                } catch (e) {
                    console.log(e);
                }
            }
        }

    }

    module OAuth {
        export class User {
            private static storageKey = "oauth_user";

            private static _intancia = new User();
            ".expires" = new Date(1, 1, 1);

            ".issued" = new Date(1, 1, 1);

            get issued(): Date { return this[".issued"]; }

            get expires(): Date { return this[".expires"]; }


            set issued(value: Date) { this[".issued"] = value; }

            set expires(value: Date) { this[".expires"] = value; }

            token_type = "";
            access_token = "";

            /** Nome do usuário que esta logado*/
            get nomeUsuario(): string { return this.userName }

            /**Imagem do usuário*/
            avatar = "http://icons.iconarchive.com/icons/icons-land/flat-emoticons/256/Ninja-icon.png";


            userName = "anonymous";

            constructor() {
                var json = window.sessionStorage[User.storageKey];
                if (json == null)
                    json = window.localStorage[User.storageKey];

                User.fromJson(json, this);

            }

            static fromJson(json: string, user?: User): User {
                if (!user) user = new User();
                if (!json) return user;
                const data = JSON.parse(json);
                for (let attr in data)
                    if (user.hasOwnProperty(attr))
                        user[attr] = data[attr];
                return user;
            }

            static get instancia(): User {
                return User._intancia;
            }



            get IsAutentication(): boolean {
                if (!this.expires || this.access_token == null)
                    return false;

                const hoje = new Date();
                var expira = new Date(this.expires.valueOf());

                let inPeriod = expira >= hoje;
                return (inPeriod && this.access_token != null);
            }

            static singOut() {
                window.localStorage.clear();
                window.sessionStorage.clear();
            }

            static configAngularJs(modulo) {
                modulo.service("oAuth", ($q) => {
                    return {
                        oauth: () => User.instancia
                    };
                });
            }

        }

        export class Login {

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

                var json = JSON.stringify(model);

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
                //else {
                //    return alert("A problem was found when logging in, please try again");
                //}
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

        export class Register {

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

    }
}

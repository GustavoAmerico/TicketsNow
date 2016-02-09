
/**Instancia do DOMWindow*/
var win: any = (() => window)();


/// <reference path="Scripts/i18n/dicionario.js" />
module Ticket {


    export class AppStart {
        run(): void {
            this.iniciarAngularJs();
            this.initStoreIndexedDb();

        }


        private iniciarAngularJs() {
            var modulo = win.angular.module("app", ["ngRoute"]);

            Controls.Dashboard.configurarAngular(modulo);
            Controls.Cart.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            Controls.MyRequest.configurarAngular(modulo);
            Directive.MyHeader.configurarAngular(modulo);
            Directive.myMenu.configurarAngular(modulo);
            Directive.Feast.configurarAngular(modulo);
            User.configAngularJs(modulo);
            this.configurarCredCartDirective(modulo);
            this.configTaskService(modulo);
        }

        private configTaskService(modulo) {

            modulo.factory("taskService", ($q) => {

                return {
                    run: (task: (onsucess) => void) => {
                        var deferred = $q.defer();
                        task(e => deferred.resolve(e));
                        return deferred.promise;
                    }
                };


            });

        }

        private configurarCredCartDirective(modulo) {

            modulo.directive("credit", () => ({
                restrict: "E",
                templateUrl: "controles/CreditCart.html",
                scope: { model: "=", rsx: "=" }
            }));
        }

        private initStoreIndexedDb() {
            var xcart = Controls.Cart.instancia;
        }
    }

    module Controls {

        export class MyRequest {

            /**Add this class how controlller in AngularJs*/
            static configurarAngular(modulo: any): void {
                var controllerName = "MyRequestCtrl";
                modulo.controller(controllerName, [
                    "$scope", "oAuth", "taskService", "$sce", ($scope, oAuth, taskService, $sce) => {
                        $scope.oauth = oAuth.oauth();
                        if (!$scope.oauth.IsAutentication)
                            win.location.assing("/");

                        document.title = win.rsx.pageTitles.myRequest;

                        taskService.run(MyRequest.getAll)
                            .then((result) => {
                                $scope.requests = result;
                            });;

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

            static getAll(onsucess: (result: any[]) => void) {

                Ajax.get<MyRequest>("/request", onsucess, e=> console.log(e), () => new MyRequest());
            }

            date: any = "";
            description = "";
            number = "";
            total = 0;

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
                        $scope.oauth = User.instancia;
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
                var transiction = this.db.transaction([Cart.objectStoreName], "readwrite");
                var objectStore = transiction.objectStore(Cart.objectStoreName);
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
                var func = (i) => {
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
                var request = this.requestStore.get(key);
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
                var store = this.requestStore;
                var request = store.delete(key);
                if (onSuccess != null) request.onsuccess = onSuccess;
                this.refresh();
            }


            /*** get all itens from current user
               * @returns {all tickets select to buy per user}
               */
            loadAllRequest() {
                var store = this.requestStore;
                var request = store.openCursor();
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
                var tableBody = win.$("#shoppingCart")[0];
                if (tableBody == null || item == null) return;
                var cellImg = document.createElement("td") as HTMLTableCellElement;
                var img = document.createElement("img") as HTMLImageElement;
                img.alt = item.title;
                img.src = item.image;
                img.style.maxWidth = "150px";
                img.style.maxHeight = "90px";
                cellImg.appendChild(img);

                var celltitle = document.createElement("td") as HTMLTableCellElement;
                celltitle.innerText = item.title;
                var cellqtd = document.createElement("td") as HTMLTableCellElement;
                cellqtd.innerText = item.qtd.toString();
                var celldescription = document.createElement("td") as HTMLTableCellElement;
                celldescription.innerText = item.decription;

                var cellprice = document.createElement("td") as HTMLTableCellElement;
                cellprice.innerText = item.price.toFixed(2);

                var cellaction = document.createElement("td") as HTMLTableCellElement;
                var btnRemove = document.createElement("input") as HTMLButtonElement;
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
                var row = document.createElement("tr") as HTMLTableRowElement;
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

            /**Runs payment of items in cart*/
            pay() {

                var requestsItens = [];
                var itensIds = [];
                var pay = (itens) => {
                    for (let i = 0; i < itens.length; i++) {
                        requestsItens.push({
                            id: itens[i].id,
                            price: itens[i].price,
                            qtd: itens[i].qtd
                        });
                        itensIds.push(itens[i]);
                    }
                    if (requestsItens.length <= 0)
                        return alert("No ticket was selected");
                    var data = JSON.stringify({
                        itens: requestsItens
                    });
                    var self = this;
                    var funcSuccess = (result) => {
                        if (result.responseText) alert(result.responseText);
                        for (let i = 0; i < itensIds.length; i++) self.delete(itensIds[i], null);
                    };

                    Ajax.post("/request/BuyOnClick", data, funcSuccess, result=> alert(result));
                };

                Controls.Cart.instancia.onLoadAllRequest = pay;
                Controls.Cart.instancia.loadAllRequest();


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
            creditCardBrand = 0;
            installmentCount = 1;

            /**generates valid number for validity numbers
            * @returns {valid number  for year validate of card} 
             */
            get validYears(): number[] {
                var currentYear = new Date().getFullYear();
                var years = [];

                for (let i = currentYear; i < (currentYear + 10); i++) {
                    years.push(i);
                }
                return years;
            }

            /**Runs payment of items in cart*/
            pay() {
                var form = document.querySelector("#crediCartForm") as HTMLFormElement;
                if (!form || !form.checkValidity()) {
                    return alert("Form not valid");
                }
                //TODO: validar preço do pedido com preço atual

                var now = new Date();
                if (this.validYear < now.getFullYear() || (this.validYear === now.getFullYear() && now.getMonth() + 1 <= this.validMonth))
                    return alert("your card is expired");

                var regex = new RegExp("\d+");

                var requestsItens = [];
                var itensIds = [];
                var pay = (itens) => {
                    for (let i = 0; i < itens.length; i++) {
                        requestsItens.push({
                            id: itens[i].id,
                            price: itens[i].price,
                            qtd: itens[i].qtd
                        });
                        itensIds.push(itens[i]);
                    }
                    if (requestsItens.length <= 0)
                        return alert("No ticket was selected");
                  
                    var data = JSON.stringify({
                        cardCvv: this.cartCvv,
                        cardNumber: this.cartNumber.replace(regex, ""),
                        validMonth: this.validMonth,
                        validYear: this.validYear,
                        name: this.name,
                        saveCard: this.saveCard,
                        creditCardBrand: this.creditCardBrand,
                        installmentCount: this.installmentCount,
                        itens: requestsItens
                    });
                    var self = this;

                    var funcSuccess = (result) => {
                        if (result.responseText) alert(result.responseText);
                        for (var i = 0; i < itensIds.length; i++)
                            Controls.Cart.instancia.delete(itensIds[i], null);

                        Controls.Cart.instancia.refresh();
                    };

                    Ajax.post("/request", data, funcSuccess, (result) => alert(result));
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
                return User.instancia.IsAutentication ? "Sing Out" : "Sing In";
            }

            singOut() {
                User.singOut();
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
                    scope.oauth = User.instancia;
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


}


var application = new Ticket.AppStart();
application.run();
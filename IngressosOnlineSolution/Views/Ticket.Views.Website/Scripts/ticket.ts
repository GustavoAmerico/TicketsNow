module Ticket {
    import User = OAuth.User;

    /**Abstraction from the home*/
    class Dashboard {

        /**Featured events */
        private _feasts: Feast[] = [];

        /**Featured events 
         * @returns {'Featured events to diplay in screen'} 
         */
        get feasts(): Feast[] {
            return (this._feasts) ? this._feasts : [];
        }


        /**Add this class how controlller in AngularJs*/
        static configurarAngular(modulo: any): void {
            var controllerName = "DashboardCtrl";
            modulo.factory("loadFeast", ($q) => {
                var load = () => {
                    var deferred = $q.defer();

                    Ajax.get<Feast>("/event", e => {
                        deferred.resolve(e);
                    }, win.alert, () => new Feast());
                    return deferred.promise;
                };

                return {
                    run: load
                };


            });
            modulo.controller("DashboardCtrl", [
                "$scope", "loadFeast", ($scope, loadFeast) => {
                    $scope.rsx = win.rsx;
                    var dash = new Dashboard();
                    loadFeast.run()
                        .then((result) => {
                            dash._feasts = result;
                        });

                    $scope.x = dash;

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
    class Cart {


        private static dbName = "ShoppingCart";

        /**Model for Credit card*/
        creditCard = new CreditCard();

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
        onLoadAllRequest: (itens: Feast[]) => void;

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
            request.onerror = (e) => console.log(e);
            request.onsuccess = (event) => {
                var cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
                if (cursor) {
                    if (cursor.value && cursor.value.qtd > 0)
                        list.push(cursor.value);
                    cursor.continue();
                } else {
                    try {
                        if (its.onLoadAllRequest)
                            its.onLoadAllRequest(list);
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
        static addItensInTable(item: Feast, cart: Cart) {
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
                "$scope", $scope => {
                    $scope.rsx = win.rsx;
                    document.title = win.rsx.pageTitles.cart;
                    try {

                        $scope.model = Cart.instancia;
                        $scope.model.onLoadAllRequest = (list) => {
                            win.$("#shoppingCart tr").remove();
                            list.forEach(x => Cart.addItensInTable(x, $scope.model));
                        };
                        $scope.model.loadAllRequest();

                    } catch (e) {

                    }
                    /**
                     * add to request in table
                     * @returns {}
                     */

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


    /**Abstraction from the controller to credit card*/
    class CreditCard {

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

                Ajax.post("/Event/pay", data, funcObserver, funcObserver);
            };

            Cart.instancia.onLoadAllRequest = pay;
            Cart.instancia.loadAllRequest();


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
                Cart.instancia.addOrUpdate({
                    id: this.id,
                    title: this.title,
                    decription: this.decription,
                    image: this.image,
                    price: this.price,
                    qtd: this.qtd
                }, this.id);
                alert(win.rsx.msgs.ticketReserved.format(this.qtd, this.title));
            } else {
                Cart.instancia.delete(this.id, () => console.log);
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

    class AppStart {
        run(): void {
            this.iniciarAngularJs();
            this.initStoreIndexedDb();
        }

        private iniciarAngularJs() {
            const modulo = win.angular.module("app", ["ngRoute"]);

            Dashboard.configurarAngular(modulo);
            Cart.configurarAngular(modulo);
            modulo.config($routeProvider => {
                $routeProvider.otherwise({ redirectTo: "/" });
            });

            Cabecalho.configurarAngular(modulo);
            MeuMenu.configurarAngular(modulo);
            Feast.configurarAngular(modulo);
            this.configurarCredCartDirective(modulo);
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
            const start = Cart.instancia;
        }
    }


    var ang = new AppStart();
    ang.run();
    window["startApp"] = ang;
}
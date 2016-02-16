var win = (function () { return window; })();
var Ticket;
(function (Ticket) {
    var AppStart = (function () {
        function AppStart() {
        }
        AppStart.prototype.run = function () {
            this.iniciarAngularJs();
            this.initStoreIndexedDb();
        };
        AppStart.prototype.iniciarAngularJs = function () {
            var modulo = win.angular.module("app", ["ngRoute"]);
            Controls.Dashboard.configurarAngular(modulo);
            Controls.Cart.configurarAngular(modulo);
            modulo.config(function ($routeProvider) {
                $routeProvider.otherwise({ redirectTo: "/" });
            });
            Controls.MyRequest.configurarAngular(modulo);
            Directive.MyHeader.configurarAngular(modulo);
            Directive.myMenu.configurarAngular(modulo);
            Directive.Feast.configurarAngular(modulo);
            User.configAngularJs(modulo);
            this.configurarCredCartDirective(modulo);
            this.configTaskService(modulo);
        };
        AppStart.prototype.configTaskService = function (modulo) {
            modulo.factory("taskService", function ($q) {
                return {
                    run: function (task) {
                        var deferred = $q.defer();
                        task(function (e) { return deferred.resolve(e); });
                        return deferred.promise;
                    }
                };
            });
        };
        AppStart.prototype.configurarCredCartDirective = function (modulo) {
            modulo.directive("credit", function () { return ({
                restrict: "E",
                templateUrl: "controles/CreditCart.html",
                scope: { model: "=", rsx: "=" }
            }); });
        };
        AppStart.prototype.initStoreIndexedDb = function () {
            var xcart = Controls.Cart.instancia;
        };
        return AppStart;
    })();
    Ticket.AppStart = AppStart;
    var Controls;
    (function (Controls) {
        var MyRequest = (function () {
            function MyRequest() {
                this.date = "";
                this.description = "";
                this.number = "";
                this.total = 0;
                this.statusId = 0;
            }
            MyRequest.configurarAngular = function (modulo) {
                var controllerName = "MyRequestCtrl";
                modulo.controller(controllerName, [
                    "$scope", "oAuth", "taskService", "$sce", function ($scope, oAuth, taskService, $sce) {
                        $scope.oauth = oAuth.oauth();
                        if (!$scope.oauth.IsAutentication)
                            win.location.assing("/");
                        document.title = win.rsx.pageTitles.myRequest;
                        taskService.run(MyRequest.getAll)
                            .then(function (result) {
                            $scope.requests = result;
                        });
                        ;
                    }
                ]);
                modulo.config(function ($routeProvider) {
                    $routeProvider
                        .when("/myrequest", {
                        templateUrl: "myrequest.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
                });
            };
            MyRequest.getAll = function (onsucess) {
                Ajax.get("/request", onsucess, function (e) { return console.log(e); }, function () { return new MyRequest(); });
            };
            return MyRequest;
        })();
        Controls.MyRequest = MyRequest;
        var Dashboard = (function () {
            function Dashboard() {
                this._feasts = [];
            }
            Object.defineProperty(Dashboard.prototype, "feasts", {
                get: function () {
                    return (this._feasts) ? this._feasts : [];
                },
                enumerable: true,
                configurable: true
            });
            Dashboard.configurarAngular = function (modulo) {
                var controllerName = "DashboardCtrl";
                modulo.factory("loadFeast", function ($q) {
                    var load = function () {
                        var deferred = $q.defer();
                        Ajax.get("/event", function (e) {
                            deferred.resolve(e);
                        }, function (e) {
                            var text = JSON.stringify(e);
                            win.alert(text);
                        }, function () { return new Directive.Feast(); });
                        return deferred.promise;
                    };
                    return {
                        run: load
                    };
                });
                modulo.controller("DashboardCtrl", [
                    "$scope", "loadFeast", function ($scope, loadFeast) {
                        var dash = new Dashboard();
                        loadFeast.run()
                            .then(function (result) {
                            dash._feasts = result;
                        });
                        $scope.x = dash;
                        $scope.rsx = win.rsx;
                        $scope.oauth = User.instancia;
                        document.title = win.rsx.pageTitles.home;
                    }
                ]);
                modulo.config(function ($routeProvider) {
                    $routeProvider
                        .when("/", {
                        templateUrl: "dashboard.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
                    $routeProvider
                        .when("", {
                        templateUrl: "dashboard.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
                });
            };
            return Dashboard;
        })();
        Controls.Dashboard = Dashboard;
        var Cart = (function () {
            function Cart() {
                this.creditCard = new Directive.CreditCard();
                this.isStarted = false;
                this.haveItens = false;
                this.openIndexeddb();
            }
            Object.defineProperty(Cart, "instancia", {
                get: function () {
                    if (Cart._instancia == null)
                        Cart._instancia = new Cart();
                    return Cart._instancia;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cart.prototype, "requestStore", {
                get: function () {
                    var transiction = this.db.transaction([Cart.objectStoreName], "readwrite");
                    var objectStore = transiction.objectStore(Cart.objectStoreName);
                    return objectStore;
                },
                enumerable: true,
                configurable: true
            });
            Cart.prototype.addOrUpdate = function (item, key, exp) {
                if (exp === void 0) { exp = 0; }
                if (item == null || key == null)
                    return;
                if (!this.isStarted) {
                    win.setTimeout(this.addOrUpdate(item, key, (3 + exp)), ((20 + exp) * 1000));
                    return;
                }
                var x = this;
                var func = function (i) {
                    var store = x.requestStore;
                    if (i == null)
                        store.add(item);
                    else
                        store.put(item);
                };
                this.get(key, func);
            };
            Cart.prototype.get = function (key, func) {
                var request = this.requestStore.get(key);
                request.onsuccess = function (e) {
                    var cursor = e.target.result;
                    func(cursor);
                };
            };
            Cart.prototype.delete = function (key, onSuccess) {
                var store = this.requestStore;
                var request = store.delete(key);
                if (onSuccess != null)
                    request.onsuccess = onSuccess;
            };
            Cart.prototype.loadAllRequest = function () {
                var store = this.requestStore;
                var request = store.openCursor();
                var list = [];
                var its = this;
                var allPrice = 0;
                request.onerror = function (e) { return console.log(e); };
                request.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        if (cursor.value && cursor.value.qtd > 0) {
                            list.push(cursor.value);
                            allPrice += (cursor.value.price * cursor.value.qtd);
                        }
                        cursor.continue();
                    }
                    else {
                        if (its.onLoadAllRequest)
                            its.onLoadAllRequest(list);
                        if (list.length > 0)
                            its.haveItens = true;
                        its.totalPrice = allPrice;
                    }
                };
            };
            Cart.prototype.refresh = function () {
                var m = this;
                this.onLoadAllRequest = function (list) {
                    win.$("#shoppingCart tr").remove();
                    list.forEach(function (x) { return Cart.addItensInTable(x, m); });
                };
                this.loadAllRequest();
            };
            Cart.addItensInTable = function (item, cart) {
                var tableBody = win.$("#shoppingCart")[0];
                if (tableBody == null || item == null)
                    return;
                var cellImg = document.createElement("td");
                var img = document.createElement("img");
                img.alt = item.title;
                img.src = item.image;
                img.style.maxWidth = "150px";
                img.style.maxHeight = "90px";
                cellImg.appendChild(img);
                var celltitle = document.createElement("td");
                celltitle.innerText = item.title;
                var cellqtd = document.createElement("td");
                cellqtd.innerText = item.qtd.toString();
                var celldescription = document.createElement("td");
                celldescription.innerText = item.decription;
                var cellprice = document.createElement("td");
                cellprice.innerText = item.price.toFixed(2);
                var cellaction = document.createElement("td");
                var btnRemove = document.createElement("input");
                btnRemove.type = "button";
                btnRemove.value = "remove";
                btnRemove["eventId"] = item.id;
                btnRemove.onclick = function (e) {
                    var input = e.target;
                    var id = input["eventId"];
                    if (id && cart.delete) {
                        cart.delete(id, function (e) { return input.parentElement.parentElement.parentElement
                            .removeChild(input.parentElement.parentElement); });
                        cart.refresh();
                    }
                };
                btnRemove.classList.add("btn", "btn-danger");
                cellaction.appendChild(btnRemove);
                var row = document.createElement("tr");
                row.appendChild(cellImg);
                row.appendChild(celltitle);
                row.appendChild(celldescription);
                row.appendChild(cellqtd);
                row.appendChild(cellprice);
                row.appendChild(cellaction);
                tableBody.appendChild(row);
            };
            Cart.configurarAngular = function (modulo) {
                var controllerName = "CartCtrl";
                modulo.controller("CartCtrl", [
                    "$scope", "oAuth", function ($scope, oAuth) {
                        $scope.rsx = win.rsx;
                        document.title = win.rsx.pageTitles.cart;
                        $scope.model = Cart.instancia;
                        $scope.exibirPagamento = oAuth.oauth().IsAutentication;
                        try {
                            $scope.model.onLoadAllRequest = function (list) {
                                win.$("#shoppingCart tr").remove();
                                list.forEach(function (x) { return Cart.addItensInTable(x, $scope.model); });
                            };
                            $scope.model.loadAllRequest();
                        }
                        catch (e) {
                        }
                    }
                ]);
                modulo.config(function ($routeProvider) {
                    $routeProvider
                        .when("/cart", {
                        templateUrl: "cart.html",
                        controller: controllerName,
                        caseInsensitiveMatch: true
                    });
                });
            };
            Cart.prototype.openIndexeddb = function () {
                var este = this;
                try {
                    var dbRequest = window.indexedDB.open(Cart.dbName, 1);
                    if (dbRequest != null) {
                        dbRequest.onsuccess = function (evento) {
                            este.db = dbRequest.result;
                            este.db.onerror = function (event) {
                                alert("Database error: " + event.target.errorCode);
                            };
                            este.isStarted = true;
                        };
                        dbRequest.onupgradeneeded = function (event) {
                            var db = event.target.result;
                            var objectStore = db.createObjectStore(Cart.objectStoreName, { keyPath: "id" });
                            objectStore.createIndex("title", "title", { unique: false });
                            objectStore.createIndex("price", "price", { unique: false });
                            objectStore.createIndex("qtd", "qtd", { unique: false });
                            objectStore.createIndex("userId", "userId", { unique: false });
                        };
                    }
                }
                catch (e) {
                    alert("your browser not suported indexedDb, try again with google chrome");
                }
            };
            Cart.prototype.pay = function () {
                var _this = this;
                var requestsItens = [];
                var itensIds = [];
                var pay = function (itens) {
                    for (var i = 0; i < itens.length; i++) {
                        requestsItens.push({
                            id: itens[i].id,
                            price: itens[i].price,
                            qtd: itens[i].qtd
                        });
                        itensIds.push(itens[i].id);
                    }
                    if (requestsItens.length <= 0)
                        return alert("No ticket was selected");
                    var data = JSON.stringify({
                        itens: requestsItens
                    });
                    var self = _this;
                    var funcSuccess = function (result) {
                        for (var i = 0; i < itensIds.length; i++)
                            self.delete(itensIds[i], null);
                        Controls.Cart.instancia.refresh();
                        return alert(result);
                    };
                    Ajax.post("/request/BuyOnClick", data, funcSuccess, Ajax.failResponse);
                };
                Controls.Cart.instancia.onLoadAllRequest = pay;
                Controls.Cart.instancia.loadAllRequest();
            };
            Cart.dbName = "ShoppingCart";
            Cart.objectStoreName = "requests";
            return Cart;
        })();
        Controls.Cart = Cart;
    })(Controls || (Controls = {}));
    var Directive;
    (function (Directive) {
        var CreditCard = (function () {
            function CreditCard() {
                this.creditCardBrand = 0;
                this.installmentCount = 1;
            }
            Object.defineProperty(CreditCard.prototype, "validYears", {
                get: function () {
                    var currentYear = new Date().getFullYear();
                    var years = [];
                    for (var i = currentYear; i < (currentYear + 10); i++) {
                        years.push(i);
                    }
                    return years;
                },
                enumerable: true,
                configurable: true
            });
            CreditCard.prototype.pay = function () {
                var _this = this;
                var form = document.querySelector("#crediCartForm");
                if (!form || !form.checkValidity()) {
                    return alert("Form not valid");
                }
                var now = new Date();
                if (this.validYear < now.getFullYear() || (this.validYear === now.getFullYear() && now.getMonth() + 1 <= this.validMonth))
                    return alert("your card is expired");
                var regex = new RegExp("\d+");
                var requestsItens = [];
                var itensIds = [];
                var pay = function (itens) {
                    for (var i = 0; i < itens.length; i++) {
                        requestsItens.push({
                            id: itens[i].id,
                            price: itens[i].price,
                            qtd: itens[i].qtd
                        });
                        itensIds.push(itens[i].id);
                    }
                    if (requestsItens.length <= 0)
                        return alert("No ticket was selected");
                    var data = JSON.stringify({
                        cardCvv: _this.cartCvv,
                        cardNumber: _this.cartNumber.replace(regex, ""),
                        validMonth: _this.validMonth,
                        validYear: _this.validYear,
                        name: _this.name,
                        saveCard: _this.saveCard,
                        creditCardBrand: _this.creditCardBrand,
                        installmentCount: _this.installmentCount,
                        itens: requestsItens
                    });
                    var self = _this;
                    var funcSuccess = function (result) {
                        for (var i = 0; i < itensIds.length; i++)
                            Controls.Cart.instancia.delete(itensIds[i], null);
                        Controls.Cart.instancia.refresh();
                        return win.alert(result);
                    };
                    Ajax.post("/request", data, funcSuccess, function (result) { return alert(result); });
                };
                Controls.Cart.instancia.onLoadAllRequest = pay;
                Controls.Cart.instancia.loadAllRequest();
            };
            return CreditCard;
        })();
        Directive.CreditCard = CreditCard;
        var Feast = (function () {
            function Feast() {
                this.id = "";
                this.title = "";
                this.decription = "";
                this.image = "";
                this.price = 0;
                this._qtd = 0;
            }
            Object.defineProperty(Feast.prototype, "qtd", {
                get: function () {
                    return this._qtd;
                },
                set: function (value) {
                    if (value && value > 0)
                        this._qtd = value;
                    else
                        this._qtd = 0;
                },
                enumerable: true,
                configurable: true
            });
            Feast.prototype.addToBuy = function () {
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
                }
                else {
                    Controls.Cart.instancia.delete(this.id, function () { return console.log; });
                }
            };
            Feast.configurarAngular = function (modulo) {
                var start = function (scope, elementos, attributes) {
                };
                modulo.directive("feast", function () { return ({
                    restrict: "E",
                    templateUrl: "/controles/feast.html",
                    scope: { event: "=", rsx: "=" },
                    link: start
                }); });
            };
            return Feast;
        })();
        Directive.Feast = Feast;
        var MyHeader = (function () {
            function MyHeader() {
            }
            Object.defineProperty(MyHeader.prototype, "singText", {
                get: function () {
                    return User.instancia.IsAutentication ? "Sing Out" : "Sing In";
                },
                enumerable: true,
                configurable: true
            });
            MyHeader.prototype.singOut = function () {
                User.singOut();
                win.location.assign("oauth/");
            };
            MyHeader.configurarAngular = function (modulo) {
                var start = function (scope, elementos, attri) {
                    win.adminLTE.EnableSidebarToggle();
                    scope.model = new MyHeader();
                };
                modulo.directive("myheader", function () { return ({
                    restrict: "E",
                    templateUrl: "/controles/header.html",
                    scope: { oauth: "=", rsx: "=", model: "=" },
                    link: start
                }); });
            };
            return MyHeader;
        })();
        Directive.MyHeader = MyHeader;
        var myMenu = (function () {
            function myMenu() {
            }
            myMenu.configurarAngular = function (modulo) {
                var start = function (scope, elementos, attributes) {
                    myMenu.iniciarMenu();
                    scope.oauth = User.instancia;
                    scope.rsx = win.rsx;
                };
                modulo.directive("mymenu", function () { return ({
                    restrict: "E",
                    templateUrl: "/controles/menu.html",
                    scope: { oauth: "=", rsx: "=" },
                    link: start
                }); });
            };
            myMenu.iniciarMenu = function () {
                try {
                    win.$(".sidebar").tree();
                    win.adminLTE.Slimscroll();
                }
                catch (e) {
                    console.log(e);
                }
            };
            return myMenu;
        })();
        Directive.myMenu = myMenu;
    })(Directive || (Directive = {}));
})(Ticket || (Ticket = {}));
var application = new Ticket.AppStart();
application.run();

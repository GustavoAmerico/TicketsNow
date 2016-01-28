class Ajax {

    static get<T>(route: any, success: (result: T[]) => void, error: (ex: string) => void,
        typeConstructor?: () => T) {
        route = win.rsx.hostname + route;
        var settings = {
            "async": true,
            "crossDomain": true,
            "processData": false,
            "url": route,
            "method": "GET",
            "dataType": "json",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache"
            }
        };
        try {

            win.$.ajax(settings)
                .done((result, status) => {

                    if (status === 'success') {
                        var itens: T[] = [];
                        if (typeConstructor != null) {
                            for (var i = 0; i < result.length; i++) {
                                var item = result[i];
                                var t = typeConstructor();
                                for (var attr in item) {
                                    if (t.hasOwnProperty(attr))
                                        t[attr] = item[attr];
                                }
                                itens.push(t);
                            }
                        } else
                            itens = result;
                        success(itens);
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
        route = win.rsx.hostname + route;

        var user = OAuth.User.instancia;
        if (headers == null)
            headers = {
                "content-type": "application/json",
                "cache-control": "no-cache"
            };

        headers["Authorization"] = user.token_type + " " + user.access_token;
        const settings = {
            "async": true,
            "crossDomain": true,
            "processData": false,
            "url": route,
            "data": dataJson,
            "method": "POST",
            "dataType": "json",
            "headers": headers
        }
        win.$.ajax(settings)
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


class Cabecalho {

    get singText() {
        const estaLogado = OAuth.User.instancia.estaLogado();
        return estaLogado
            ? "Sing Out" : "Sing In";
    }

    singOut() {
        OAuth.User.singOut();
        win.location.assign("oauth/");
    }


    /**Configurar as directivas do angular*/
    static configurarAngular(modulo: any): void {

        var start = (scope, elementos, attri) => {
            win.adminLTE.EnableSidebarToggle();
            scope.oauth = OAuth.User.instancia;
            scope.rsx = win.rsx;
            scope.model = new Cabecalho();
        };
        modulo.directive("cabecalho", () => ({
            restrict: "E",
            templateUrl: "/controles/header.html",
            scope: { oauth: "=", rsx: "=", model: "=" },
            link: start
        }));
    }


}

class MeuMenu {
    /**Configurar as directivas do angular   */
    static configurarAngular(modulo: any): void {

        var start = (scope, elementos, attributes) => {
            MeuMenu.iniciarMenu();
            scope.oauth = OAuth.User.instancia;
            // scope.rsx = win.rsx;
        };

        modulo.directive("meumenu", () => ({
            restrict: "E",
            templateUrl: "/controles/menu.html",
            scope: { oauth: "=", rsx: "=" },
            link: start
        }));
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




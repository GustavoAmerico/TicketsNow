"use strict";

/**Instancia do DOMWindow*/
var win: any = (() => window)();

class Ajax {


    private static getSettings(method: string, route: string, dataJson?: string) {
        var user = User.instancia;
        var headers = {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "Authorization": user.token_type + " " + user.access_token
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
        for (let i = 0; i < result.length; i++)
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
        win.$.ajax(Ajax.getSettings("POST", win.rsx.hostname + route, dataJson))
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

        var settings = {
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

class User {
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
        var data = JSON.parse(json);
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

        var hoje = new Date();
        var expira = new Date(this.expires.valueOf());

        var inPeriod = expira >= hoje;
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

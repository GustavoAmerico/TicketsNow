"use strict";
var win = (function () { return window; })();
var Ajax = (function () {
    function Ajax() {
    }
    Ajax.getSettings = function (method, route, dataJson) {
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
    };
    Ajax.createType = function (typeConstructor, item) {
        var t = typeConstructor();
        for (var attr in item) {
            if (t.hasOwnProperty(attr))
                t[attr] = item[attr];
        }
        return t;
    };
    Ajax.createTypeArray = function (typeConstructor, result) {
        var itens = [];
        for (var i = 0; i < result.length; i++)
            itens.push(Ajax.createType(typeConstructor, result[i]));
        return itens;
    };
    Ajax.get = function (route, success, error, typeConstructor) {
        try {
            win.$.ajax(Ajax.getSettings("GET", win.rsx.hostname + route))
                .done(function (result, status) {
                if (status === "success") {
                    if (typeConstructor == null) {
                        success(result);
                    }
                    else {
                        success(Ajax.createTypeArray(typeConstructor, result));
                    }
                }
            }).fail(function (e) {
                if (e.resultJson)
                    error(e.resultJson);
                else if (e.resultText)
                    error(e.resultText);
                else
                    error(e);
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    Ajax.post = function (route, dataJson, success, error, headers) {
        win.$.ajax(Ajax.getSettings("POST", win.rsx.hostname + route, dataJson))
            .done(success)
            .fail(error);
    };
    Ajax.form = function (route, dataJson, success, error, header) {
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
        };
        win.$.ajax(settings)
            .done(success)
            .fail(error);
    };
    Ajax.failResponse = function (response) {
        var message = "";
        if (response.status === 400 && response.responseJSON && response.responseJSON.message) {
            message = response.responseJSON.message;
        }
        else if (response.responseJSON) {
            message = JSON.stringify(response.responseJSON);
        }
        else {
            message = JSON.stringify(response);
        }
        win.alert(message);
    };
    return Ajax;
})();
var User = (function () {
    function User() {
        this[".expires"] = new Date(1, 1, 1);
        this[".issued"] = new Date(1, 1, 1);
        this.token_type = "";
        this.access_token = "";
        this.avatar = "http://icons.iconarchive.com/icons/icons-land/flat-emoticons/256/Ninja-icon.png";
        this.userName = "anonymous";
        var json = window.sessionStorage[User.storageKey];
        if (json == null)
            json = window.localStorage[User.storageKey];
        User.fromJson(json, this);
    }
    Object.defineProperty(User.prototype, "issued", {
        get: function () { return this[".issued"]; },
        set: function (value) { this[".issued"] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "expires", {
        get: function () { return this[".expires"]; },
        set: function (value) { this[".expires"] = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "nomeUsuario", {
        get: function () { return this.userName; },
        enumerable: true,
        configurable: true
    });
    User.fromJson = function (json, user) {
        if (!user)
            user = new User();
        if (!json)
            return user;
        var data = JSON.parse(json);
        for (var attr in data)
            if (user.hasOwnProperty(attr))
                user[attr] = data[attr];
        return user;
    };
    Object.defineProperty(User, "instancia", {
        get: function () {
            return User._intancia;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(User.prototype, "IsAutentication", {
        get: function () {
            if (!this.expires || this.access_token == null)
                return false;
            var hoje = new Date();
            var expira = new Date(this.expires.valueOf());
            var inPeriod = expira >= hoje;
            return (inPeriod && this.access_token != null);
        },
        enumerable: true,
        configurable: true
    });
    User.singOut = function () {
        window.localStorage.clear();
        window.sessionStorage.clear();
    };
    User.configAngularJs = function (modulo) {
        modulo.service("oAuth", function ($q) {
            return {
                oauth: function () { return User.instancia; }
            };
        });
    };
    User.storageKey = "oauth_user";
    User._intancia = new User();
    return User;
})();

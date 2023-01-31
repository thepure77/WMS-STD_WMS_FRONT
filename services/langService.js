'use strict'
app.factory('langService', function ($q, ngAuthSettings) {
    var ws = ngAuthSettings.WebClient;

    var uriEN = {
        finishGood: ws + '/app/contents/lang/en.json'
    }

    var uriTH = {
        finishGood: ws + '/app/contents/lang/th.json'
    }

    var langService = {};

    // call english language
    langService.english = function () {
        var deferred = $q.defer();

        $http.get(uriEN).
            then(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject();
            });

        return deferred.promise;
    }

    // call thai language
    langService.thai = function () {
        var deferred = $q.defer();

        $http.get(uriTH).
            then(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject();
            });

        return deferred.promise;
    }

    return langService;
    
});

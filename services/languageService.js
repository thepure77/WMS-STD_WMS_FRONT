'use strict'
app.factory('languageService'['$http', function ($http) {

    var ws = ngAuthSettings.WebClient;

    var uriLanguage = {
        finishGood: ws + '/app/contents/lang'
    }

    var languageService = {};

    languageService.getLanguage = function (mod ,lang) { /*Module ,Language*/
        var deferred = $q.defer();

        uriLanguage.finishGood += '?module=' + mod + '&language=' + lang;

        $http.get(uriLanguage).
            then(function (res) {
                deferred.resolve(res);
            })
            .error(function (res) {
                deferred.reject();
            });

        return deferred.promise;
    }

    return languageService;
}]);
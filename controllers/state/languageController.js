'use strict'
app.controller('languageController'['languageService', function ($scope,languageService) {

    $scope.language = {};

    $scope.getLanguage = function (mod,lang) { /* Module , Language */
        var data = window.localStorage[lang + '_' + mod];
        if (data == null) {
            var result = languageService.getLanguage(mod, lang);
            $scope.language = result;
            window.localStorage[lang + '_' + mod] = angular.toJson(result);
        } else {
            $scope.language = data;
        }
    }

}]);
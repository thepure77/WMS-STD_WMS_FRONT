'use strict';

var app = angular.module('myApp', ['ui.router', 'ngAria', 'ngTouch', 'chart.js', 'LocalStorageModule', 'ngAnimate', 'ngLocale', 'ui.calendar', 'ui.bootstrap', 'angularMoment', 'ngFileUpload', 'ui.sortable', 'pascalprecht.translate', 'ui.multiselect']);


app.run(['ngAuthSettings', '$window',
    function (ngAuthSettings, $window) {
        ngAuthSettings.WebClient = $window.location.origin;
        ngAuthSettings.ClientDirective = ngAuthSettings.WebClient + '/app/';

        // directory
        ngAuthSettings.directory.directive = ngAuthSettings.ClientDirective + 'widgets/';
        ngAuthSettings.directory.modules = ngAuthSettings.ClientDirective + 'modules/';
        ngAuthSettings.directory.assets = ngAuthSettings.ClientDirective + 'assets/';
        ngAuthSettings.directory.widgets = ngAuthSettings.ClientDirective + 'widgets/';
        ngAuthSettings.directory.theme = ngAuthSettings.ClientDirective + 'contents/ace-master/';

    }
]);

app.config(['$httpProvider', function ($httpProvider) {
    // Custome $http interceptors
    $httpProvider.interceptors.push('customHttpInterceptor');
}]);

app.controller('AppCtrl', ['$rootScope', '$scope', '$http', '$document', 'ngAuthSettings',
    function ($rootScope, $scope, $http, $document, $ngAuthSettings) {
        $rootScope.onProgress = false;
    }
]);

app.filter('html', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
})

app.directive('blurOnEnter', function () {
    return function (scope, elem, attrs) {
        elem.bind('keydown keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                elem.blur();
            }
        });
    }
});



app.config(function($httpProvider, $translateProvider) {

    $httpProvider.interceptors.push('authInterceptorService');
    $translateProvider.useStaticFilesLoader({
        prefix: 'app/contents/lang/local-',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
});

app.run(['authService', 'langService', function(authService) {

    authService.fillAuthData();
}]);



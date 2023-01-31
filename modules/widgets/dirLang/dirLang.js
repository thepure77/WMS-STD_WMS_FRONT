'use strict';
app.directive('langButton', function ($compile, $translate, ngLangauge) {
    return {
        restrict: 'E',
        templeteUrl: 'modules/ModuleOms/widgets/dirLang/dirLang.html',
        link: function (scope, element, attrs) {
            scope.lang = $translate.use();

            console.log(scope.lang);
            
            scope.langItems = ngLangauge;

            console.log(scope.langItems);
        }
    };
});
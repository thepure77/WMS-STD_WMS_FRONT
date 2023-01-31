
'use strict';
//app.directive("footer" ['ngAuthSettings', '$window', 'commonService', 
//function (ngAuthSettings, $window, commonService) { 
//    return {
//        restrict: 'E',
//        scope: {
//            bodyStyle: '@?',
//            title: '@?'
           
//        },
//        controller: ['$scope', 'ngAuthSettings', function ($scope, ngAuthSettings) {
//            //$scope.root = ngAuthSettings.ClientDirective + 'contents/ace-master/';


//        }],
//        link: function ($scope, $element, $attributes) {
//            scope.text = $attributes.text;
//        },
//        templateUrl: ngAuthSettings.ClientDirective + "widgets/dirFooter/footer.html",
        
//    };
//}]);
app.directive("footer", function () {
    return {
        restrict: 'E',
        scope: {
            text: '@'
        },
        template: `
            <div class ="kasco-footer">
                <div class ="row">
                    <div class ="col-md-12 col-lg-12 col-xs-12 text-right">
                        {{text}}
                    </div>
                </div>
            </div>          `
    };
});
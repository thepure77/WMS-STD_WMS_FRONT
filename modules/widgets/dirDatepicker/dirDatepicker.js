'use strict'
app.directive("mydatepicker", function($compile, $filter) {
    return {
        restrict: "EA",
        scope: {
            val: '=ngModel',
            format: '=dateFormat'
        },
        scope: true,
        link: function(scope, element, attrs) {
            // convert datetime flag
            scope.flag = false;

            scope.dateFormat = 'dd-MM-yyyy';


            scope.txtDate = moment().format('DD-MM-YYYY');

            scope.open = function(event) {
                scope.opened = true;
            };

            scope.clear = function() {
                scope.ngModel = null;
            };

            scope.ngModel = scope.$parent.$eval(attrs.ngModel);
            scope.dateOptions = scope.$parent.$eval(attrs.dateOptions);
            scope.placeHolder = scope.$parent.$eval(attrs.placeHolder);
            scope.opened = scope.$parent.$eval(attrs.opened);
        },
        templateUrl: 'modules/widgets/dirDatepicker/dirDatepicker.html'
            //template: '<input type="text" ng-model="ngModel.val"></input>',
    }
});
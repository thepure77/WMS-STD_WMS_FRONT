'use strict'
app.directive('myinput', function () {
    return {
        restrict: 'E',
        scope: true,
        scope: {
            minLength: '@',
            minMsg: '@',
            maxLength: '@',
            maxMsg: '@',
            color: '@',
            type: '@',
            placeholder: '@',
        },
        controller: function ($scope,$attrs) {
            $scope.val = "";
            $scope.msg = "";
            $scope.textcolor = $attrs.color;
            $scope.type = $attrs.type;
            $scope.placeholder = $attrs.placeholder;

            $scope.$watch('val', function (newValue, oldValue) {
                if ($scope.type.toLowerCase() == "checkbox" || $scope.type.toLowerCase() == "radio") {

                } else {
                    if (newValue.length < $attrs.minLength) {
                        $scope.msg = $attrs.minMsg;
                    } else if (newValue.length > $attrs.maxLength) {
                        $scope.msg = $attrs.maxMsg;
                    } else {
                        $scope.msg = null;
                    }
                }
            });
        },
        templateUrl: 'modules/ModuleOms/widgets/dirInputFilter/dirInputFilter.html',
    }
});
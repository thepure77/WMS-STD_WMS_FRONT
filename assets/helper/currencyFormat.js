(function () {
    'use strict';
    app.directive('currencyFormat', function () {
        return {
            restrict: 'E',
            scope: {
                value: '=',
            },
            controller: function ($scope) {
                $scope._money = "";
                $scope.$watch("value", function (_n, _o) {
                    let value = _n;
                    if (!value || typeof value != 'undefined') {
                        $scope._money = value;
                    }
                });
            },
            link: function (scope, attrt, element) { },
            template: `<input ng-model="_money" class="form-control" money/>`
        }
    });

    'use strict';
    app.directive("money", function ($filter, $locale) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, el, attr, ctrl) {
                function formatMoney() {
                    var value = ctrl.$modelValue;
                    // format using angular
                    var currencyFilter = $filter('currency');
                    var value = currencyFilter(value, "");
                    // render
                    ctrl.$viewValue = value;
                    ctrl.$render();
                };

                el.bind('blur', function (e) {
                    formatMoney();
                });
            }
        };
    });

})();


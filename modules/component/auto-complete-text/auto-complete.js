'use_strict';
(function () {
    'use strict';
    app.component('autoComplete', {
        controllerAs: '$vm',
        controller: autoCompleteCtrl,
        templateUrl: function ($element, $attrs, ngAuthSettings, $window, commonService) {
            return "modules/component/auto-complete-text/auto-complete.html";
        },
        bindings: {
            apiFunc: '=?',
            selectedItem: '=?',
            selectedValue: '=?',
            placeholder: '=?',
            selectedCallback: '=?',
            asyncSelected: '=?'
        }
    })
})();

function autoCompleteCtrl($scope, $http) {
    var $vm = this;

    this.$onInit = function () {
    };

    $scope.$on('$destroy', function () { });

    $scope.getData = function (val) {
        if (typeof $vm.apiFunc === 'function') {
            return $vm.apiFunc(val);
        }
    };

    $scope.selectedItem = function ($item, $model, $label, $event) {
        $vm.selectedItem = $item;
        $vm.selectedValue = $label;

        if (typeof $vm.selectedCallback === 'function') {
            $vm.selectedCallback($item, $model, $label);
        }
    };
}
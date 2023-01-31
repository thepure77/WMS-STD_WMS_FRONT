'use strict'
app.controller("siloOrderSummaryCreateController", ["$scope", "$state", function ($scope, $state) {

    $scope.cancelCreate = function () {
        return $state.go('customer.silo-order-summary');
    }


}]);
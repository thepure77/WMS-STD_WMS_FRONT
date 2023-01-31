'use strict'
app.controller('siloPlanCreateController', ['$scope', '$state', function ($scope, $state) {

    $scope.cancelCreate = function () {
        return $state.go('customer.silo-plan');
    }

}]);
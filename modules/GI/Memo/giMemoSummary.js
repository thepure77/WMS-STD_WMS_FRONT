(function () {
    'use strict'

    app.component('giMemoSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/Memo/giMemoSummary.html",
        controller: function ($scope) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
            this.$onInit = function () {
            };
        }
    })
})();
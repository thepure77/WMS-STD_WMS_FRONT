(function () {
    'use strict'

    app.component('grMemoSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/Memo/grMemoSummary.html",
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
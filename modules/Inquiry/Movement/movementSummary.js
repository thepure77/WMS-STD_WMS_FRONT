(function () {
    'use strict'

    app.component('movementSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs,  $window, commonService) {
            return "modules/Inquiry/Movement/movementSummary.html";
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
            

            
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            function init(){                
                $scope.setNavigation = $window.localStorage
            }
            //init();

        }
    })
})();
'use strict'
app.component('collapsePopup', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/yardDock/bookingDockCheck/collapsePopup/collapsePopup.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerShow: '=?',
        triggerInit: '=?',
        isFilter: '=?',
        triggerCreate: '=?',

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, bookingDockCheckoutFactory) {
        var $vm = this;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = bookingDockCheckoutFactory;
        // setting column

        $vm.isShow = false;

        var defer = {};

        $scope.back = function () {
            $vm.searchResultModel = {};
            defer.resolve('0');
        }

        $vm.triggerInit = function () {

        };

        $scope.checkout = function (param, action) {
            viewModel.set(param, action);
            viewModel.getAction(param, action);
            $state.go('wms.booking_dock_checkout_form');
            // if ($scope.onShow) {
            //     $vm.isShow = false;
            //     $scope.onShow().then(function (result) {
            //         $vm.isShow = true;
            //         $vm.triggerSearch();
            //     }).catch(function (error) {
            //         defer.reject({ 'Message': error });
            //     });
            // }
        }

        $vm.triggerShow = function (param) {
            defer = $q.defer();
            if (param != undefined) {
                $vm.isShow = true;
                // $vm.containnerDesc = param;

                $scope.filterModel = param;
                defer.resolve($vm.containnerDesc);
            }
            else {
                $vm.isShow = false;
            }
            return defer.promise;
        };

        // ----------------------------------------------------
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: true,
            showEdit: true
        }

        $vm.setDateFormate = function (v) {
            try {
                return $filter("dateFormate")(v);
            } catch (e) {
                return "-";
            }
        }

        $scope.calColor = function (value) {
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };

        function initialize() {
        };

        this.$onInit = function () {
            initialize();
        };

        this.$onDestroy = function () {
        };

        $scope.$on('$destroy', function () {
            $vm.$onDestroy();
        });
    }
});
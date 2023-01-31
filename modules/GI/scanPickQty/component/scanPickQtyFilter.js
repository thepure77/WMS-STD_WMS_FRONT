(function () {
    'use strict';
    app.component('scanPickQtyFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/scanPickQty/component/scanPickQtyFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, scanPickQtyFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = scanPickQtyFactory;

            // $vm.filterModel = {};

            $vm.triggerSearch = function (isuse = false) {
                if (isuse) {
                    $vm.filterModel = {};
                } else
                    $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                $vm.filterModel.userName = localStorageService.get('userTokenStorage');
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.resultIsUse) {
                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: res.data.resultMsg
                            }
                        )
                    }
                });
            };


            $scope.clearSearch = function () {
                $scope.filterModel = {};
            }

            $scope.confirmPrinter = function () {
                if ($scope.dropdownPrinter.model == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "กรุณาเลือก Printer"
                    })
                } else {
                    $scope.isConfirmPrinter = true;
                    $window.localStorage['isPrinter'] = JSON.stringify($scope.dropdownPrinter.model);
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "Login Printer"
                    })
                }

            }

            $scope.canclePrinter = function () {
                if ($window.localStorage['isPrinter'] == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "Cancle Error"
                    })
                } else {
                    $scope.isConfirmPrinter = false;
                    $scope.dropdownPrinter.model = undefined
                    $window.localStorage['isPrinter'] = JSON.stringify(undefined);
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "Cancle Printer"
                    })
                }

            }

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            $scope.dropdownPrinter = function () {
                viewModel.dropdown_printer().then(function (res) {
                    $scope.dropdownPrinter = res.data;
                });
            };

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.$watch("dropdownPrinter", function () {
                debugger
                if ($window.localStorage['isPrinter'] != undefined) {
                    var printer = $scope.dropdownPrinter
                    const resultprinter = printer.filter((printer) => {
                        return printer.printer_Index == $scope.printer.printer_Index;
                    })
                    $scope.dropdownPrinter.model = resultprinter[0]
                }
            });

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.dropdownPrinter();
                $scope.printer = {};
                debugger
                if ($window.localStorage['isPrinter'] == undefined) {
                    $scope.isConfirmPrinter = false;
                } else {
                    $scope.printer = angular.fromJson($window.localStorage['isPrinter'])
                    $scope.isConfirmPrinter = true;
                }
                $scope.userName = localStorageService.get('userTokenStorage');
            };

        }
    });

})();
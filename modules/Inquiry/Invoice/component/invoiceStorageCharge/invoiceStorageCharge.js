(function () {
    'use strict'
    app.component('invoiceStorageCharge', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/Invoice/component/invoiceStorageCharge/invoiceStorageCharge.html",
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, $state,pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, invoiceFactory, webServiceAPI) {
            var $vm = this;

            $scope.isLoading = false;
            $scope.filterModel = {};
            var defer = {};
            var viewModel = invoiceFactory;

            $vm.isLoading = function (param) {
                defer = $q.defer();
                $scope.isLoading = true;
                $scope.filterModel = param;
                $scope.filterModel.dateDoc = 1;

                // $scope.filterModel.doc_Date = getToday();
                // $scope.filterModel.doc_DateTo = getToday();
                return defer.promise;
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

            $scope.dropDownStorageCharge = function () {
                viewModel.dropDownStorageCharge($scope.filterModel).then(function (res) {
                    $scope.dropDownStorageCharge = res.data;
                });
            };

            $scope.LoadTrasaction = function () {
                if ($scope.dropDownStorageCharge.model != null) {
                    $scope.filterModel.serviceCharge_Index = $scope.dropDownStorageCharge.model.serviceCharge_Index;
                    $scope.filterModel.serviceCharge_Id = $scope.dropDownStorageCharge.model.serviceCharge_Id;
                    $scope.filterModel.serviceCharge_Name = $scope.dropDownStorageCharge.model.serviceCharge_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_ServiceCharge'
                        }
                    )
                    return "";
                }
                pageLoading.show();
                viewModel.loadtransction($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $scope.filterModel.listBinBalanceServiceCharge = res.data;
                });
            };

            $scope.calServiceCharge = function () {
                if ($scope.dropDownStorageCharge.model != null) {
                    $scope.filterModel.serviceCharge_Index = $scope.dropDownStorageCharge.model.serviceCharge_Index;
                    $scope.filterModel.serviceCharge_Id = $scope.dropDownStorageCharge.model.serviceCharge_Id;
                    $scope.filterModel.serviceCharge_Name = $scope.dropDownStorageCharge.model.serviceCharge_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_ServiceCharge'
                        }
                    )
                    return "";
                }
                pageLoading.show();
                viewModel.cal($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if(res.data.length > 0)
                    {
                        $scope.filterModel.listBinBalanceServiceCharge = res.data;
                    }
                    else{
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'No Data to Cal'
                            }
                        )
                        return "";
                    }
                });
            };
            $scope.confirm = function () {
                defer.resolve($scope.filterModel);
            };


            $scope.back = function () {
                defer.resolve('-99');
            }


            var init = function () {
                $scope.filterModel = {};
                // $scope.filterModel.doc_Date = getToday();
                // $scope.filterModel.doc_DateTo = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropDownStorageCharge();
            };
            init();
        }
    })
})();
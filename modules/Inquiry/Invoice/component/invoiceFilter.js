(function () {
    'use strict';
    app.component('invoiceFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Inquiry/Invoice/component/invoiceFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, invoiceFactory, webServiceAPI, importFileFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = invoiceFactory;
            var model = $scope.filterModel;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };



            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };



            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.invoice_Date = getToday();
                $vm.filterModel.invoice_DateTo = getToday();
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();
                viewModel.filterInvoice($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        $vm.searchResultModel = res.data.items;
                    }
                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                });
            };


            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };


            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }
                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }
                pageLoading.show()
                viewModel.filterInvoice($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide()
                        deferred.resolve(res);
                    },
                    function error(response) {
                        pageLoading.hide()
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $scope.filterSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch

                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.items;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;

                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                }, function error(res) { });
            };

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.filterModel.dateDue = formatDate();
                $scope.dropdownDocumentType.model = {};
                $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            }

            // Export Excel
            $scope.exportFile = {

                ExportInvoice: function () {
                    dpMessageBox.confirm({
                        title: 'Confirm.',
                        message: 'Do you want to download?'
                    }).then(function success() {
                        ExportInvoice();
                    })
                },
            }

            function ExportInvoice() {
                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }
                var deferred = $q.defer();
                $scope.filterModel.excelName = "สรุปพื้นที่การจัดเก็บและค่าบริการจัดเก็บ";
                viewModel.ExportInvoice($scope.filterModel).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {

                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.invoice_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.invoice_DateTo = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };


            // ----------------------------------------------------
            // This local function

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            }

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.autoComplete = {
                owner: "PickBinbalance/AutoCompleterOwnerId",
                autoInvoice: "PickBinbalance/autoItemInvoice",

            };

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
            };



            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };

        }
    });

})();
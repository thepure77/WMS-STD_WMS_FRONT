(function () {
    'use strict';
    app.component('nonStandardizedTransactionsFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Labor/nonStandardizedTransactions/component/nonStandardizedTransactionsFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, nonStandardizedTransactionsFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = nonStandardizedTransactionsFactory;
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
                debugger;
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.ns_date = $vm.filterModel.ns_date || getToday();
                $vm.filterModel.ns_date_To = $vm.filterModel.ns_date_To || getToday();
                pageLoading.show();
                viewModel.FilterSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.countAll = res.data.countAll;
                    $vm.searchResultModel = res.data.itemsNonStandard;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
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
                debugger;
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                pageLoading.show()
                viewModel.FilterSearch($scope.filterModel).then(
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
                debugger;
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.itemsNonStandard;
                    debugger;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.countAll = res.data.countAll;
                }, function error(res) { });
            };

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.filterModel.dateDue = formatDate();
                $window.scrollTo(0, 0);
            }

            $scope.convertDate = function () {
                debugger;
                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.ns_date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.ns_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
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

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            $scope.autoComplete = {
                autoProduct: "Autocomplete/autoProductId",
                autoOwner: "ReportAutocomplete/autoOwner",
                autoOwnerID: "WorkOutstanding/autoSearchOwnerID",
                TruckloadNo: "AutoLoad/autoTruckloadNo",
                autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
                billing: "AutoPlanGoodIssue/AutoBilling_No",
                autoGINo: "ReportAutocomplete/autoGINo",
            };

            $scope.url = {
                // Master: webServiceAPI.Master,
                // Report: webServiceAPI.Report,
                // Load: webServiceAPI.Load,
                // PlanGI: webServiceAPI.PlanGI,
                Master: 'https://or-dcwms.pttor.com/AMZ_WMS_MasterAPI/api/',
                Report: 'http://10.106.159.12/AMZ_WMS_ReportAPI/api/',
                Load: 'https://or-dcwms.pttor.com/AMZ_WMS_LoadAPI/api/',
                PlanGI: 'https://or-dcwms.pttor.com/AMZ_WMS_PlanGIAPI/api/',

            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.filterModel.ns_date = getToday();
                $scope.filterModel.ns_date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";
            };

        }
    });

})();
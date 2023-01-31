(function () {
    'use strict';
    app.component('checkStockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CheckStock/component/CheckStockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, checkStockFactory, webServiceAPI, importFileFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
       
            var viewModel = checkStockFactory;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.planGoodsIssue_Date = $vm.filterModel.planGoodsIssue_Date || getToday(true);
                $vm.filterModel.planGoodsIssue_Date_To = $vm.filterModel.planGoodsIssue_Date_To || getToday();
                pageLoading.show();
                viewModel.CheckSctock_filter($vm.filterModel).then(function (res) {
                    
                    pageLoading.hide();

                    if (res.data.checkStockModel.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.checkStockModel;
                    }
                    else {
                        $vm.searchResultModel = res.data.checkStockModel;
                    }
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
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                pageLoading.show()
                viewModel.CheckSctock_filter($scope.filterModel).then(
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

                if ($scope.dropdownRound.model != undefined) {
                    $scope.filterModel.round_Index =  $scope.dropdownRound.model.round_Index;
                    $scope.filterModel.round_Id =  $scope.dropdownRound.model.round_Id;
                    $scope.filterModel.round_Name =  $scope.dropdownRound.model.round_Name;
                }else{
                    $scope.filterModel.round_Index = undefined;
                    $scope.filterModel.round_Id = undefined;
                    $scope.filterModel.round_Name = undefined;
                }

                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    
                    $vm.searchResultModel = res.data.checkStockModel;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;

                }, function error(res) { });
            };

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.planGoodsIssue_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.planGoodsIssue_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                if ($scope.filterModel.dateDue != null) {
                    var str = $scope.filterModel.dateDue;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.planGoodsIssue_due_date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.planGoodsIssue_due_date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };

            function getToday(chkdate = false) {
                var today = new Date();
                if (chkdate) {
                    today.setDate(today.getDate() - 15);
                }
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

            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.dropdownRound();
                $scope.filterModel.planGoodsIssue_Date = getToday(true);
                $scope.filterModel.planGoodsIssue_Date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');

                // initialize();
            };

        }
    });

})();
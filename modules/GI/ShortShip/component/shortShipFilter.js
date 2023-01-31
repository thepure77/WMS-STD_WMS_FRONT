(function () {
    'use strict';
    app.component('shortShipFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/ShortShip/component/shortShipFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, ShortShipFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = ShortShipFactory;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };

            $scope.searchFilter = function () {
                var deferred = $q.defer();
                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                pageLoading.show()
                viewModel.filter($scope.filterModel).then(
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
                if ($scope.dropdownProcessStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownProcessStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownProcessStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownProcessStatus.model.processStatus_Name;
                }
                

                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.shortShipList;
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

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            $scope.autoComplete = {
                TruckloadNo: "AutoLoad/autoTruckloadNo",
                autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",

            };

            $scope.url = {
                Load: webServiceAPI.Load,
                PlanGI: webServiceAPI.PlanGI,
            };

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.shortShipList.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.shortShipList;
                    }
                    else {
                        $vm.searchResultModel = res.data.shortShipList;
                    }
                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;

                });
            }

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.dropdownProcessStatus = function () {
                viewModel.dropdownProcessStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownProcessStatus = res.data;
                });
            };

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.truckLoad_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.truckLoad_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString() +  " - " + dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString();;
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

            $scope.status = [{
                value: 0,
                display: "มีรายการขาดส่ง"
              }
            ];

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModelhead = {};
                $scope.filterModelresult = {};
                $scope.filterModel.truckLoad_Date = getToday();
                $scope.filterModel.truckLoad_Date_To = getToday();
                $scope.filterModel.date = formatDate();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownProcessStatus();
            };

        }
    });

})();
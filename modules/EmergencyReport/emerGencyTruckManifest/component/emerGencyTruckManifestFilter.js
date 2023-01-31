(function () {
    'use strict';
    app.component('emerGencyTruckManifestFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/EmergencyReport/emerGencyTruckManifest/component/emerGencyTruckManifestFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, emerGencyTruckManifestFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = emerGencyTruckManifestFactory;
            var model = $scope.filterModel;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };



            $scope.selectSort = [
                {
                    value: "TruckLoad_No",
                    display: "เลขที่ใบควบคุมรถ"
                },
                {
                    value: "TruckLoad_Date",
                    display: "วันที่ดำเนินการ"
                }
                
            ];

            $scope.status = [
                {
                    value: 0,
                    display: "รอยืนยัน"
                },
                {
                    value: 1,
                    display: "ปล่อยรถแล้ว"
                },
                {
                    value: -1,
                    display: "ยกเลิกเอกสาร"
                },
            ];


            $scope.header = {
                advanceSearch: false
            };

            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
            };



            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};

                //$scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.itemsPlanGI.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsPlanGI;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsPlanGI;
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
                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }  
                var deferred = $q.defer();
                
                if ($scope.filterModel.date != null) {
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

                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.itemsPlanGI;
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



            // ----------------------------------------------------
            // This local function


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

            };

            $scope.url = {
                PlanGI: webServiceAPI.PlanGI,
            };



            this.$onInit = function () {
                
                //$vm.filterModel = {};
                $vm.filterModel.truckLoad_Date = getToday();
                $vm.filterModel.truckLoad_Date_To = getToday();
                $vm.triggerSearch();
                // $vm.filterModel.planGoodsIssue_Date = getToday();
                // $vm.filterModel.planGoodsIssue_Date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";

                // initialize();
            };

        }
    });

})();
(function () {
    'use strict';
    app.component('carInspectionFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/carInspection/component/carInspectionFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, carInspectionFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = carInspectionFactory;
            var model = $scope.filterModel;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };

            $scope.status = [
                {
                    value: "Success",
                    display: "ตรวจผ่าน"
                },
                {
                    value: "Cancle",
                    display: "ตรวจไม่ผ่าน"
                },
                {
                    value: "Pending",
                    display: "รอการตรวจ"
                },  
            ];

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.appointment_Date = $vm.filterModel.appointment_Date || getToday(true);
                $vm.filterModel.appointment_Date_To = $vm.filterModel.appointment_Date_To || getToday();
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();
                
                if($scope.dropdowndock.model != undefined){
                    $scope.filterModel.dock_Index = $scope.dropdowndock.model.dockDoor_Index;
                }
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    
                    if (res.data.itemsCarInspection.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsCarInspection;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsCarInspection;
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
                
                if($scope.dropdowndock.model != undefined){
                    $scope.filterModel.dock_Index = $scope.dropdowndock.model.dockDoor_Index;
                }
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.itemsCarInspection;
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


            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.appointment_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.appointment_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };


            function getToday(chkdate = false) {
                var today = new Date();
                if (chkdate) {
                    today.setDate(today.getDate());
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


            $scope.autoComplete = {
                autoAppoinmentNo: "CarInspection/autoAppoinmentNo",
                autoAppoinmentVehicle_no: "CarInspection/autoAppoinmentVehicle_no"

            };

            $scope.url = {
                YardDock: webServiceAPI.YardDock,
            };

            $scope.dropdowndock = function () {
                viewModel.dropdowndock($scope.filterModel).then(function (res) {
                    $scope.dropdowndock = res.data;
                });
            };


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.appointment_Date = getToday(true);
                $scope.filterModel.appointment_Date_To = getToday(true)
                $vm.filterModel.planGoodsIssue_Date = getToday(true);
                $vm.filterModel.planGoodsIssue_Date_To = getToday(true);
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";
                $scope.dropdowndock();

                // initialize();
            };

        }
    });

})();
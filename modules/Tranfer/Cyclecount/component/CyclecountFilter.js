(function () {
    'use strict';
    app.component('cyclecountFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/Cyclecount/component/CyclecountFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, cyclecountFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = cyclecountFactory;
            var model = $scope.filterModel;

            $scope.selectSort = [
                {
                    value: "cycleCount_No",
                    display: "เลขที่ใบตรวจนับสินค้า"
                },
                {
                    value: "cycleCount_Date",
                    display: "ตรวจนับโดยวันที่"
                },
                {
                    value: "documentType_Name",
                    display: "ประเภทเอกสาร"
                },
                {
                    value: "document_Status",
                    display: "สถานะ"
                },
                {
                    value: "Create_By",
                    display: "ผู้ใช้งาน"
                }
            ];


            $scope.status = [
                {
                    value: 0,
                    display: "รอตรวจนับ"
                },
                {
                    value: 2,
                    display: "มอบหมายงาน"
                },
                {
                    value: 3,
                    display: "เสร็จสิ้น"
                },
                {
                    value: -1,
                    display: "ยกเลิก"
                },
            ];

            $vm.triggerSearch = function () {
                $vm.filterModel.cycleCount_Date = getToday();
                $vm.filterModel.cycleCount_Date_To = getToday();
                $vm.filterModel.advanceSearch = true;
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                });
            };


            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.header = {
                advanceSearch: false
            };

            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.filterSearch = function (param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel = param;
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                } else {
                    $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentType_Id = -99;
                    $scope.filterModel.documentType_Name = "";
                }


                if ($scope.dropdownStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
                    $scope.filterModel.document_Status = $scope.dropdownStatus.model.processStatus_Id;

                }
                else {
                    $scope.filterModel.processStatus_Index = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.processStatus_Id = -99;
                    $scope.filterModel.processStatus_Name = "";
                    $scope.filterModel.document_Status = null;

                }

                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }

                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {

                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                });
            };

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.dropdownDocumentType.model = {};
                $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            }

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownStatus = function () {
                viewModel.dropdownStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownStatus = res.data.sort(function(a, b) { 
                        if (a.processStatus_Id == -1) {
                            a.processStatus_Id = 99
                        }
                        if (b.processStatus_Id == -1) {
                            b.processStatus_Id = 99
                        }
                        return a.processStatus_Id - b.processStatus_Id;
                    });
                });
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
            
            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.cycleCount_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.cycleCount_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
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

            $scope.autoComplete = {
                cycleCount_No: "AutoCyclecount/autoCycleCountNo"
            };

            $scope.url = {
                Cyclecount: webServiceAPI.Cyclecount,
            };

            function initialize() {
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.dropdownDocumentType();
                $scope.dropdownStatus();
                $scope.filterModel.cycleCount_Date = getToday();
                $scope.filterModel.cycleCount_Date_To = getToday();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });







        }
    });

})();
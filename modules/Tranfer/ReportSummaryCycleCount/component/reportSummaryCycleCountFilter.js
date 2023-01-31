(function () {
    'use strict';
    app.component('reportSummaryCycleCountFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/ReportSummaryCycleCount/component/reportSummaryCycleCountFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, reportSummaryCycleCountFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = reportSummaryCycleCountFactory;
            var model = $scope.filterModel;

            $scope.status_Diff_Count = ["Diff","Complete"];

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
                debugger
                $vm.filterModel.cycleCount_Date = getToday();
                $vm.filterModel.cycleCount_Date_To = getToday();
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

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.filterSearch = function (param) {
                if($('input[name="datefilter"]').val().length > 0)
                {
                  $scope.filterModel.date = $('input[name="datefilter"]').val();
                }
                param.status_Diff_Count = $scope.status_Diff_Count.model;
                viewModel.setParam(param)
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel = param;
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage

                $scope.filterModel.documentType_Index = "A0C555F8-029B-481B-85D0-257797CD1C52";
                $scope.filterModel.documentType_Id = "CC03";
                $scope.filterModel.documentType_Name = "ตรวจนับประจำวัน";

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
                $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            }


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
                $scope.dropdownStatus();
                $scope.filterModel = {};
                $scope.filterModel.date = getToday();
                $scope.filterSearch($scope.filterModel)
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            





        }
    });

})();
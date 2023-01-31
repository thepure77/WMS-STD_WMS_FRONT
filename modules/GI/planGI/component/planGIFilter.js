(function () {
    'use strict';
    app.component('planGiFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/planGI/component/planGIFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, planGoodsIssueFactory, webServiceAPI, importFileFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = planGoodsIssueFactory;
            var model = $scope.filterModel;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };

            
            $scope.tranferGI = function () {
                viewModel.TransferGI().then(function (res) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: '',
                            message: res.data
                        }
                    )
                });
            };

            $scope.selectSort = [
                {
                    value: "PlanGoodsIssue_No",
                    display: "เลขที่ใบสั่งซื้อสินค้า"
                },
                {
                    value: "PlanGoodsIssue_Date",
                    display: "วันที่แจ้งสั่งซื้อสินค้า"
                },
                {
                    value: "DocumentType_Name",
                    display: "ประเภทเอกสาร"
                },
                // {
                //     value: "Qty",
                //     display: "จำนวน"
                // },
                {
                    value: "ProcessStatus_Name",
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
                    display: "รอยืนยัน"
                },
                {
                    value: 1,
                    display: "ยืนยัน"
                },
                {
                    value: 5,
                    display: "ค้างเบิก"
                },
                {
                    value: 3,
                    display: "เสร็จสิ้น"
                },
                {
                    value: 4,
                    display: "ปิดเอกสาร"
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
                $vm.filterModel.planGoodsIssue_Date = $vm.filterModel.planGoodsIssue_Date || getToday(true);
                $vm.filterModel.planGoodsIssue_Date_To = $vm.filterModel.planGoodsIssue_Date_To || getToday();
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
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
                
                if(!param.advanceSearch)
                {
                    
                    if($('input[name="datefilter"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilter"]').val();
                    }
                } else {
                    if($('input[name="datefilterAdv"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilterAdv"]').val();
                    }
                }
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

                if ($scope.filterModel.owner_Index != undefined) {
                    if ($scope.filterModel.owner_Index == "" || $scope.filterModel.owner_Index.length < 36) //|| $scope.filterModel.planGoodsReceive_Index.length < 36
                    {
                        $scope.filterModel.owner_Index = "00000000-0000-0000-0000-000000000000";
                    }
                }

                if ($scope.filterModel.planGoodsIssue_Index != undefined) {
                    if ($scope.filterModel.planGoodsIssue_Index == "" || $scope.filterModel.planGoodsIssue_Index.length < 36) //|| $scope.filterModel.planGoodsReceive_Index.length < 36
                    {
                        $scope.filterModel.planGoodsIssue_Index = "00000000-0000-0000-0000-000000000000";
                    }
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                if ($scope.dropdownStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
                }
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
                    debugger
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
                // $scope.filterModel.date = formatDate();
                // $scope.filterModel.dateDue = formatDate();
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

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            }

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


            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };
            $scope.dropdownStatus = function () {
                viewModel.dropdownStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownStatus = res.data;
                });
            };

            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
            };


            $scope.autoComplete = {
                autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
                owner: "AutoPlanGoodIssue/AutoOwnerfilter",
                planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
                user: "AutoPlanGoodIssue/autoUser",
                billing: "AutoPlanGoodIssue/AutoBilling_No",
                matdoc: "AutoPlanGoodIssue/AutoMatdoc_No",
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                TruckloadNo: "AutoLoad/autoTruckloadNo",

            };

            $scope.url = {
                PlanGI: webServiceAPI.PlanGI,
                GI: webServiceAPI.GI,
                Load: webServiceAPI.Load,
            };

            $scope.import = function () {
                importFileFactory.set("PlanGoodsIssue");
                $state.go('wms.import_file_summary');
            }


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssue_Date = getToday(true);
                $scope.filterModel.planGoodsIssue_Date_To = getToday();
                $vm.filterModel.planGoodsIssue_Date = getToday(true);
                $vm.filterModel.planGoodsIssue_Date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";
                $scope.dropdownDocumentType();
                $scope.dropdownStatus();
                $scope.dropdownRound();

                // initialize();
            };

        }
    });

})();
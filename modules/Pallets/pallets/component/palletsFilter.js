(function () {
    'use strict';
    app.component('palletsFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Pallets/pallets/component/palletsFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?',
            isFilterTable: '=?',
            isFilter: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, palletsFactory, webServiceAPI,importFileFactory) {
            var $vm = this;

            // ----------------------------------------------------
            var model = $scope.filterModel;
            var viewModel = palletsFactory;

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


            $scope.selectSort = [
                {
                    value: "PlanGoodsReceive_No",
                    display: "PO_NO"
                },
                {
                    value: "PlanGoodsReceive_Date",
                    display: "PLAN_DATE"
                },
                {
                    value: "DocumentType_Name",
                    display: "DOCUMENT_TYPE"
                },
                {
                    value: "ProcessStatus_Name",
                    display: "STATUS"
                },
                {
                    value: "Vendor_name",
                    display: "VENDER"
                }
            ];

            $scope.status = [
                {
                    value: 0,
                    display: "Wait_to_confirm"
                },
                {
                    value: 1,
                    display: "confirm"
                },
                {
                    value: 3,
                    display: "completed"
                },
                {
                    value: 4,
                    display: "Close_document"
                },
                {
                    value: -1,
                    display: "cancel"
                }
            ];
            
            $vm.triggerSearch = function () {
                $scope.filterSearch ();
            }
            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     $vm.filterModel.purchaseOrder_date = getToday();
            //     $vm.filterModel.purchaseOrder_date_To = getToday();
            //     $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
            //     pageLoading.show();
            //     viewModel.FilterSearch($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         if (res.data.items.length != 0) {
            //             $scope.filterModel.perPage = $vm.filterModel.perPage;
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;

            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             }

            //             $vm.searchResultModel = res.data.items;
            //         }
            //         else {
            //             $vm.searchResultModel = res.data.items;
            //         }
            //         let dataList = $vm.searchResultModel;
            //         for (var i = 0; i <= dataList.length - 1; i++) {
            //             $vm.searchResultModel[i].row = i + 1;
            //         }
            //         $vm.searchDataRow = dataList.length;
            //     });
            // };

            // Export Excel
            $scope.exportFile = {
                ExportExcel: function () {
                dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                }).then(function success() {
                    ExportExcel();
                })
                },
            }

            function ExportExcel() {
                
                var chk_date_null = 0;

                if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
                    $scope.convertDate();
                else
                    chk_date_null = 1;

                if(($scope.filterModel.start_Date == null || $scope.filterModel.start_Date == "" || $scope.filterModel.start_Date == undefined) || ($scope.filterModel.end_Date == null || $scope.filterModel.end_Date == "" || $scope.filterModel.end_Date == undefined))
                    chk_date_null = 1;

                if(chk_date_null == 1)
                {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาระบุวันที่',
                    })
                } 
                var deferred = $q.defer();
                $scope.filterModel.excelName = "Report Pallets";
                viewModel.ExportExcel($scope.filterModel).then(
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

            $scope.filter = function () {

                $scope.searchFilter();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };




           
            $scope.searchFilter = function () {
                var deferred = $q.defer();
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }

                pageLoading.show()
                viewModel.Filter($scope.filterModel).then(
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
                $scope.filterModel.is_sum = true;
                if ($scope.filterModel.vender_Index == "") {
                    $scope.filterModel.vender_Index = "00000000-0000-0000-0000-000000000000";
                }

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

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.start_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.end_Date = YEnd.toString() + MEnd.toString() + DEnd.toString();
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


            $scope.autoComplete = {
                vendor: "Autocomplete/autoVendor",
            };
            $scope.url = {
                Palletmanage: webServiceAPI.Palletmanage,
            };           
            $scope.import = function(){
                importFileFactory.set("PlanGoodsReceive");
                $state.go('wms.import_file_summary');
            }

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.purchaseOrder_date = getToday();
                $scope.filterModel.purchaseOrder_date_To = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";
                $scope.filterModel.date = formatDate();
                $scope.filterSearch ();
                // $scope.dropdownDocumentType();
                // $scope.dropdownStatus();
            };

        }
    });

})();
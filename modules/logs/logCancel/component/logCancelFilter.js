
(function () {
    'use strict';
    app.component('logCancelFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/logs/logCancel/component/logCancelFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, logCancelFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = logCancelFactory;

            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.status = [
                {
                    value: 'ส่ง',
                    display: "ส่ง"
                },
                {
                    value: 'ตอบกลับ',
                    display: "ตอบกลับ"
                },
                {
                    value:'ส่งไม่สำเร็จ',
                    display:"ส่งไม่สำเร็จ"
                }
                
            ];

            $scope.status_SAP = [
                {
                    value: '1',
                    display: "1"
                },
                {
                    value: '-1',
                    display: "-1"
                },
                {
                    value: 'E',
                    display: "E"
                },
                {
                    value: 'C',
                    display: "C"
                },
                {
                    value: 'P',
                    display: "P"
                },
                {
                    value: 'EV',
                    display: "EV"
                },
                
            ];

            // $vm.triggerSearch = function () {
            //     debugger
            //     $vm.filterModel = $vm.filterModel || {};
            //     $vm.filterModel.create_Date = $vm.filterModel.create_Date || getToday();
            //     $vm.filterModel.create_Date_To = $vm.filterModel.create_Date_To || getToday();
            //     pageLoading.show();
            //     viewModel.filterCancel($vm.filterModel).then(function (res) {
            //         $vm.filterModel.create_Date = getToday();
            //         pageLoading.hide();
            //         if (res.data.itemsLogCancel.length != 0) {
            //             $vm.filterModel.perPage = $vm.filterModel.perPage;
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;

            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             }
            //             $vm.searchResultModel = res.data.itemsLogCancel;
            //         }
            //         else {
            //             $vm.searchResultModel = res.data.itemsLogCancel;
            //         }

            //         let dataList = $vm.searchResultModel;
            //         for (var i = 0; i <= dataList.length - 1; i++) {
            //             $vm.searchResultModel[i].row = i + 1;
            //         }
            //         $vm.searchDataRow = dataList.length;
            //     });
            // };

            // //ตัวคุม ปุ่ม status
            // $scope.filterCancel = function () {
            //     $vm.triggerSearch();
            // };

            $scope.filterSearch = function () {
                debugger
                
                $scope.convertDate();
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.create_Date = $scope.filterModel.create_Date || getToday();
                $scope.filterModel.create_Date_To = $scope.filterModel.create_Date_To|| getToday();
                pageLoading.show();
                viewModel.filterCancel($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.create_Date = getToday();
                    if (res.data.itemsLogCancel.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsLogCancel;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsLogCancel;
                    }

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                });
            };




        
            $scope.autoComplete = {
                basicSearch: "GoodsReceive/autobasicSuggestion",
                autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
                autoProduct: "Autocomplete/autoProductId",
                TruckloadNo: "AutoLoad/autoTruckloadNo",
                autoSuggestion: "AutoPlanGoodIssue/AutobasicSuggestion",
                shipToName: "autoShipTo/autoSearchShipToFilter",
                planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",     
                autoPo: "Autocomplete/AutobasicSuggestion",
                autoPoV2: "Autocomplete/autobasicSuggestionPO",
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
        
                AutoSearchDocument:"Autocomplete/AutoSearchDocument"
              };
        
              $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
                GR: webServiceAPI.GR,
                Master: webServiceAPI.Master,
                PO: webServiceAPI.PO,
                PlanGI: webServiceAPI.PlanGI,
                GI: webServiceAPI.GI,
                Load: webServiceAPI.Load,

                // AutoSearchDocument : webServiceAPI.AutoSearchDocument,
              };
            
              $scope.exportFile = {

                ExportExcel: function () {
                  dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                  }).then(function success() {
                    ExportNew();
                  })
                },
              }
        
              function ExportNew() {
                  debugger
                if ($scope.filterModel.date != null) {
                  $scope.convertDate();
                }
                pageLoading.show();
                var deferred = $q.defer();
                $scope.filterModel.excelName = "Log Cancel";
                viewModel.Export($scope.filterModel).then(
                  function success(results) {
                    pageLoading.hide();
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
                debugger
                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.create_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.create_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
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

            this.$onDestroy = function () {
            };
            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_Date_To = getToday();
                initialize();
            };

        }
    });

})();
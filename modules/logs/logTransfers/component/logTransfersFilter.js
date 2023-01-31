(function () {
    'use strict';
    app.component('logTransfersFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/logs/logTransfers/component/logTransfersFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, logTransfersFactory, webServiceAPI , dpMessageBox) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object

            var viewModel = logTransfersFactory;

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

            //     $vm.filterModel = $vm.filterModel || {};
            //     $vm.filterModel.Goodstransfer_Due_Date = $vm.filterModel.Goodstransfer_Due_Date || getToday();
            //     $vm.filterModel.Goodstransfer_Due_Date_To = $vm.filterModel.Goodstransfer_Due_Date_To|| getToday();
            //     pageLoading.show();
            //     viewModel.filter($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel.Goodstransfer_Due_Date = getToday();
            //         if (res.data.itemsLogtf.length != 0) {
            //             $vm.filterModel.perPage = $vm.filterModel.PerPage;
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             $vm.filterModel.currentPage = res.data.pagination.currentPage;

            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             }

            //             $vm.searchResultModel = res.data.itemsLogtf;
            //         }
            //         else {
            //             $vm.searchResultModel = res.data.itemsLogtf;
            //         }

            //         let dataList = $vm.searchResultModel;
            //         for (var i = 0; i <= dataList.length - 1; i++) {
            //             $vm.searchResultModel[i].row = i + 1;
            //         }
            //         $vm.searchDataRow = dataList.length;

            //     });
            // };


            // $scope.filter = function () {
            //     $vm.triggerSearch();
            // };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }

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
                $scope.filterModel.Goodstransfer_Due_Date = $vm.filterModel.Goodstransfer_Due_Date || getToday();
                $scope.filterModel.Goodstransfer_Due_Date_To = $vm.filterModel.Goodstransfer_Due_Date_To|| getToday();
                debugger
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.searchFilter($scope.filterModel).then(function success(res) {

                    $vm.searchResultModel = res.data.itemsLogtf;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;

                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                }, function error(res) { });
            };

            $scope.autoComplete = {
                autoGT: "AutoGoodsTransfer/autoGoodsTransferNo",
            };
            

            $scope.exportFile = {

                Export: function () {
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
                $scope.filterModel.excelName = "Log Transfer";
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

            $scope.url = {
                GT: webServiceAPI.GT,
                Master: webServiceAPI.Master,
            };

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;
                    debugger

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.Goodstransfer_Due_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.Goodstransfer_Due_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };



            // -----------------SET DAY default-----------------//
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


            // ----------------------------------------------------
            // This local function
            function initialize() {
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.Goodstransfer_Due_Date = getToday();
                $scope.filterModel.Goodstransfer_Due_Date_To = getToday();
                initialize();
            };
        }
    });

})();
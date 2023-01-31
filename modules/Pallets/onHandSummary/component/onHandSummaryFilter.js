(function () {
    'use strict';
    app.component('onHandSummaryFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Pallets/onHandSummary/component/onHandSummaryFilter.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,onHandSummaryFactory,/*soldToFactory*/webServiceAPI,dpMessageBox) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = onHandSummaryFactory;
            //var viewModelSoldTo = soldToFactory;
            //$scope.filterModel = {};
            $scope.dropdownVendor = [];
           // $scope.filterModel.showDetail = [];
            $scope.vendorList = [];
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.headerNodata = [                
                 "NO DATA"
            ];

            $scope.exportModel = {};
            $scope.header = {
                advanceSearch: false
            };
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
                $scope.exportModel = {};
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };

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
           
            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
        
                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            }

            $scope.searchFilter = function () {

                var chk_date_null = 0;
                if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
                    $scope.convertDate();
                else
                    chk_date_null = 1;

                if(($scope.filterModel.start_Date == null || $scope.filterModel.start_Date == "" || $scope.filterModel.start_Date == undefined) || ($scope.filterModel.end_Date == null || $scope.filterModel.end_Date == "" || $scope.filterModel.end_Date == undefined))
                    chk_date_null = 1;

                if(chk_date_null == 1){
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาระบุวันที่',
                    })
                }
                $scope.filterModel.listVendor = $scope.vendorList;
                pageLoading.show();
                $scope.filterModel.pttor = {};
                $scope.filterModel.supplier = {};
                viewModel.filter($scope.filterModel).then(function (res) {
                    if(res.data.pttor_data != null)
                    {
                        if(res.data.pttor_data.header == null)
                        {        
                            $scope.filterModel.pttor = {header:[]};
                            $scope.filterModel.pttor.header =  $scope.headerNodata;
                            $scope.filterModel.sumdmg_or = "";
                        }
                        else
                        {
                            $scope.filterModel.pttor = res.data.pttor_data;
                            $scope.filterModel.sumdmg_or = res.data.sumdmg_or;
                        }
                    }
                    else
                    {
                        $scope.filterModel.pttor = {header:[]};
                        $scope.filterModel.pttor.header =  $scope.headerNodata;
                    }

                    if(res.data.supplier_data != null)
                    {
                        if(res.data.supplier_data.header == null)
                        {
                            $scope.filterModel.supplier = {header:[]};
                            $scope.filterModel.supplier.header = $scope.headerNodata;
                            $scope.filterModel.sumdmg_supplier = "";
                        }
                        else
                        {
                            $scope.filterModel.supplier = res.data.supplier_data;
                            $scope.filterModel.sumdmg_supplier = res.data.sumdmg_supplier;
                        }
                    }
                    else
                    {
                        $scope.filterModel.supplier = {header:[]};
                        $scope.filterModel.supplier.header = $scope.headerNodata;
                    }
                    pageLoading.hide();
                   
                });
            };
           
            
            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.dropdownVendor = function () {
                viewModel.dropdownVendor($scope.filterModel).then(function (res) {
                    $scope.dropdownVendor = res.data;
                });
            };

            $scope.autoComplete = {
                vendor: "Autocomplete/autoVendor",
            };         


            $scope.url = {
                Master: webServiceAPI.Master,
                Palletmanage: webServiceAPI.Palletmanage,
            };           

            $scope.vendorPopupFilter = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.vendorPopupFilter.onShow = !$scope.vendorPopupFilter.onShow;
                    $scope.vendorPopupFilter.delegates($scope.vendorList);
                },
                config: {
                    title: ""
                },
                invokes: {                   
                    selected: function (param) {     
                        $scope.vendorList = angular.copy(param); 
                        $scope.filterModel.vendor_text = '';
                        angular.forEach(param, function (item, index) {
                            if( $scope.filterModel.vendor_text == '' || $scope.filterModel.vendor_text == undefined)
                            {
                                $scope.filterModel.vendor_text = item.name;
                            }
                            else
                            {
                                $scope.filterModel.vendor_text = $scope.filterModel.vendor_text + " , " + '\n' + item.name;
                            }
                        });                        
                    }
                }
            };

            $scope.exportFile = function () {
                dpMessageBox.confirm({
                    title: 'Confirm.',
                    message: 'Do you want to download?'
                }).then(function success() {
                    ExportReport();
                })
            };
            function ExportReport() {
                var chk_date_null = 0;
                if ($scope.filterModel.date != null && $scope.filterModel.date != "" && $scope.filterModel.date != undefined ) 
                    $scope.convertDate();
                else
                    chk_date_null = 1;

                if(($scope.filterModel.start_Date == null || $scope.filterModel.start_Date == "" || $scope.filterModel.start_Date == undefined) || ($scope.filterModel.end_Date == null || $scope.filterModel.end_Date == "" || $scope.filterModel.end_Date == undefined))
                    chk_date_null = 1;

                if(chk_date_null == 1){
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาระบุวันที่',
                    })
                }
                $scope.filterModel.listVendor = $scope.vendorList;
                pageLoading.show();
                var deferred = $q.defer();
               
                var filename =  "OnHandSummary_" + getToday();
                $scope.filterModel.excelName =  filename;
                viewModel.ExportReport($scope.filterModel).then(
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
            };

            $scope.functiontype = function(param){
                if(param == "01")
                {
                    $scope.vendorList = [];
                    $scope.filterModel.vendor_text = "";
                }
            };
            
            // ----------------------------------------------------
            // This local function
            // $vm.setDateFormate = function (v) {
            //     try {
            //         return $filter("dateFormate")(v);
            //     } catch (e) {
            //         return "-";
            //     }
            // }

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
                $scope.filterModel = {
                    showDetail:[]
                };
                $scope.filterModel.pttor = {header:[]};
                $scope.filterModel.pttor.header =  $scope.headerNodata;
                $scope.filterModel.supplier = {header:[]};
                $scope.filterModel.supplier.header = $scope.headerNodata;
                $scope.filterModel.start_Date = getToday();
                $scope.filterModel.end_Date = getToday();
                $scope.filterModel.date = formatDate();
                $scope.dropdownVendor();
            };

            // this.$onDestroy = function () {
            // };

            // $scope.$on('$destroy', function () {
            //     $vm.$onDestroy();
            // });
        }
    });

})();
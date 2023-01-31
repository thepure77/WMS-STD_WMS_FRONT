(function () {
    'use strict';
    app.component('productConversionFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductConversion/component/productConversionFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isItem: "=?"
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, productConversionFactory,productFactory,productConversionBarcodeFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = productConversionFactory;
            var viewModelProduct = productFactory;
            var viewModelProductConversionBarcode = productConversionBarcodeFactory;

            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.header = {
                advanceSearch: false
            };
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $vm.triggerSearch = function() {
                var ProductId = productFactory.get();
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.product_Id = ProductId;
                $scope.filterModel.key = ProductId;
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    productFactory.set();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    } else {
                        $vm.searchResultModel = res.data.itemsProductConversion;
                    }
                });
            };

            $scope.searchFilter = function(param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;

                        }

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    } else {

                        $vm.searchResultModel = res.data.itemsProductConversion;
                    }
                });
            };

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };
            $scope.import = function(){
                importFileMasterFactory.set("Import_ArticleConversion");
                $state.go('wms.import_file_master_summary');
            }

            $scope.autoComplete = {
                productConversion: "Autocomplete/autoSearchProductConversion",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            // $vm.triggerSearch = function () {               
            //     // $vm.filterModel = {};
            //     pageLoading.show();          
            //     let productIndex = viewModel.getParam();         
            //     if (productIndex != undefined) {   
            //         viewModel.getIndex(productIndex).then(function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;           
            //             $vm.searchResultModel = res.data.items;                                
            //             // window.history.replaceState({}, document.title, "/" + "modules/masterData/masterProductConversion/productConversionSummary.html");             
            //         });
            //     }
            //     else 
            //     {
            //         if($scope.filterModel != undefined)
            //         {
            //             $vm.filterModel.productConversionId = $scope.filterModel.productConversionId || "";
            //             $vm.filterModel.productConversionName = $scope.filterModel.productConversionName || "";
            //             $vm.filterModel.productName = $scope.filterModel.productName || "";
            //         }
                    
            //         viewModel.search($vm.filterModel).then(function (res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;                 
            //             $vm.searchResultModel = res.data.items;

            //         });
            //     }

            // };
            // $scope.model = {
            //     currentPage: 1,
            //     numPerPage: 30,
            //     PerPage: 30,
            //     totalRow: 0,
            //     maxSize: 5
            // };
            // $scope.searchFilter = function (param) {
            //     var deferred = $q.defer();
            //     var item = $scope.actionPS;
            //     var Data = param;
            //     switch (item) {
            //         case "1": {                       
            //             Data.productConversionId;
            //             Data.productName = ""
            //             Data.productConversionName = ""
            //         }
            //         break;
            //         case "2": {
            //             Data.productConversionName;
            //             Data.productConversionId= ""
            //             Data.productName = ""
                        
            //         }
            //         break;
            //         case "3": {
            //             Data.productName;
            //             Data.productConversionId = ""
            //             Data.productConversionName = ""
            //         }
            //         break;
            //     }
            //     viewModel.search(Data).then(
            //         function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow =  res.data.pagination.totalRow;
            //             $vm.searchResultModel = res.data.items;
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // };

            // $scope.filter = function () {
                
            //     $vm.filterModel = {};
            //     pageLoading.show();       
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };

            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };


            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
                viewModelProduct.set();
                viewModel.set();
                viewModelProductConversionBarcode.set();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();
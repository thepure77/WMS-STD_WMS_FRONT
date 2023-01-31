(function () {
    'use strict';
    app.component('ownerSoldtoFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterOwnerSoldTo/component/ownerSoldtoFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,ownerSoldToFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = ownerSoldToFactory;

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
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsOwnerSoldTo;
                    } else {
                        $vm.searchResultModel = res.data.itemsOwnerSoldTo;
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

                        $vm.searchResultModel = res.data.itemsOwnerSoldTo;
                    } else {

                        $vm.searchResultModel = res.data.itemsOwnerSoldTo;
                    }
                });
            };

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                ownerSoldTo: "Autocomplete/autoSearchOwnerSoldTo",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };


            // $vm.triggerSearch = function () {
            //     $vm.filterModel =  $vm.filterModel || {};                
            //     pageLoading.show();  
            //     viewModel.filter($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data.atcom;
            //         $vm.searchResultModel = res.data;
            //     });;
            // };

            // $scope.model = {
            //     ownerSoldToId: "",
            //     ownerName: "",      
            //     soldToName: "",     
            // };
            // $scope.searchFilter = function (item) {
            //     var deferred = $q.defer();
            //     if(item == undefined){
            //         item = $scope.model;
            //     };
            //     if(item.ownerSoldToId == "" || item.ownerName == "" || item.soldToName == ""){
            //         item = $scope.model;
            //     }
            //     viewModel.search(item).then(
            //         function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel = res.data;
            //             $vm.searchResultModel = res.data;
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });
            //     return deferred.promise;
            // };

            // $scope.filter = function () {
            //     $vm.triggerSearch();
            // };

            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };
            
            // $scope.autoComplete = {
            //     orderNo: "domesticLoadingItems/orderNo",
            //     SoNo: "domesticLoadingItems/SoNo",
            //     Plant: "domesticLoadingItems/Plant",
            //     OMSJobNo: "domesticLoadingItems/OMSJobNo",
            //     Material: "domesticLoadingItems/Material",
            //     Lot: "domesticLoadingItems/Lot",
            //     Customer: "domesticLoadingItems/Customer",
            //     DSNo: "domesticLoadingItems/DSNo",
            //     coloadNo: "domesticLoadingItems/coloadNo",
            //     basic: "DomesticPlantSelected/basicSuggestion",
            //     materialCode: "ExportPlantSelected/materialCode",
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
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();
(function () {
    'use strict';
    app.component('zoneLocationFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZoneLocation/component/zoneLocationFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,zoneLocationFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = zoneLocationFactory;

            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
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

                        $vm.searchResultModel = res.data.itemsZoneLocation;
                    } else {
                        $vm.searchResultModel = res.data.itemsZoneLocation;
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

                        $vm.searchResultModel = res.data.itemsZoneLocation;
                    } else {

                        $vm.searchResultModel = res.data.itemsZoneLocation;
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
                zoneLocation: "Autocomplete/autoSearchZoneLocation",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };


            // $vm.triggerSearch = function () {                
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.search($vm.filterModel).then(function (res) {                    
            //         pageLoading.hide();
                    
            //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //         $vm.filterModel.currentPage = res.data.pagination.currentPage;
            //         $vm.filterModel.perPage = res.data.pagination.perPage;
            //         $vm.filterModel.numPerPage = res.data.pagination.perPage;
            //         $vm.searchResultModel = res.data.items;
            //     });
            // };
            // $scope.model = {
            //     zoneLocationId: "",
            //     zoneName: "",
            //     locationName: "",                   
            // };
            // $scope.searchFilter = function (item) {                
            //     var deferred = $q.defer();
            //     if(item == undefined){
            //         item = $scope.model;
            //     };
            //     if(item.zoneLocationId == "" || item.zoneName == "" || item.locationName == "" ){
            //         item = $scope.model;
            //     }
            //     item.totalRow = $vm.filterModel.totalRow;
            //     item.currentPage = $vm.filterModel.currentPage;
            //     item.perPage = $vm.filterModel.perPage;
            //     item.numPerPage = $vm.filterModel.numPerPage;
            //     item.maxSize = $vm.filterModel.maxSize;
            //     $vm.filterModel = item;
            //     viewModel.search(item).then(
            //         function success(res) {
            //             pageLoading.hide();
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             $vm.filterModel.currentPage = res.data.pagination.currentPage;
            //             $vm.filterModel.perPage = res.data.pagination.perPage;
            //             $vm.filterModel.numPerPage = res.data.pagination.perPage;
            //             $vm.searchResultModel = res.data.items;
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
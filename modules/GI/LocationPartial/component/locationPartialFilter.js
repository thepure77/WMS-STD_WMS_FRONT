(function () {
    'use strict';
    app.component('locationPartialFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/LocationPartial/component/locationPartialFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, locationPartialFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = locationPartialFactory;


            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };


            $vm.triggerSearch = function () {
                $scope.filterSearch();
            };

            $scope.filterSearch = function () {
                pageLoading.show();
                viewModel.checkWaveWCS_location($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    
                    if ($vm.searchResultModel == undefined) {
                        $vm.searchResultModel = {};
                    }
                    $vm.searchResultModel.checklocation_PPmodel = res.data.itemModel;

                }, function error(res) { });
            };

            $scope.remarkPopup = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    pageLoading.show();
                    // var let = $vm.searchResultModel;
                    // $scope.filterModel = let;
                    $scope.remarkPopup.onShow = !$scope.remarkPopup.onShow;
                    $scope.remarkPopup.delegates($vm.searchResultModel.checklocation_PPmodel);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) {
                        pageLoading.show();
                        $scope.userName = localStorageService.get('userTokenStorage');
                        // param.Create_by = $scope.userName;
                        $scope.modelCreate = {};
                        $scope.modelCreate.ItemModel = param;
                        $scope.modelCreate.Create_by = $scope.userName;

                        viewModel.create_bypass($scope.modelCreate).then(function success(res) {
                            pageLoading.hide();
                            
                            if (res.data.resultIsUse) {
                                return dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.resultMsg
                                })
                            }else{
                                 return dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.resultMsg
                                })
                            }
        
                        }, function error(res) { });
                    },
                    edit: function () { },
                    selected: function (param) {
                        debugger
                        if(!param){
                            return dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Information.',
                                message: 'มี Pallet ที่รอเข้า robot กรุ'
                            })
                        }

                    }
                }
            };

            this.$onInit = function () {
                $scope.filterModel = {};
            };


        }
    });

})();
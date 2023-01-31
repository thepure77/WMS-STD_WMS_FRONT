(function () {
    'use strict'
    app.component('transferLpnList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferPallet/component/transferLpnList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $state, pageLoading, commonService, localStorageService, $timeout, $translate, dpMessageBox, tranferPalletFactory) {
            var $vm = this;
            var defer = {};
            let viewModelTransferPallet = tranferPalletFactory
            // setting column     
              
            $scope.isLoading = false;

            $vm.isLoading = function (datalist, items, newItems , sumQty) {
                defer = $q.defer();
                
                $vm.searchResultModel = datalist;
                $scope.filterModel = items;
                $vm.filterModel = newItems;
                //$scope.SumModel = sumQty;
                $scope.isLoading = true;    

                return defer.promise;
            };

            $scope.checkProduct = function (param) {
                for (let index = 0; index < $vm.searchResultModel.length; index++) {
                    if (index != param) {
                        $vm.searchResultModel[index].selected = false;
                    } else
                    {
                        $vm.searchResultModel[index].selected = true;
                    }

                }

            }
            

            $scope.selectTask = function () {
                defer.resolve('Selected');
            }

            $scope.back = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }

                defer.resolve();
            }
            
            $scope.select = function () {
                var modelSelected = $vm.searchResultModel.filter(c => c.selected == true);
                
                if(modelSelected.length > 0)
                {
                    angular.forEach(modelSelected, function (v, k) {
                        modelSelected[k].pick = modelSelected[k].binBalance_QtyBal - modelSelected[k].binBalance_QtyReserve;
                    });
                }
                
                $scope.filterModel.lstPickProduct = modelSelected;
                viewModelTransferPallet.setParam($scope.filterModel);
                defer.resolve();
                
            }
            

            $scope.detectCheckAll = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = true;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }
            }

            var init = function () {
            };
            init();

        }
    })
})();
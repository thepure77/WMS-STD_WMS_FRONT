(function () {
    'use strict'

    app.component('expected', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/Expected/Expected.html",
        bindings: {
            expected: '=?',
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,expectedFactory,loadTruckItemFactory,scanLoadToTruckFactory) {
            var $vm = this;

            var viewModel = expectedFactory;
            var scanLoadToTruckviewModel = scanLoadToTruckFactory;
            //var loadTruckviewModel = loadTruckItemFactory;
            $scope.isFilter = true;
            var defer = {};
            $scope.filterModel = {};
            $scope.expected = false;
            

            var model = $scope.filterModel;

            $scope.ScanSoNo = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendSoNo($vm.filterModel).then(function success(res) {
                    $vm.filterModel.pickTicket = res.data[0].pickTicket;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendSoNo = function (model) {
                var deferred = $q.defer();
                viewModel.ScanSoNo(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanCartonQty = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendcartonQty($vm.filterModel).then(function success(res) {
                    $vm.filterModel.cartNumber = res.data[0].cartNumber;
                },
                    function error(res) {

                    });
            }
            $scope.SendcartonQty = function (model) {
                var deferred = $q.defer();
                viewModel.cartonQty(model).then(
                    function success(res) {

                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanCarton = function () {
                $vm.filterModel = {};
                $vm.filterModel.truckLoadNo = $scope.filterModel.truckLoadNo;
                $vm.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                $scope.SendCarton($vm.filterModel).then(function success(res) {
                    
                    if(res.data == 'S')
                    {
                        dpMessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "Scan carton success!!"
                        })
                    } else if(res.data == 'CartonEmpty')
                    {
                        dpMessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "Carton is empty!!"
                        })
                    } else {
                        dpMessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "Cannot scan "
                        })
                    }
                    
                    $vm.expected($vm.filterModel);
                    $scope.filterModel.tagOutNo = '';
                },
            
                function error(res) {

                });
                
            }
            $scope.SendCarton = function (model) {
                var deferred = $q.defer();
                scanLoadToTruckviewModel.ScanCarton(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $vm.expected = function (param) {
                
                $scope.filterModel = param;
                var truckLoadNo = $scope.filterModel.truckLoadNo;
                defer = $q.defer();
                $scope.expected = true;
                if (param != undefined) {
                    if(truckLoadNo != undefined)
                    {
                        var model = $scope.filterModel;
                        viewModel.getExpectedRF(truckLoadNo).then(function (res) {
                            $vm.filterModel = res.data;
                            $vm.searchResultModel = res.data;
                        });
                    }

                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }

                return defer.promise;
            };

            $scope.back = function () {
                $state.reload();
                $scope.filterModel = {};
                $scope.expected = false;
                defer.resolve('-1');     
            }

            $scope.buttons = {
                back: true
            };

            $scope.getColor = function (IsCartonEmpty) {
                if (IsCartonEmpty == 1) {
                    //return "background:rgb(220, 20, 60);color:rgb(255, 255, 255)";
                    return "color:rgb(255, 0, 0)";
                }
            }
        }
    })
})();
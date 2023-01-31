(function () {
    'use strict'

    app.component('productLocationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/masterData/masterProductLocation/component/productLocationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productLocationFactory,webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = productLocationFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.productLocation_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsZoneLocation;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
        
                if (model.product_Index == undefined || model.product_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Product is required !!'
                    })
                    return "";
                }
                if (model.location_Index == undefined || model.location_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Location is required !!'
                    })
                    return "";
                }
                if(model.qty > model.replenish_Qty)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Please check Min and Max'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {
debugger
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                                pageLoading.hide();
                            }
                            if(res.data == "LocationDup")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Location Have use'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'error',
                                message: 'Save error'
                            })
                        });
                    });
                }
            }

            //ย้อนกลับ
            $scope.back = function() {
                defer.resolve('1');
            }
            //function Add
            function Add(param) {
                var deferred = $q.defer();
                viewModel.SaveChanges(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            //sourceurl autocomplete
            $scope.autoComplete = {
                locationPickFace:"Autocomplete/autoLocationAndLocationIdPickFace",
                zone: "Autocomplete/autoZoneAndZoneId",
                location: "Autocomplete/autoLocationAndLocationId",
                product: "Autocomplete/autoProductAndProductId",
                sku: "AutoPlanGoodsReceive/autoSkufilter",
            };

            //url webServiceAPI.Master
            $scope.url = {
                Master: webServiceAPI.Master,
                PlanGR: webServiceAPI.PlanGR
            };

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();

        }
    })
})();
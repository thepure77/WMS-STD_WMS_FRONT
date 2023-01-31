(function () {
    'use strict';
    app.component('trackingLoadingSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/TrackingLoading/trackingLoadingSummary/trackingLoadingSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, trackingLoadingFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = trackingLoadingFactory;
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};

            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Product Header"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Product Detail",
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Receive Product"
                }
            ];

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }


            $scope.back = function () {
                // $scope.filterModel2 = {};
                let i = $scope.menu.indexOf($scope.menu.find(c => c.active == "active"));
                // $scope.menu.map(c => c.active == "active" ? c.active = "" : c.active = "");
                $scope.menu[i].active = "";
                $scope.menu[i].completed = "";
                $scope.menu[i - 1].active = "active";
                $scope.menu_width = (i - 1) * 50; //กำหนดความกว้างของเส้นเชื่อม
            }

            $scope.next = function () {

               
            }

            $scope.scan_shipment = function () {
                var deferred = $q.defer();
                var model = {};
                model.shipment_no = $scope.filterModel.shipment_no;
                pageLoading.show();
                viewModel.scan_shipment(model).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.resultIsUse == true) {
                            $scope.filterModel.truckLoad_Index = res.data.resultMsg;
                        }else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.resultMsg
                            })
                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: "error"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.savetracking = function () {

                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'MSG_Confirm_Save'
                }).then(function () {
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    viewModel.savetracking($scope.filterModel).then(
                        function success(res) {
                            if (res.data.resultIsUse == true) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Success"
                                })
                            }else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                })
                            }
                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'MSG_Save_error'
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };

            $scope.filterGRItem = function () {
                viewModel.filterGRItem($scope.filterModel).then(function (res) {
                    $scope.listfilterModel = res.data;

                    let dataList = $scope.listfilterModel;

                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $scope.listfilterModel[i].qty = parseFloat($scope.listfilterModel[i].qty);
                    }

                });
            };

            $scope.masterRequirePopup = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.masterRequirePopup.onShow = !$scope.masterRequirePopup.onShow;
                    $scope.masterRequirePopup.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        debugger
                        $scope.filterModel.mFG_Date = angular.copy(param.mFG_Date)
                        $scope.filterModel.eXP_Date = angular.copy(param.eXP_Date)
                        $scope.filterModel.product_Lot = angular.copy(param.lot)
                    }
                }
            };


            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tag_no"]');
                    focusElem[0].focus();
    
                }, 200);
            }







        }
    })
})();
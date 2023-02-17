(function () {
    'use strict';
    app.component('pickToLightSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/PickToLight/PickToLightSummary/PickToLightSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, PickToLightFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = PickToLightFactory;

            $scope.filterModel = {};

            //#region scantag_no
            $scope.scantag_no = function () {
                var deferred = $q.defer();
                pageLoading.show();

                viewModel.scantag_no($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (!res.data.resultIsUse) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.resultMsgremain == 0
                            })
                            $scope.listfilterModel = [];
                        } else {
                            $scope.filterModel.tagOut_Index = res.data.resultMsg;

                            viewModel.DetailScanPicktolight(res.data).then(
                                function success(res) {

                                    if (!res.data.resultIsUse) {
                                        return dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'ALERT',
                                                message: res.data.resultMsg
                                            }
                                        )
                                    }
                                    $scope.listTagOut_CheckViewModel = res.data.listTagOut_CheckViewModel;
                                    $scope.listTagOut_UnCheckViewModel = res.data.listTagOut_UnCheckViewModel;
                                    $scope.filterModel.soldto = res.data.soldto;

                                    $scope.filterModel.sizebox = res.data.size;
                                    if ($scope.listTagOut_UnCheckViewModel.length <= 0) {
                                        $scope.block = false;
                                    }

                                    debugger
                                    if ($scope.listTagOut_UnCheckViewModel.length > 0) {
                                        $scope.listTagOut_UnCheckViewModel.forEach(e => {
                                            if (e.remain == 0) {
                                                e.isUser = true;
                                            }

                                        });
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
                                });
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.product_barcode"]');
                                focusElem[0].focus();

                            }, 200);
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
            //#endregion

            //#region scanBarcode_no
            $scope.scanBarcode_no = function () {
                var deferred = $q.defer();
                pageLoading.show();
                $scope.filterModel.update_By = localStorageService.get('userTokenStorage');
                viewModel.scanBarcode_no($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (!res.data.resultIsUse) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.resultMsg
                            })
                        } else {
                            $scope.filterModel.pickQty = 1;
                            $scope.filterModel.product_barcode = undefined;
                            $scope.scantag_no();
                            // $scope.listTagOut_CheckViewModel = res.data.listTagOut_CheckViewModel;
                            // $scope.listTagOut_UnCheckViewModel = res.data.listTagOut_UnCheckViewModel;
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
            //#endregion

            //#region  confirmPicktoLight
            $scope.confirmPicktoLight = function () {
                $scope.block = true;
                if ($scope.filterModel.tagOut_No == undefined || $scope.filterModel.tagOut_No == "") {
                    $scope.block = false;
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: "ไม่พบ tag ที่ค้นหา"
                    })
                }


                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'MSG_Confirm_Save'
                }).then(function () {
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    viewModel.confirmPicktoLight($scope.filterModel).then(
                        function success(res) {
                            $scope.block = false;
                            if (!res.data.resultIsUse) {
                                $scope.block = false;
                                $scope.listfilterModel = res.data.models;
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                })

                            } else {
                                $scope.filterModel.pickQty = 1;
                                $scope.listTagOut_CheckViewModel = undefined;
                                $scope.listTagOut_UnCheckViewModel = undefined;
                                $scope.filterModel.product_barcode = undefined;
                                $scope.filterModel.tagOut_No = undefined;
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Success"
                                })
                            }
                        },
                        function error(response) {
                            $scope.block = false;
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
            //#endregion

            //#region  chkIsuse
            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#858585"
                }
            }
            //#endregion 

            //#region onInit
            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.block = true;
                $scope.filterModel.pickQty = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tagOut_No"]');
                    focusElem[0].focus();

                }, 200);
            }
            //#endregion

        }
    })
})();
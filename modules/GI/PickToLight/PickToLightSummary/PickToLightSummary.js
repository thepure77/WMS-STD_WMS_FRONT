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
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.select = function (param) {

                // let data = $scope.listfilterModel.find(c => c.isUser);
                // if (data) {
                //     data.isUser = false;
                // }
                // param.isUser = true;
                if (param.isUser == undefined || param.isUser == false) {
                    param.isUser = true;
                } else if (param.isUser != undefined && param.isUser == true) {
                    param.isUser = false;
                }
            }

            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#99FF66"
                }
            }

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
                                message: res.data.resultMsg
                            })

                            $scope.size = undefined;
                            $scope.total_qty = undefined;
                            $scope.filterModel.tagOut_No = undefined;
                            $scope.listfilterModel = [];
                        } else {
                            $scope.filterModel.tagOut_Index = res.data.resultMsg;

                            viewModel.DetailScanPicktolight(res.data).then(
                                function success(res) {

                                    if (res.data.length > 0) {
                                        $scope.listfilterModel = res.data;
                                        $scope.size = res.data[0].size
                                        $scope.total_qty = res.data[0].total_qty
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

            $scope.scanBarcode_no = function () {
                var deferred = $q.defer();
                pageLoading.show();
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
                            $scope.filterModel.tagOutItem_Index = res.data.resultMsg;
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

            $scope.incompletePopup = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.incompletePopup.onShow = !$scope.incompletePopup.onShow;
                    $scope.incompletePopup.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.approve(param);
                    }
                }
            };


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


                let data = $scope.listfilterModel.filter(c => c.isUser);
                if (data.length != $scope.listfilterModel.length) {
                    $scope.block = false;
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: "กรุณาเลือก ทุก item เพื่อยืนยัน"
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
                            
                            if (!res.data.resultIsUse) {
                                $scope.block = false;
                                $scope.listfilterModel = res.data.models;
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                })

                            } else {
                                viewModel.DetailScanPicktolight(res.data).then(
                                    function success(res) {
                                        $scope.block = false;
                                        if (res.data.length > 0) {
                                            $scope.filterModel = {};
                                            if (res.data[0].resultCheckSorter) {
                                                dpMessageBox.alert(
                                                    {
                                                        ok: 'Close',
                                                        title: 'ALERT',
                                                        message: 'ห้ามนำ Tote นี้ขึ้น Sorter'
                                                    }
                                                )
                                            }
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
                                    });
                                $scope.listfilterModel = undefined;
                                $scope.size = undefined;
                                $scope.total_qty = undefined;
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

            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                $scope.size = {};
                $scope.total_qty = {};
                $scope.block = false;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tagOut_No"]');
                    focusElem[0].focus();

                }, 200);
            }







        }
    })
})();
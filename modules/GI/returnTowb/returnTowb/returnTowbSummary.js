(function () {
    'use strict';
    app.component('returnTowbSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/returnTowb/returnTowb/returnTowbSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, returnTowbFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = returnTowbFactory;
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};

            $scope.scanorder = function () {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.scanorder($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.resultIsUse) {
                            $scope.confirmscan = true;
                            $scope.filterModel.planGoodsIssue_Index = res.data.resultMsg;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.location"]');
                                focusElem[0].focus();

                            }, 200);
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.resultMsg
                            })
                            $scope.filterModel.planGI = undefined;
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

            $scope.ScanLocation = function () {
            //     debugger
                let models = $scope.filterModel;
                if ($scope.filterModel.location != undefined) {
                    viewModel.scanLocation(models).then(function success(res) {
                        debugger
                        if (res.data.length > 0) {
                            $scope.filterModel.location_Index = res.data[0].location_Index;
                            $scope.filterModel.location_Id = res.data[0].location_Id;
                            $scope.filterModel.location_Name = res.data[0].location_Name;
                        }else{
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Information.',
                                message: "ไม่พบ Location ที่ทำการ Scan"
                            })
                        }
                    },
                        function error(res) {
                        });

                } else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "กรุณาใส่ Location"
                    })
                }
            }

            $scope.saveorderlocation = function () {
                debugger
                if ($scope.filterModel.planGoodsIssue_Index == '' || $scope.filterModel.planGoodsIssue_Index == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please Scan Order'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.location_Index == '' || $scope.filterModel.location_Index == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Plase Scan Location'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'MSG_Confirm_Save'
                }).then(function () {
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    viewModel.saveorderlocation($scope.filterModel).then(
                        function success(res) {
                            if (res.data.resultIsUse) {
                                $scope.filterModel.tag_no = undefined;
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'SUCCESS'
                                    }
                                )
                            } else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: res.data.resultMsg
                                    }
                                )
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

            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.confirmscan = true;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.planGI"]');
                    focusElem[0].focus();

                }, 200);
            }







        }
    })
})();
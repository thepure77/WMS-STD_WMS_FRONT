(function () {
    'use strict';
    app.component('equipmentStatusForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/equipmentStatus/component/equipmentStatusForm.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, equipmentStatusFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = equipmentStatusFactory;

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };


            $scope.filterSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    $scope.filterModellist = {};
                    if (res.data.resultIsUse) {
                        debugger
                        $scope.filterModellist = res.data
                        $scope.tag = false;
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: resultMsg
                            }
                        )
                    }
                });
            };

            $scope.selectEnable = function (param, index) {

                $scope.filterModellist.crane_disable.push(param);
                $scope.filterModellist.crane_enable.splice(index, 1);
                if (param.isUser){
                    param.isUser = false;
                }else{
                    param.isUser = true;
                }
            }

            $scope.selectDisable = function (param, index) {
                $scope.filterModellist.crane_enable.push(param);
                $scope.filterModellist.crane_disable.splice(index, 1);
                if (param.isUser){
                    param.isUser = false;
                }else{
                    param.isUser = true;
                }
            }

            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#99FF66"
                }
            }

            $scope.updatestautsCrane = function () {
                $scope.filterModellist.Update_By = $scope.userName;
                viewModel.updateCrane_status($scope.filterModellist).then(function (res) {
                    if (res.data.resultIsUse) {
                        $scope.filterSearch();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Success'
                            }
                        )
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: resultMsg
                            }
                        )
                    }
                });
            }

            $vm.$onInit = function () {
                $vm = this;
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterSearch();
            }







        }
    })
})();
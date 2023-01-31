(function () {
    'use strict';
    app.component('reportCheckScanRollCageFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/RollCage/reportCheckScanRollCage/component/reportCheckScanRollCageFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, reportCheckScanRollCageFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = reportCheckScanRollCageFactory;


            $vm.filterModel = {

            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.filterSearch = function () {
                $scope.filterModel = $vm.filterModel || {};

                if ($scope.filterModel.GoodsIssue_No == "" || $scope.filterModel.GoodsIssue_No == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "กรุณาระบุเลขที่ใบเบิกสินค้า"
                    })
                    $scope.filterModel.GoodsIssue_No = undefined;
                    return;
                }
                pageLoading.show();
                viewModel.searchFilter($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.resultIsUse) {
                        $vm.searchResultModel = res.data.itemsCheckout;
                        $vm.filterModel = $scope.filterModel;
                    } else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.resultMsg,
                            
                        })
                        $vm.searchResultModel = {}
                    }

                }, function error(res) {});
            };

            $scope.autoComplete = {
                autoKey: "AutoGoodsIssue/AutobasicSuggestion",
                owner: "AutoGoodsIssue/AutoOwnerfilter",
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                planGoodsIssue_No: "AutoGoodsIssue/autoPlanGoodIssueNo",
                documentType: "AutoGoodsIssue/AutoDocumentTypefilter",
                processStatus: "AutoGoodsIssue/AutoStatusfilter",
                user: "AutoGoodsIssue/autoUser",
            };

            $scope.url = {
                GI: webServiceAPI.GI,
            };

            $scope.popupOther = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                        $scope.popupOther.onShow = !$scope.popupOther.onShow;
                        $scope.popupOther.delegates.otherPopup(param);
                },
                config: {
                    title: "Rollcage"
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        
                    }
                }
            };


            this.$onInit = function () {
                $vm.filterModel = {};
                $vm.filterModel.isScan = 0;
                $vm.filterModel.locationType = "ALL";
            };

        }
    });

})();
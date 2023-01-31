(function () {
    'use strict'

    app.component('shortShipForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ShortShip/component/shortShipForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory, ShortShipFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = planGoodsIssueFactory;
            var _viewModel = ShortShipFactory;
            $scope.filterModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.load = true;

            $scope.language = $window.localStorage['LANGUAGE']

            $scope.CheckLanguage = function () {
                $scope.language = $window.localStorage['LANGUAGE']
                if ($scope.language == "th")
                    return "0"
                else
                    return "-210"
            }
            $scope.CheckLanguageV2 = function () {
                $scope.language = $window.localStorage['LANGUAGE']
                if ($scope.language == "th")
                    return "-10"
                else
                    return "200"
            }

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            $scope.filterItemModel = {};
            $scope.addressTemp = {};

            $scope.header = {
                show: true
            };

            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };

            $scope.item = {
                show: true
            };

            $scope.ShowItem = function () {
                $scope.item.show = $scope.item.show === false ? true : false;
            };

            

            $vm.onShow = function (param) {
                defer = $q.defer();

                $scope.onShow = true;
                $scope.filterModel.planGoodsIssue_Date = getToday();
                $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                $scope.filterModel.planGoodsIssue_Time = getTime();
                $scope.colortable1 = "#999999";
                $scope.colortable2 = "#e5e5e5";
                $scope.colortable3 = "#e5e5e5";
               
                $scope.selectedTable = 1;
                if (param != undefined) {
                    pageLoading.show()
                    $scope.load = false;
                    $scope.filterModel = param;

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                            _viewModel.getId($scope.filterModel).then(function (res) {
                            $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;

                        });
                }
                
                 return defer.promise;
            };

            $scope.searchFilter  = function () {
                pageLoading.show()
                _viewModel.getId($scope.filterModel).then(function (res) {
                    $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;
                });

            }
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.FilterSearch().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data.itemsPlanGR;
            //         $vm.searchResultModel = res.data.itemsPlanGR;
            //     });
            // };

            $scope.filter = function () {
                $vm.triggerSearch();
            };


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            $scope.back = function () {
                $scope.deleteuser = {};
                $scope.filterModel = {};
                defer.resolve();
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };



            $scope.editItem = function (index) {

                $scope.index = index;

                var ItemStatus = $scope.dropdownItemStatus
                const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                    return ItemStatus.itemStatus_Index == $scope.filterModel.listplanGoodsIssueItemViewModel[index].itemStatus_Index;
                })
                $scope.dropdownItemStatus.model = resultsItemStatus[0];

                $scope.filterItemModel.product_Index = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Index;
                $scope.filterItemModel.product_Id = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Id;
                $scope.filterItemModel.product_Name = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Name;
                $scope.filterItemModel.qty = $scope.filterModel.listplanGoodsIssueItemViewModel[index].qty;
                // $scope.filterItemModel.weight = $scope.filterModel.listplanGoodsIssueItemViewModel[index].weight;
                $scope.filterItemModel.ratio = $scope.filterModel.listplanGoodsIssueItemViewModel[index].ratio;
                $scope.filterItemModel.product_Lot = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Lot;
                $scope.filterItemModel.documentItem_Remark = $scope.filterModel.listplanGoodsIssueItemViewModel[index].documentItem_Remark;
                $scope.filterItemModel.rowItemIndex = index;
            }


            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                owner: "AutoPlanGoodIssue/AutoOwnerfilter",
                warehouse_Name: "AutoPlanGoodIssue/autoWarehousefilter",
                documentType: "AutoPlanGoodIssue/autoDocumentTypefilter",
                processStatus: "AutoPlanGoodIssue/autoStatusfilter",
                sku: "ShortShip/autoProductfilter",
                product: "AutoPlanGoodIssue/autoProductfilter",
                soldToPlanGI: "AutoPlanGoodIssue/autoSoldTofilter",
                shipToPlanGI: "AutoPlanGoodIssue/autoShipTofilter",
                movementType: "AutoPlanGoodIssue/autoMovementTypefilter",

            };

            $scope.url = {
                Load: webServiceAPI.Load,
            };

            $scope.popUpCancelQty = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    let data = {};
                    $scope.popUpCancelQty.onShow = !$scope.popUpCancelQty.onShow;
                    if (param) {
                        param.rowItemIndex = index;
                        param.update_By = localStorageService.get('userTokenStorage');
                        param.operations = "ADD";
                    }
                    data = param || {};
                    
                    $scope.popUpCancelQty.delegates(data);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    update: function (param) {
                        if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex] = angular.copy(param);
                            $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].receiveQty 
                            =   $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].issueQty -
                            $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].shortQty; 
                            if ($scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].shortQty >= 1
                                && $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].shortQty 
                                < $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].issueQty) {
                                   $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].statusItem = "ส่งบางส่วน";
                            }
                            if ($scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].shortQty ==
                                $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].issueQty) {
                                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].statusItem = "ยกเลิก";
                            }
                        }
                        
                    }
                }
            };

            

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.click = 1;

                $scope.userName = localStorageService.get('userTokenStorage');
           
                $vm.onShow();

            };
            init();
        }
    })
})();
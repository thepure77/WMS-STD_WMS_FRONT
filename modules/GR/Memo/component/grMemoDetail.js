(function () {
    'use strict'
    app.directive('grMemoDetail', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/Memo/component/grMemoDetail.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'MemoFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, MemoFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = MemoFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        };

                        $scope.delegates = function (param) {
                            $scope.filterItemModel = {};
                            if (param.rowItemIndex != undefined || param.rowItemIndex != null) {
                                $scope.filterItemModel = param;
                                $scope.dropdownItemStatus.model = resultItemStatus[0];
                                $scope.IsNew = 0;
                            }
                            else {
                                $scope.IsNew = 1;
                                $scope.qty = 0;
                                $scope.volume = 0;
                                $scope.weight = 0;
                                $scope.filterItemModel.amount = 0;
                                $scope.filterItemModel.key2 = param.owner_Index;
                                viewModel.getByGoodReceiveId(param.index).then(function (res) {
                                    for (var i = 0, l = res.data.length; i < l; i++) {
                                        $scope.qty = parseFloat($scope.qty) + parseFloat(res.data[i].qty);
                                        if(res.data[i].volume != undefined){
                                            $scope.volume = parseFloat($scope.volume) + parseFloat(res.data[i].volume);
                                        }else{
                                            $scope.volume = parseFloat($scope.volume) + 0 ;
                                        }
                                        if(res.data[i].weight != undefined){
                                        $scope.weight = parseFloat($scope.weight) + parseFloat(res.data[i].weight);
                                        }else{
                                            $scope.weight = parseFloat($scope.weight) + 0 ;
                                        }
                                    }
                                    $scope.filterItemModel.qty = $scope.qty;
                                    $scope.filterItemModel.volume = $scope.volume;
                                    $scope.filterItemModel.weight = $scope.weight;
                                }, function error(response) {
                                    pageLoading.hide();
                                });
                            }
                        }

                        $scope.$watch("filterItemModel.unitCharge", function () {
                            if ($scope.filterItemModel.unitCharge != undefined) {
                                $scope.filterItemModel.amount = $scope.filterItemModel.rate * $scope.filterItemModel.unitCharge;
                                var Vn = $scope.filterItemModel.amount.toFixed(2);
                                var amount = parseFloat(Vn);
                                $scope.filterItemModel.amount = amount;
                            }
                        });

                        $scope.$watch("filterItemModel.rate", function () {
                            if ($scope.filterItemModel.unitCharge != undefined) {
                                $scope.filterItemModel.amount = $scope.filterItemModel.rate * $scope.filterItemModel.unitCharge;
                                var Vn = $scope.filterItemModel.amount.toFixed(2);
                                var amount = parseFloat(Vn);
                                $scope.filterItemModel.amount = amount;
                            }
                        });

                        $scope.addsItem = function (param) {
                            if ($scope.filterItemModel.unitCharge == undefined || $scope.filterItemModel.unitCharge == "0") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: 'Please insert Unit charge !'
                                    }
                                )
                                return "";
                            }
                            $scope.invokes.selected($scope.filterItemModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        $scope.autoComplete = {
                            ServiceCharge: "PickBinbalance/ServiceCharge",
                        };

                        $scope.url = {
                            BinBalance: webServiceAPI.BinBalance,
                        };
                    }
                ],
                link: function () { }
            };
        }
    ]);
}());

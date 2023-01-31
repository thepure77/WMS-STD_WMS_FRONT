
(function () {
    'use strict'
app.directive('otherPop', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        templateUrl: "modules/component/Popup/otherPopup/other/otherPopup.html",
        scope: {
            onShow: '=',
            delegates: '=?',
            invokes: '=?',
            config: '=?'
        },
        controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'reportCheckScanRollCageFactory',
            function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, reportCheckScanRollCageFactory) {
                $scope.delegates = {};
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                var viewModel = reportCheckScanRollCageFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.planGoodsReceiveNo = "";
                            param.planGoodsReceiveIndex = "";
                            // param.vendorName = "";
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 30,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        $scope.delegates.otherPopup = function (param) {
                            //$scope.dataset = angular.copy(JSON.stringify(param, undefined, 4));
                            $scope.dataset = angular.copy(param);
                            $scope.rollcageModel = {};
                            $scope.filterModel.rollCageID = '';
                            //$scope.find($scope.dataset);
                            //document.body.appendChild(document.createElement('pre')).innerHTML = JSON.stringify(param, undefined, 4);
                        }

                        $scope.getRollcage = function () {
                            pageLoading.show();
                            viewModel.Get_Rollcage($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                if (res.data.length > 0) {  
                                    $scope.rollcageModel = res.data;
                                }
                                else
                                {
                                    $scope.rollcageModel = [];
                                }
                            }, function error(res) { });
                        };

                        var init = function () {
                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());

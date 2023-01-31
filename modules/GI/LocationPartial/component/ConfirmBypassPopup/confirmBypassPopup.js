
(function () {
    'use strict'
    app.directive('confirmBypassPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/LocationPartial/component/ConfirmBypassPopup/confirmBypassPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'dpMessageBox','locationPartialFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, dpMessageBox, locationPartialFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = locationPartialFactory;
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};

                        $scope.onClose = function () {
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            pageLoading.show();
                            $scope.filterModel = param.filter(c => c.selected);
                            $scope.takecount = {};
                            $scope.takecount.ItemModel = $scope.filterModel;
                            viewModel.getlocation($scope.takecount).then(function success(res) {
debugger
                                if(res.data.length > 0){
                                    for (var c = 0; c <=  $scope.filterModel.length-1; c++) {
                                        $scope.filterModel[c].location_Index_To = res.data[c].location_Index_To;
                                        $scope.filterModel[c].location_Id_To = res.data[c].location_Id_To;
                                        $scope.filterModel[c].location_Name_To = res.data[c].location_Name_To;
                                    }
                                    debugger
                                    pageLoading.hide();
                                }else{
                                    $scope.invokes.selected(false);
                                }

                                
                                
                                
            
                            }, function error(res) { });

                            // $scope.filterModel = param.filter(c => c.selected);
                        }

                        $scope.addsItem = function () {
                            $scope.invokes.add($scope.filterModel);
                        }


                        $scope.Close = function () {
                            $scope.filterModelitem = undefined
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        var init = function () {
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());

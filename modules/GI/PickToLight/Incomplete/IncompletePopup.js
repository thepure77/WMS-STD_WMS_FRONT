
(function () {
    'use strict'
    app.directive('incompletePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/PickToLight/Incomplete/IncompletePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'PickToLightFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, PickToLightFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = PickToLightFactory;
                        $scope.chk = {};
                        $scope.masterRequire = {};

                        $scope.filterModel = {};
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.masterRequire = {};
                            $scope.onShow = false;
                        };

                        $scope.model = {
                            masterRequireId: ''
                        };
                        $scope.toggleSearch = function () {
                        };
                        $scope.delegates.search = function () {
                        }

                        $scope.delegates = function () {
                            $scope.filterModelpopup = {};
                            viewModel.Check_Tote().then(
                                function success(res) {
                                    
                                    if (res.data.resultIsUse) {
                                        $scope.filterModelpopup.gi_NO = res.data.gi_NO;
                                        $scope.filterModelpopup.total = res.data.total;
                                        $scope.filterModelpopup.pick_PC = res.data.pick_PC;
                                        $scope.filterModelpopup.pick_PNC = res.data.pick_PNC;
                                        $scope.filterModelpopup.pick_NP = res.data.pick_NP;
                                        $scope.filterModelpopup.incomplete_tote = res.data.incomplete_tote;
                                    } else {
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
                        }


                        $scope.search = function () {
                            $scope.delegates();
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

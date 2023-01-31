
(function () {
    'use strict'
    app.directive('popUpTagOutPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/RollCage/scanIn/popUpTagOut/popUpTagOut/popUpTagOutPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'scanInFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, scanInFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = scanInFactory;
                        $scope.planGi = {};
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 100,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            $scope.filter();
                        }
                        $scope.delegates.popUpTagOutPopup = function (param) {
                            $scope.filterModel = {};
                            $scope.filterModel = param;
                            $scope.filter();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }

                        $scope.filter = function () {
                            debugger
                            pageLoading.show();
                            viewModel.findScanSummary($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                
                                if (res.data.length > 0) {
                                    
                                    $scope.countItem = res.data.length;
                                    $scope.countScanBOX = res.data[0].countScanBOX;
                                    $scope.totalBOX = res.data[0].totalBOX;

                                    $scope.items = {};
                                    $scope.datalist.items = res.data;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set($scope.datalist.items);
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "ไม่พบตะกร้า"
                                    })
                                }
                            },
                                function error(res) {
                                  
                                });
                        };

                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                  
                                },
                                delete: function (param) {
                                  
                                },
                                edit: function (param) {
                                  
                                },
                                selected: function (param) {
                                    
                                },
                                confirm: function (param) {
                                    
                                }
                            }
                        };

                        $scope.confirm = function () {
                            
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

                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());

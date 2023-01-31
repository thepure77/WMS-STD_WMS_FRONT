
(function () {
    'use strict'
    app.directive('masterRequireCy', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Tranfer/TaskCyclecount/component/masterRequire/masterRequirePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'taskcyclecountFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, taskcyclecountFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = taskcyclecountFactory;
                        $scope.filterModel = {};
                        $scope.onShow = false;
                        $scope.masterRequire = {};
                        $scope.chk = {};

                        $scope.onClose = function () {
                            $scope.dropdownItemStatus.model = {};
                            $scope.masterRequire = {};
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            masterRequireId: ''
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
                        $scope.delegates.masterRequirePopup = function (param) {
                            viewModel.product(param).then(
                                function success(res) {
                                    $scope.chk.isExpDate = res.data[0].isExpDate;
                                    $scope.chk.isMfgDate = res.data[0].isMfgDate;
                                    $scope.masterRequire.isExpDate = res.data[0].isExpDate;
                                    $scope.masterRequire.isMfgDate = res.data[0].isMfgDate;
                                    $scope.masterRequire.isLot = res.data[0].isLot;

                                },
                                function error(response) {
                                });
                        }

                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }

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

                                    $scope.masterRequire = $scope.masterRequire || {};
                                    $scope.masterRequire.currentPage = param.currentPage;
                                    $scope.masterRequire.numPerPage = param.numPerPage;
                                    $scope.search($scope.masterRequire).then(function success(res) {

                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {

                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.masterRequire = {};
                                    $scope.onShow = false;
                                }
                            }
                        };

                        $scope.selected = function () {
                            if ($scope.chk.isMfgDate == 1) {
                                if ($scope.masterRequire.mFG_Date == null
                                    || $scope.masterRequire.mFG_Date == undefined
                                    || $scope.masterRequire.mFG_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'Validate',
                                            message: 'Please Choose MFG_Date !'
                                        }
                                    )
                                }
                                $scope.onShow = true;
                            }
                            if ($scope.chk.isExpDate == 1) {
                                if ($scope.masterRequire.eXP_Date == null
                                    || $scope.masterRequire.eXP_Date == undefined
                                    || $scope.masterRequire.eXP_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'Validate',
                                            message: 'Please Choose EXP_Date !'
                                        }
                                    )
                                }
                                $scope.onShow = true;
                            }
                            if ($scope.chk.isLot == 1) {
                                if ($scope.masterRequire.lot == null
                                    || $scope.masterRequire.lot == undefined
                                    || $scope.masterRequire.lot == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'Validate',
                                            message: 'Please Choose Lot !'
                                        }
                                    )
                                }
                                $scope.onShow = true;
                            }
                            if ($scope.dropdownItemStatus.model == null) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: 'Please Choose ItemStatus !'
                                    }
                                )
                                return "";
                                $scope.onShow = true;
                            }
                            else {
                                $scope.masterRequire.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                                $scope.masterRequire.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                                $scope.masterRequire.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;

                                if ($scope.invokes.selected != undefined)
                                    $scope.invokes.selected($scope.masterRequire);
                                $scope.dropdownItemStatus.model = {};
                                $scope.masterRequire = {};
                                $scope.onShow = false;
                            }

                        }



                        $scope.dropdownItemStatus = function () {
                            viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                                $scope.dropdownItemStatus = res.data;
                            });
                        };

                        var init = function () {
                            $scope.dropdownItemStatus();
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

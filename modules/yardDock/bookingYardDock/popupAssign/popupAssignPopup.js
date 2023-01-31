
(function () {
    'use strict'
    app.directive('popupAssignPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingYardDock/popupAssign/popupAssignPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'bkYardDockFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, bkYardDockFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = bkYardDockFactory;
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

                        $scope.delegates = function (param) {
                            $scope.filterModel = param
                            $scope.filterModel.dock_Name_to = param.dock_Name;
                            $scope.filterModel.appointment_Time = undefined;
                            
                            viewModel.ListDockQoutareassign($scope.filterModel).then(
                                function success(res) {
                                    pageLoading.hide();
                                    
                                    $scope.dropdownnewtime = res.data[0].items[0].times;
                                    $scope.dropdownnewtime = $scope.dropdownnewtime.filter(c => c.isEnable == true)
                                    
                                },
                                function error(param) {
                                    dpMessageBox.alert({
                                        ok: "Close",
                                        title: "error",
                                        message: param.Message.Message,
                                    });
                                    $scope.models.appointment_Date = getToday();
                                }
                            );
                        }

                        $scope.$watch("dropdownnewtime.model", function () {
                            
                            if ($scope.dropdownnewtime.model != null || $scope.dropdownnewtime.model != undefined) {
                                let model = $scope.dropdownnewtime.model;
                                model.documentType_Index = $scope.filterModel.documentType_Index;
                                model.appointment_Date = $scope.filterModel.appointment_Date;
                                model.wareHouse_Index = $scope.filterModel.wareHouse_Index;
                                viewModel.ListDockForAppointmentreAssign(model).then(
                                    function success(res) {
                                        pageLoading.hide();
                                        debugger
                                        $scope.dropdownnewdock = []
                                        $scope.dropdownnewdockcheck = res.data[0].items;
                                        for (let index = 0; index < $scope.dropdownnewdockcheck.length; index++) {
                                            let check = $scope.dropdownnewdockcheck[index].times[0];
                                            if (check.isEnable == true) {
                                                $scope.dropdownnewdock.push($scope.dropdownnewdockcheck[index]);
                                            }
                                            
                                        }
                                        // $scope.dropdownnewdock = $scope.dropdownnewdock.filter(c => c.times.filter(c=> c.isEnable == true))
                                        
                                    },
                                    function error(param) {
                                        dpMessageBox.alert({
                                            ok: "Close",
                                            title: "error",
                                            message: param.Message.Message,
                                        });
                                        $scope.models.appointment_Date = getToday();
                                    }
                                );
                            }
                            
                        });

                        $scope.selected = function () {
                            
                            if ($scope.dropdownnewtime.model == null || $scope.dropdownnewtime.model == undefined) {

                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'Select Time!!'
                                    }
                                )
                                return "";
                            }

                            if ($scope.dropdownnewdock.model == null || $scope.dropdownnewdock.model == undefined) {

                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'Select Dock!!'
                                    }
                                )
                                return "";
                            }

                            $scope.filterModel.dockQoutaInterval_Index = $scope.dropdownnewdock.model.times[0].dockQoutaInterval_Index;
                            $scope.filterModel.dock_Id = $scope.dropdownnewdock.model.dock_Id;
                            $scope.filterModel.dock_Index = $scope.dropdownnewdock.model.dock_Index;
                            $scope.filterModel.dock_Name = $scope.dropdownnewdock.model.dock_Name;
                            if ($scope.invokes.selected != undefined)
                                $scope.invokes.selected($scope.filterModel);
                            $scope.filterModel = {};
                            $scope.onShow = false;

                        }


                        var init = function () {
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

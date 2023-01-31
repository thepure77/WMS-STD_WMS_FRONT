
(function () {
    'use strict'
    app.directive('dockconfirmPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/queueYardDock/Dockconfirm/DockconfirmPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'queueYardDockFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, queueYardDockFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = queueYardDockFactory;
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
                            $scope.checktime = param;
                            viewModel.ListDockForAppointmentreAssign(param).then(
                                function success(res) {
                                    pageLoading.hide();
                                    $scope.dropdownnewdock = []
                                    $scope.dropdownnewdockcheck = res.data[0].items;
                                    for (let index = 0; index < $scope.dropdownnewdockcheck.length; index++) {
                                        let check = $scope.dropdownnewdockcheck[index].times[0];
                                        
                                        if (check.isEnable == true || check.dockQoutaInterval_Index == $scope.checktime.dockQoutaInterval_Index) {
                                            $scope.dropdownnewdock.push($scope.dropdownnewdockcheck[index]);
                                        }
                                    }
                                    var selectDock = $scope.dropdownnewdock

                                    const resultsselectDock = selectDock.filter((selectDock) => {
                                        
                                        return selectDock.times[0].dockQoutaInterval_Index == $scope.checktime.dockQoutaInterval_Index;
                                    })
                                    $scope.dropdownnewdock.model = resultsselectDock[0];

                                    // if ($scope.dropdownnewdock.length > 0) {
                                    //     $scope.dropdownnewdock.model = $scope.dropdownnewdock.find(c => c.dockQoutaInterval_Index == $scope.checktime.dockQoutaInterval_Index)
                                    // }
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
                            $scope.filterModel = param
                            // $scope.filterModel.dock_Name_to = param.dock_Name;
                        }


                        $scope.selected = function () {
                            
                            if ($scope.dropdownnewdock.model != undefined) {
                                $scope.filterModel.dock_Id =   $scope.dropdownnewdock.model.dock_Id;                  
                                $scope.filterModel.dock_Index =   $scope.dropdownnewdock.model.dock_Index;                  
                                $scope.filterModel.dock_Name =   $scope.dropdownnewdock.model.dock_Name;                  
                                $scope.filterModel.dockQoutaInterval_Index =   $scope.dropdownnewdock.model.times[0].dockQoutaInterval_Index;                  
                            }
                            if ($scope.filterModel.dock_Index == null || $scope.filterModel.dock_Index == "") {

                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'กรุณาทำการเลือก Dock ที่จะทำการเรียกคิว'
                                    }
                                )
                                return "";
                            }
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

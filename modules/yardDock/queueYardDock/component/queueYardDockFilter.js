(function () {
    'use strict';
    app.component('queueYardDockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/queueYardDock/component/queueYardDockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, queueYardDockFactory, webServiceAPI) {
            var $vm = this;
            // This default object
            var viewModel = queueYardDockFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $scope.searchFilter = function (param, checkFrist) {
                if (param != undefined && param != "") {
                    $scope.items = param;
                } else {
                    $scope.items = {};
                }

                if ($scope.dropdownListDocks != undefined) {
                    if ($scope.dropdownListDocks.model != null) {
                        $scope.items.dock_Id = $scope.dropdownListDocks.model.dock_Id;
                        $scope.items.dock_Index = $scope.dropdownListDocks.model.dock_Index;
                        $scope.items.dock_Name = $scope.dropdownListDocks.model.dock_Name;
                    } else {
                        if ($scope.items != undefined) {
                            $scope.items.dock_Id = undefined;
                            $scope.items.dock_Index = undefined;
                            $scope.items.dock_Name = undefined;
                        }

                    }
                }
                if ($scope.dropdownListTime != undefined) {
                    if ($scope.dropdownListTime.model != null) {
                        $scope.items.time = $scope.dropdownListTime.model.appointment_Time;
                    } else {
                        $scope.items.time = undefined;
                    }
                }

                if (!checkFrist) {
                    if ($scope.items.datePeriod == undefined) {
                        $scope.items.datePeriod = getTodayDeFault() + " - " + getTodayDeFault()
                        dateformate($scope.items.datePeriod);
                    } else {
                        dateformate($scope.items.datePeriod);
                    }
                }

                pageLoading.show();
                // if ($scope.items.appointment_Date == undefined && $scope.items.appointment_Date_To == undefined) { 
                //     $scope.items.appointment_Date = convertDateFilter(getTodayDeFault())
                //     $scope.items.appointment_Date_To = convertDateFilter(getTodayDeFault())
                // }
                viewModel.filter($scope.items).then(function (res) {
                    if($scope.items.datePeriod == undefined){
                        $scope.items.datePeriod = getTodayDeFault() + " - " + getTodayDeFault()
                    }
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.searchResultModel = res.data;
                    }
                    else {
                        $vm.searchResultModel = {}
                    }
                });
            };

            $scope.selectDock = function (param) {
                if (param != null && param != undefined) {
                    $scope.filterModel.dock_Id = param.dock_Id;
                    $scope.filterModel.dock_Index = param.dock_Index;
                    $scope.filterModel.dock_Name = param.dock_Name;

                }
                else {
                    $scope.filterModel.dock_Id = ''
                    $scope.filterModel.dock_Index = ''
                    $scope.filterModel.dock_Name = ''
                }
            };

            $scope.dropdownDockQouta = function () {
                viewModel.FilterDock($scope.filterModel).then(function (res) {
                    $scope.dropdownListDocks = res.data;
                    $scope.dropdownListDocks.forEach(c => {
                        c.dock_Name = c.dock_Name
                    });
                });

            };

            $scope.dropdownTime = function () {
                viewModel.FilterTime($scope.filterModel).then(function (res) {
                    $scope.dropdownListTime = res.data;
                    
                });

            };

            $vm.triggerSearch = function () {
                $scope.searchFilter("", true);
            };

            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
            };

            $scope.header = {
                advanceSearch: false
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            function convertDateFilter(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }

            function convertDateFilterEnd(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T23:59:59Z'
                return a;
            }

            function dateformate(param) {

                var date = param.split(' - ');
                var array1 = date[0].split('/');
                var ds = array1[2] + array1[1] + array1[0]
                $scope.items.appointment_Date = convertDateFilter(ds);
                var array2 = date[1].split('/');
                var de = array2[2] + array2[1] + array2[0]
                $scope.items.appointment_Date_To = convertDateFilterEnd(de);
            }

            $scope.selectWH = function () {
                if ($scope.filterModel.select_DockQouta != null || $scope.filterModel.select_DockQouta != undefined) {
                    $scope.filterModel.dock_Id = $scope.filterModel.select_DockQouta.dock_Id;
                    $scope.filterModel.dock_Name = $scope.filterModel.select_DockQouta.dock_Name;
                    $scope.filterModel.dock_Index = $scope.filterModel.select_DockQouta.dock_Index;
                } else {
                    $scope.filterModel.dock_Id = ''
                    $scope.filterModel.dock_Name = ''
                    $scope.filterModel.dock_Index = ''
                }
            }

            $scope.clickDate = function (param) {
                if (param != null || param != undefined) {
                    $scope.filterModel.dock_Id = $scope.filterModel.select_DockQouta.dock_Id;
                    $scope.filterModel.dock_Name = $scope.filterModel.select_DockQouta.dock_Name;
                    $scope.filterModel.dock_Index = $scope.filterModel.select_DockQouta.dock_Index;
                } else {
                    $scope.filterModel.dock_Id = ''
                    $scope.filterModel.dock_Name = ''
                    $scope.filterModel.dock_Index = ''
                }
            }

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {
                $scope.dropdownDockQouta();
                $scope.dropdownTime();
            };

            function getTodayDeFault(chkdate = false) {
                var today = new Date();
                if (chkdate) {
                    today.setDate(today.getDate() - 15);
                }
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();
            }

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });
})();
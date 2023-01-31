(function () {
    'use strict';
    app.component('bkYardDockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingYardDock/component/bkYardDockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, bookingConfignDockFactory, bkYardDockFactory, webServiceAPI) {
            var $vm = this;
            // This default object
            var viewModel = bkYardDockFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.items.date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.items.date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            $scope.searchFilter = function (param, checkFrist) {
                
                if (param != undefined && param != "") {
                    $scope.items = param;
                } else {
                    $scope.items = {};
                }

                if($('input[name="datefilter"]').val().length > 0)
                {
                    $scope.filterModel.date = $('input[name="datefilter"]').val();
                }

                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
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

                if (!checkFrist) {
                    if ($scope.items.datePeriod == undefined) {
                        $scope.items.datePeriod = getTodayDeFault() + " - " + getTodayDeFault()
                        dateformate($scope.items.datePeriod);
                    } else {
                        dateformate($scope.items.datePeriod);
                    }
                }

                pageLoading.show();
                viewModel.filter($scope.items).then(function (res) {
                    // $scope.items.datePeriod = getTodayDeFault(true) + " - " + getTodayDeFault()
                    pageLoading.hide();
                    
                    if (res.data.appointmentModels.length != 0) {
                        $vm.searchResultModel = res.data.appointmentModels;
                    }
                    else {
                        $vm.searchResultModel = []
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

            $scope.autoComplete = {
                ItemStatusName: "autoItemStatus/autoSearchItemStatusFilter"
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

            $scope.status = [
                {
                    value: "2",
                    display: "Success"
                },
                {
                    value: "0",
                    display: "Not successful"
                },
            ];

            $scope.status_cancle = [
                {
                    value: "1",
                    display: "จอง"
                },
                {
                    value: "-1",
                    display: "ยกเลิก"
                },
            ];

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {
                $scope.dropdownDockQouta();
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
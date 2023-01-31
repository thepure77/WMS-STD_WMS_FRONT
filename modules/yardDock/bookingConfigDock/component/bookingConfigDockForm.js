(function () {
    'use strict'
    app.component('bookingConfigDockForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingConfigDock/component/bookingConfigDockForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, localStorageService, bookingConfignDockFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            $scope.sentData = {};
            var viewModel = bookingConfignDockFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.dockDate = true;

            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.filterModel = {};
                $scope.onShow = true;
                $scope.deleteTimeItem = false;
                $scope.getInterval = {};
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.update_By = localStorageService.get('userTokenStorage');
                        $scope.update = true;
                        $scope.action = "EDIT"
                        debugger
                        $scope.filterModel = res.data;
                        $scope.getInterval = angular.copy(res.data.dockQoutaIntervalTime);
                        $scope.bkItem.interval = $scope.filterModel.interval.toString();
                        if (res.data.docks != undefined) {
                            $scope.ProductStock = res.data.docks;
                            $scope.ProductStock.forEach(c => {
                                c.name = c.dock_Name
                            });
                        }

                        $scope.ItemsTime = res.data.dockQoutaIntervalTime;
                        $scope.DockQoutaIntervalBreakTime = res.data.dockQoutaIntervalBreakTime

                        if ($scope.DockQoutaIntervalBreakTime.length > 0) {
                            $scope.deleteTimeItem = true;
                        }
                        if (param.dockQouta_Date != null) {
                            var ds = formatDate(param.dockQouta_Date);
                            $scope.filterModel.dockQouta_Date = ds;
                        }
                        if (param.dockQouta_Date_End != null) {
                            var de = formatDate(param.dockQouta_Date_End);
                            $scope.filterModel.dockQouta_Date_End = de;
                        }
                        if ($scope.ItemsTime) {

                            const dwTimeOn = $scope.ItemsTime.filter(elem => elem.time_Start == param.dockQouta_Time)
                            $scope.dropdownIntervalTimeOn = {}
                            $scope.dropdownIntervalTimeOn.model = dwTimeOn[0];

                            const dwTimeEnd = $scope.ItemsTime.filter(elem => elem.time_End == param.dockQouta_Time_End)
                            $scope.dropdownIntervalTimeEnd = {}
                            $scope.dropdownIntervalTimeEnd.model = dwTimeEnd[0];
                        }
                        if ($scope.filterModel.wareHouse_Index) {
                            const wH = $scope.itemsWarehouse.filter(elem => elem.wareHouse_Index == param.wareHouse_Index)
                            $scope.dropdownWarehouse = {}
                            $scope.dropdownWarehouse.model = wH[0];
                        }

                        if ($scope.filterModel.isActive == 0) {
                            $scope.filterModel.isActive = false;
                        }
                        else {
                            $scope.filterModel.isActive = true;
                        }
                        if ($scope.filterModel.dockQouta_Date == null && $scope.filterModel.dockQouta_Date_End == null) {
                            $scope.filterModel.isActiveAllTime = 1;
                        }
                        else {
                            $scope.filterModel.isActiveAllTime = 0;
                        }

                        if ($scope.filterModel.dockQouta_Time == null && $scope.filterModel.dockQouta_Time_End == null) {
                            $scope.filterModel.isActiveAllTime2 = 1;
                            $scope.intevalSetting = false;
                        }
                        else {
                            $scope.filterModel.isActiveAllTime2 = 0;
                            $scope.intevalSetting = true;
                        }
                    });
                }
                else {
                    $scope.update_By = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.DockQoutaIntervalBreakTime = {};
                    $scope.dropdownWarehouse = {};
                    $scope.ItemsTime = {};
                    $scope.bkItem = {};
                    $scope.dropdownIntervalTimeEnd = {};
                    $scope.dropdownIntervalTimeOn = {};
                    filterDock();
                    $scope.isActiveAllTime = false;
                    $scope.isActiveAllTime2 = false;
                    $scope.intevalSetting = false;
                    $scope.filterModel.isActive = false;
                }
                return defer.promise;
            };
            function formatDate(date) {

                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;

                return [year, month, day].join('');
            }

            // set default setting
            $scope.intevalSetting = false;
            $scope.intevalTime = function (param) {
                $scope.DockQoutaIntervalBreakTime = {}
                setTimeout(() => {
                    if (param != undefined && param != "") {
                        $scope.intevalSetting = true;
                        $scope.filterModel.isActiveAllTime2 = false;
                        $scope.filterModel.interval = param;
                        $scope.intervalTime();
                    }
                    else {
                        $scope.intevalSetting = false;
                    }
                }, 1000);
            }

            $scope.checkedAllTime = function (param, num) {
                if (num == 2 && param == "check2") {
                    $scope.intevalSetting = false;
                    $scope.dropdownIntervalTimeEnd = {};
                    $scope.dropdownIntervalTimeOn = {};
                    $scope.filterModel.DockQouta_Time = null;
                    $scope.filterModel.DockQouta_Time_End = null;
                }
                // else {
                //     $scope.intevalSetting = true;
                // }

                if (num == 1 && param == "check1" && $scope.filterModel.isActiveAllTime) {
                    document.getElementById("isDisabledDate").disabled = true;
                    $scope.filterModel.dockQouta_Date = null;
                    $scope.filterModel.dockQouta_Date_End = null;
                }
                else if ($scope.filterModel.isActiveAllTime2 && param == "check2") {
                    if ($scope.filterModel.isActiveAllTime2 == 1) {
                        $scope.filterModel.intevalSetting = false;
                        // $scope.bkItem.interval = ""
                    }

                }
                else {
                    if ($scope.filterModel.isActiveAllTime2 && $scope.filterModel.isActiveAllTime == 0) {
                        $scope.filterModel.isActiveAllTime = false;
                        $scope.intevalSetting = false;
                    }
                    else {
                        $scope.filterModel.isActiveAllTime2 = false;
                    }
                }
            }

            $scope.dropdownIntervalTimeOn = []
            $scope.dropdownIntervalTimeEnd = []

            $scope.dataTime = {}
            $scope.intervalTime = function () {
                pageLoading.show();
                $scope.criteria = {}
                $scope.criteria.interval = $scope.filterModel.interval;
                viewModel.FilterIntervalTime($scope.criteria).then(function (res) {
                    pageLoading.hide();
                    $scope.ItemsTime = res.data;
                    $scope.dropdownIntervalTimeOn = [];
                    $scope.dropdownIntervalTimeEnd = [];
                    $scope.isResetIntervalTime = 1;

                    $scope.dataTime = angular.copy($scope.ItemsTime);
                    $scope.listNewDate = angular.copy($scope.ItemsTime);
                    if (res.data != undefined) {
                        angular.forEach($scope.ItemsTime, function (value, key) {
                            let TimeStart = {}
                            TimeStart.time_Start = value.time_Start;
                            $scope.dropdownIntervalTimeOn.push(TimeStart);
                        })

                        angular.forEach($scope.ItemsTime, function (value, key) {
                            let TimeEnd = {}
                            TimeEnd.time_End = value.time_End;
                            $scope.dropdownIntervalTimeEnd.push(TimeEnd);
                        })
                    }

                });
            };

            $scope.selectTimeInterval = function (param) {
                if (param != undefined) {
                    if (param.time_Start) {
                        $scope.filterModel.DockQouta_Time = param.time_Start
                    }
                    else {
                        $scope.filterModel.DockQouta_Time_End = param.time_End;
                    }
                }
            }

            $scope.filterWarehouse = function () {
                $scope.criteria = {};
                viewModel.FilterWarehouse($scope.criteria).then(function (res) {
                    $scope.itemsWarehouse = res.data;
                    $scope.itemsWarehouse.forEach(c => {
                        c.warehouse_Name = c.wareHouse_Name
                    });

                }, function error(res) {
                    $scope.response = "M_ERROR";
                    if (res.Message.data != null) {
                        $scope.message = res.Message.data.Message;
                    }
                    else {
                        $scope.message = "Data not found";
                    }
                })
            }

            $scope.selectedTime = function (param) {
                if (param != undefined) {

                }
            }

            function filterDock() {
                $scope.criteria = {};
                viewModel.FilterDock($scope.criteria).then(function (res) {
                    $scope.ProductStock = res.data;
                    $scope.ProductStock.forEach(c => {
                        c.name = c.dock_Name
                    });

                }, function error(res) {
                    $scope.response = "M_ERROR";
                    if (res.Message.data != null) {
                        $scope.message = res.Message.data.Message;
                    }
                    else {
                        $scope.message = "Data not found";
                    }
                })
            }

            $scope.ProductStock = [];
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.dockQoutaModels;
                    defer.resolve('1');
                });
            };

            $scope.CheckactiveAllTime = function () {

                setTimeout(() => {
                    if ($scope.filterModel.isActiveAllTime) {
                        $scope.filterModel.isActiveAllTime = false;
                    }
                }, 500);
            }

            $scope.openPickTime = function () {

                $scope.itemModels.onShow = !$scope.itemModels.onShow;
                $scope.sentData.status = 'Pick';
                $scope.sentData.action = $scope.action;
                $scope.sentData.intervalTime = $scope.ItemsTime;
                let Time_on = [];
                let Time_down = [];
                var check = true;

                if ($scope.itemModels.delegates.set) {
                    if ($scope.DockQoutaIntervalBreakTime.length > 0) {


                        $scope.sentData.DockQoutaIntervalBreakTime = $scope.DockQoutaIntervalBreakTime;
                        $scope.sentData.isResetIntervalTime = 0;
                    } else {
                        $scope.sentData.isResetIntervalTime = 1;
                    }

                    if ($scope.filterModel.isActiveAllTime2 != 1) {
                        if ($scope.dropdownIntervalTimeOn.model.time_Id == undefined || $scope.dropdownIntervalTimeEnd.model.time_Id == undefined) {

                            var TimeOn = $scope.sentData.intervalTime
                            const resultsTimeOn = TimeOn.filter((TimeOn) => {
                                return TimeOn.time_Start == $scope.dropdownIntervalTimeOn.model.time_Start;
                            })
                            Time_on = resultsTimeOn[0];

                            var TimeEnd = $scope.sentData.intervalTime
                            const resultsTimeEnd = TimeEnd.filter((TimeEnd) => {
                                return TimeEnd.time_End == $scope.dropdownIntervalTimeEnd.model.time_End;
                            })
                            // $scope.dropdownIntervalTimeEnd.model = resultsTimeEnd[0];
                            Time_down = resultsTimeEnd[0];
                            check = false;
                        }

                        var intervalTimeOn = $scope.sentData.intervalTime
                        const resultsIntervalTimeOn = intervalTimeOn.filter((intervalTimeOn) => {
                            if (check == true) {
                                return intervalTimeOn.time_Id >= $scope.dropdownIntervalTimeOn.model.time_Id;
                            } else {
                                return intervalTimeOn.time_Id >= Time_on.time_Id;
                            }

                        })

                        $scope.sentData.intervalTime = resultsIntervalTimeOn;

                        var intervalTimeEnd = $scope.sentData.intervalTime
                        const resultsIntervalTimeEnd = intervalTimeEnd.filter((intervalTimeEnd) => {
                            if (check == true) {
                                return intervalTimeEnd.time_Id <= $scope.dropdownIntervalTimeEnd.model.time_Id;
                            } else {
                                return intervalTimeEnd.time_Id <= Time_down.time_Id;
                            }

                        })

                        $scope.sentData.intervalTime = resultsIntervalTimeEnd;
                    }
                    $scope.itemModels.delegates.set($scope.sentData);
                }
            }

            $scope.itemModels = {
                onShow: false,
                config: {
                    title: "Route"
                },
                invokes: {
                    set: function (param, indexHeader) {

                    },
                    add: function (param) {
                        debugger
                        $scope.itemModels.onShow = !$scope.itemModels.onShow;
                        $scope.DockQoutaIntervalBreakTime = param.BreakTime;
                        $scope.isResetIntervalTime = 0;
                        if (param.addTime == "Yes") {
                            $scope.dataTime = angular.copy($scope.getInterval);
                            $scope.DockQoutaIntervalBreakTime = param.BreakTime;
                            $scope.deleteTimeItem = true;
                        }
                        if ($scope.DockQoutaIntervalBreakTime != undefined) {
                            if ($scope.DockQoutaIntervalBreakTime.length > 0) {
                                $scope.deleteTimeItem = true;
                            }
                            else {
                                $scope.deleteTimeItem = false;
                            }
                        }


                    },
                }
            }


            $scope.deleteRestTime = function (param) {
                if ($scope.DockQoutaIntervalBreakTime.length > 0) {
                    var _dataDelete = angular.copy($scope.DockQoutaIntervalBreakTime)
                    for (let index = 0; index < $scope.DockQoutaIntervalBreakTime.length; index++) {
                        if ($scope.DockQoutaIntervalBreakTime[index].time_Id == param.time_Id) {
                            $scope.DockQoutaIntervalBreakTime.splice([index], 1);
                        }
                    }
                }
                if ($scope.DockQoutaIntervalBreakTime.length <= 0) {
                    $scope.deleteTimeItem = false;
                    param.isResetIntervalTime = 1;
                }

                if ($scope.itemModels.delegates.set) {
                    param.deleteFromGet = _dataDelete;
                    param.DockQoutaIntervalBreakTime = $scope.ItemsTime;
                    $scope.itemModels.delegates.set(param);
                }

            }

            function convertDate(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }

            function convertDateFilter(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }
            $scope.add = function () {
                if ($scope.dropdownWarehouse.model != undefined) {
                    $scope.filterModel.wareHouse_Id = $scope.dropdownWarehouse.model.wareHouse_Id;
                    $scope.filterModel.wareHouse_Index = $scope.dropdownWarehouse.model.wareHouse_Index;
                    $scope.filterModel.warehouse_Name = $scope.dropdownWarehouse.model.warehouse_Name;
                }


                $scope.filterModel.dockQoutaIntervalBreakTime = $scope.DockQoutaIntervalBreakTime;


                if ($scope.listNewDate != undefined) {
                    $scope.filterModel.dockQoutaIntervalTime = $scope.listNewDate;
                }
                else if ($scope.dataTime.length > 0) {
                    $scope.filterModel.dockQoutaIntervalTime = $scope.dataTime;
                }
                else {
                    $scope.filterModel.dockQoutaIntervalTime = $scope.getInterval;
                }

                if ($scope.filterModel.isActiveAllTime2 == 0) {
                    $scope.filterModel.DockQouta_Time = $scope.dropdownIntervalTimeOn.model.time_Start;
                    $scope.filterModel.DockQouta_Time_End = $scope.dropdownIntervalTimeEnd.model.time_End;
                } else {
                    $scope.filterModel.DockQouta_Time = "00:00";
                    $scope.filterModel.DockQouta_Time_End = "23:59";
                }

                $scope.dropdownWarehouse.model = {}
                var model = $scope.filterModel;
                if (model.dockQouta_Date != null) {
                    var ds = convertDateFilter(model.dockQouta_Date);
                    model.dockQouta_Date = ds;
                }
                if (model.dockQouta_Date_End != null) {
                    var ds = convertDateFilter(model.dockQouta_Date_End);
                    model.dockQouta_Date_End = ds;
                }

                if (model.isActiveAllTime) {
                    model.isActiveAllTime = 1;
                }
                else {
                    model.isActiveAllTime = 0;
                }
                if (model.isActiveAllTime2) {
                    model.isActiveAllTime2 = 1;
                }
                else {
                    model.isActiveAllTime2 = 0;
                }
                if ($scope.update_By != "") {
                    model.update_By = $scope.update_By
                }
                else {
                    model.create_By = localStorageService.get('userTokenStorage');
                }
                if (!Array.isArray(model.dockQoutaIntervalBreakTime)) {
                    model.dockQoutaIntervalBreakTime = [];
                }

                var checkLanguage = checkedlang()
                var messagebox = {}

                if (checkLanguage.name == 'TH') {
                    messagebox.text = 'คุณต้องการบันทึกข้อมูลหรือไม่'
                    messagebox.wh = 'กรุณาเลือกข้อมูลคลังสินค้า'
                    messagebox.dock = 'กรุณาเลือกท่าสินค้าคลังสินค้า'
                    messagebox.error = 'ไม่สามารถบันทึกได้'
                    messagebox.periodTime = 'กรุณาเลือกรอบเวลาการจอง'
                    messagebox.alert = 'แจ้งเตือน'
                }
                else {
                    messagebox.text = 'Do you want to Save !'
                    messagebox.wh = 'wareHouse is required !'
                    messagebox.dock = 'Dock is required !'
                    messagebox.periodTime = 'Period Time is required ! '
                    messagebox.error = 'Save error'
                    messagebox.alert = 'Information'
                }
                //Validate
                if (model.wareHouse_Index == undefined || model.wareHouse_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: messagebox.wh
                    })
                    return "";
                }
                if (model.docks == undefined || model.docks.length <= 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: messagebox.dock
                    })
                    return "";
                }
                if ($scope.bkItem.interval == "" || $scope.bkItem.interval == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: messagebox.periodTime
                    })
                    return "";
                }

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: messagebox.alert,
                    message: messagebox.text
                }).then(function () {
                    pageLoading.show();
                    if (model.isActive) {
                        model.isActive = 1;
                    }
                    else {
                        model.isActive = 0;
                    }
                    Add(model).then(function success(res) {
                        pageLoading.hide();

                        if (res.data != undefined) {
                            $scope.filterModel = {};
                            $vm.triggerSearch();
                        }
                    }, function error(param) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'error',
                                message: messagebox.error
                            }
                        )
                    });
                });
            }
            $scope.back = function () {
                // if ($scope.dataWorkArea != undefined) {
                //     viewModel.set($scope.dataWorkArea)
                //     $state.go('wms.location_form');
                // }
                // else {
                //     defer.resolve('1');
                // }
                defer.resolve('1');

            }

            function checkedlang() {
                $scope.switLang = {}
                if ($window.localStorage['LANGUAGE'] == "th") {
                    $scope.switLang.name = 'TH'
                } else {
                    $scope.switLang.name = 'EN'
                }
                return $scope.switLang;
            }

            function Add(param) {
                // var deferred = $q.defer();

                viewModel.SaveChanges(param).then(
                    function success(results) {
                        defer.resolve('-99');
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
            }

            //API AutoComplete
            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.filterWarehouse();
                filterDock();
                // $scope.dataWorkArea = locationFactory.get();
                // $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.filterModel = {};
                // if ($scope.dataWorkArea != undefined) {
                //     if ($scope.dataWorkArea.status == "create") {
                //         $scope.onShow = true;
                //         $vm.onShow();
                //     }
                //     if ($scope.dataWorkArea.status == "update") {
                //         $scope.onShow = true;
                //         $vm.onShow($scope.dataWorkArea);
                //     }
                // }
            };


            init();
        }
    })
})();
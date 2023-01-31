
(function () {
    'use strict'
    app.directive('bookingPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingYardDock/bookingPoup/bookingPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', 'bkYardDockFactory', 'masterVehicleTypeFactory', 'dpMessageBox', 'webServiceAPI',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, bkYardDockFactory, masterVehicleTypeFactory, dpMessageBox, webServiceAPI) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        $scope.disabled = 1;
                        $scope.disabled_ref = 1;
                        $scope.disabled_Car = 1;
                        var viewModel = bkYardDockFactory;
                        var viewModelVehicleType = masterVehicleTypeFactory;
                        $scope.onHide = function () {
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $window.localStorage.setItem("displayHead", "");
                            $window.localStorage.setItem("marginHead", "");
                            $window.localStorage.setItem("marginmenu", "120px");
                        };

                        $scope.bkItem = {}

                        $scope.detailItem = {}
                        $scope.delegate = {
                            set: function (param) {
debugger
                                $scope.ownerItems = {}
                                $scope.bkItem = param;
                                $scope.bkItem.DockQoutaIntervalBreakTime = param.dockQoutaIntervalBreakTime;
                                $scope.bkItem.dockQoutaIntervalBreakTime = [];
                                $scope.ownerItems.owner_Id = param.owner_Id;
                                $scope.ownerItems.owner_Index = param.owner_Index;
                                $scope.ownerItems.owner_Name = param.owner_Name;
                                console.log($scope.bkItem.dockQoutaIntervalBreakTime);
                                if ($scope.bkItem.documentType_Index == 'c392d865-8e69-4985-b72f-2421ebe8bcdb') {
                                    $scope.bkItem.way = 2;
                                } else {
                                    $scope.bkItem.way = 1;
                                }

                                if ($scope.bkItem.action == 'EDIT') {
                                    if (param.appointment_Date != null) {
                                        $scope.bkItem.ref_Document_Date = formatDate(param.appointment_Date);
                                    }
                                    else {
                                        var de = formatDate(param.ref_Document_Date);
                                        $scope.bkItem.ref_Document_Date = de;

                                    }
                                }

                                if (param.ref_Document_No == undefined) {
                                    vehicleType(param.vehecleType)
                                }
                                if ($scope.bkItem.details.length > 0) {
                                    $scope.detailList = $scope.bkItem.details;
                                    $scope.action = "EDIT"
                                    $scope.disabled_ref = 2;
                                    if ($scope.detailList.length > 0) {
                                        angular.forEach($scope.detailList, function (value, key) {
                                            value.select_vehicle = {}
                                            value.select_vehicle.vehicleType_Name = value.vehicleType_Name;
                                            value.select_vehicle.vehicleType_Index = value.vehicleType_Index;
                                            value.select_vehicle.vehicleType_Id = value.vehicleType_Id;
                                        })
                                    }
                                }
                                else {
                                    $scope.detailList = [];
                                    $scope.vehicleTypeModel();
                                    $scope.action = "NEW"
                                    $scope.disabled_ref = 1;
                                }

                                $scope.Details = {};

                            }
                        }
                        $scope.delegates = $scope.delegate;



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
                        function convertDate(param) {
                            var year = param.substring(0, 4);
                            var month = param.substring(4, 6);
                            var day = param.substring(6, 8);
                            month = parseInt(month) - 1;
                            var a = new Date(year, month, day);
                            return a;
                        }

                        function vehicleType(param) {
                            $scope.dropdownTypeCar = []
                            var items = param;
                            angular.forEach(items, function (value, key) {
                                let veTypes = {}
                                veTypes.vehicleType_Name = value.vehicleType_Name;
                                veTypes.vehicleType_Index = value.vehicleType_Index;
                                veTypes.vehicleType_Id = value.vehicleType_Id;
                                $scope.dropdownTypeCar.push(veTypes);
                            })
                        }

                        $scope.vehicleTypeModel = function () {
                            $scope.criteria = {}
                            viewModelVehicleType.filter($scope.criteria).then(function (res) {
                                $scope.dropdownTypeCar = res.data.itemsVehicleType;
                            });
                        }

                        $scope.add = function () {

                            var items = {};
                            var items = angular.copy($scope.bkItem);
                            if (items.ref_Document_Date != null || items.ref_Document_Date[0] != null) {
                                items.ref_Document_Date = convertDate(items.ref_Document_Date);
                            }
                            if ($scope.invokes.add) {
                                var checkLanguage = checkedlang()
                                var messagebox = {}

                                if (checkLanguage.name == 'TH') {
                                    messagebox.refNo = 'กรุณาระะบุเลขที่เอกสาร !'
                                    messagebox.refDate = 'กรุณาระะบุวันที่จองเอกสาร !'
                                    messagebox.owner = 'กรุณาระะบุรหัสบริษัท !'
                                    messagebox.typecar = 'กรุณาเลือกประเภทรถ !'
                                    messagebox.vehicleNo = 'กรุณาระบุทะเบียนรถ !'
                                    messagebox.alert = 'แจ้งเตือน'
                                }
                                else {
                                    messagebox.refNo = 'Please Input Document No !'
                                    messagebox.refDate = 'Please Input Booking Date  !'
                                    messagebox.owner = 'Please Input CustomerId !'
                                    messagebox.typecar = 'Please select Typecar !'
                                    messagebox.vehicleNo = 'Please Input License !'
                                    messagebox.alert = 'Information'
                                }

                                if (items.ref_Document_No == null || items.ref_Document_No == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.refNo
                                    })
                                    return "";

                                }
                                if (items.ref_Document_Date == null || items.ref_Document_Date == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.refDate
                                    })
                                    return "";
                                }

                                if (items.owner_Index == null || items.owner_Index == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.owner
                                    })
                                    return "";
                                }

                                items.owner_Index = "00000000-0000-0000-0000-000000000000"
                                items.owner_Id = "-";
                                items.owner_Name = "-";


                                $scope.dropdownTypeCar = {}
                                if ($scope.bkItem.action == "EDIT") {

                                    var datalist = $scope.detailItem;
                                    $scope.Detail = [];
                                    if ($scope.detailList.length > 0) {
                                        angular.forEach($scope.detailList, function (value, key) {
                                            if (value.inserted == 0) {
                                                var newData = {};
                                                // if (value.select_vehicle == undefined || value.select_vehicle.vehicleType_Index == "") {
                                                //     dpMessageBox.alert({
                                                //         ok: 'Close',
                                                //         title: messagebox.alert,
                                                //         message: messagebox.typecar
                                                //     })
                                                //     return "";
                                                // }
                                                if (value.vehicle_No == null || value.vehicle_No == "") {
                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: messagebox.alert,
                                                        message: messagebox.vehicleNo
                                                    })
                                                    return "";
                                                }

                                                newData.driver_Name = value.driver_Name;
                                                // newData.vehicleType_Id = value.select_vehicle.vehicleType_Id;
                                                // newData.vehicleType_Index = value.select_vehicle.vehicleType_Index;
                                                // newData.vehicleType_Name = value.select_vehicle.vehicleType_Name;
                                                newData.vehicle_No = value.vehicle_No;
                                                newData.inserted = 1;
                                                $scope.Detail.push(newData);
                                            }
                                            else {
                                                // if (value.select_vehicle == undefined || value.select_vehicle.vehicleType_Index == "") {
                                                //     dpMessageBox.alert({
                                                //         ok: 'Close',
                                                //         title: messagebox.alert,
                                                //         message: messagebox.typecar
                                                //     })
                                                //     return "";
                                                // }
                                                if (value.vehicle_No == null || value.vehicle_No == "") {
                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: messagebox.alert,
                                                        message: messagebox.vehicleNo
                                                    })
                                                    return "";
                                                }
                                                $scope.Detail.push(value);
                                            }
                                        })

                                        items.details = $scope.Detail;

                                    } else if (datalist != null) {
                                        // if (datalist.vehicleType_Index == undefined || datalist.vehicleType_Index == "") {
                                        //     dpMessageBox.alert({
                                        //         ok: 'Close',
                                        //         title: messagebox.alert,
                                        //         message: messagebox.typecar
                                        //     })
                                        //     $scope.vehicleTypeModel();
                                        //     return "";
                                        // }

                                        if (datalist.vehicle_No == undefined || datalist.vehicle_No == "") {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: messagebox.alert,
                                                message: messagebox.vehicleNo
                                            })
                                            $scope.vehicleTypeModel();
                                            return "";
                                        }
                                        $scope.Detail.push(datalist);
                                        items.details = $scope.Detail;
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: messagebox.alert,
                                            message: "กรุณากรอก ข้อมูลรถ"
                                        })
                                        return "";
                                    }
                                    $scope.detailItem = {};
                                    // $scope.dropdownTypeCar.model = {}
                                }
                                else {
                                    var datalist = $scope.detailList;
                                    $scope.Details = [];
                                    angular.forEach(datalist, function (value, key) {
                                        var newData = {};
                                        if (value.appointmentItemDetail_Index != undefined) {
                                            value.vehicleType_Name = value.vehicleType_Name.vehicleType_Name
                                        }
                                        else {
                                            value.vehicleType_Id = value.vehicleType_Name.vehicleType_Id
                                            value.vehicleType_Index = value.vehicleType_Name.vehicleType_Index
                                            value.vehicleType_Name = value.vehicleType_Name.vehicleType_Name
                                        }
                                    })

                                    items.details = datalist;
                                }
                                $scope.bkItem = {};
                                $scope.invokes.add(items);
                            }

                        }


                        $scope.selectTypeCar = function (param) {
                            $scope.disabled_Car = 2;
                            if ($scope.dropdownTypeCar.model != undefined) {
                                $scope.detailItem.vehicleType_Name = $scope.dropdownTypeCar.model.vehicleType_Name;
                                $scope.detailItem.vehicleType_Index = $scope.dropdownTypeCar.model.vehicleType_Index;
                                $scope.detailItem.vehicleType_Id = $scope.dropdownTypeCar.model.vehicleType_Id;
                                if ($scope.bkItem.details.length == 0) {
                                    $scope.bkItem.details.push(angular.copy($scope.dropdownTypeCar.model));
                                }

                            }
                            else {
                                $scope.bkItem.vehicleType_Name = ''
                                $scope.bkItem.vehicleType_Index = ''
                                $scope.bkItem.vehicleType_Id = ''
                            }
                        }



                        var _guid = function () {

                            function s4() {
                                return Math.floor((1 + Math.random()) * 0x10000)
                                    .toString(16)
                                    .substring(1);
                            }
                            var a = s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                                s4() + '-' + s4() + s4() + s4();


                            return a;
                        }
                        $scope.addDetails = function () {
                            var items = $scope.bkItem;
                            var datalist = $scope.detailItem;

                            var newData = {};

                            var checkLanguage = checkedlang()
                            var messagebox = {}

                            if (checkLanguage.name == 'TH') {
                                messagebox.typecar = 'กรุณาเลือกประเภทรถ !'
                                messagebox.vehicleNo = 'กรุณาระบุทะเบียนรถ !'
                                messagebox.alert = 'แจ้งเตือน'
                            }
                            else {
                                messagebox.typecar = 'Please select Typecar !'
                                messagebox.vehicleNo = 'Please Input License !'
                                messagebox.alert = 'Information'
                            }

                            if (datalist.length <= 0) {
                                // if (datalist.vehicleType_Index == undefined || datalist.vehicleType_Index == "") {
                                //     dpMessageBox.alert({
                                //         ok: 'Close',
                                //         title: messagebox.alert,
                                //         message: messagebox.typecar
                                //     })
                                //     return "";
                                // }
                                if (datalist.vehicle_No == undefined || datalist.vehicle_No == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.vehicleNo
                                    })
                                    return "";
                                }
                            }

                            $scope.Detail = [];
                            if ($scope.detailList.length > 0) {

                                angular.forEach($scope.detailList, function (value, key) {
                                    if (value.inserted == 0) {
                                        // if (value.select_vehicle == undefined || value.select_vehicle.vehicleType_Index == "") {
                                        //     dpMessageBox.alert({
                                        //         ok: 'Close',
                                        //         title: messagebox.alert,
                                        //         message: messagebox.typecar
                                        //     })
                                        //     return "";
                                        // }
                                        if (value.vehicle_No == null || value.vehicle_No == "") {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: messagebox.alert,
                                                message: messagebox.vehicleNo
                                            })
                                            return "";
                                        }
                                        var newData = {};
                                        newData.driver_Name = value.driver_Name;
                                        // newData.vehicleType_Id = value.select_vehicle.vehicleType_Id;
                                        // newData.vehicleType_Index = value.select_vehicle.vehicleType_Index;
                                        // newData.vehicleType_Name = value.select_vehicle.vehicleType_Name;
                                        newData.vehicle_No = value.vehicle_No;
                                        newData.inserted = 1;
                                        $scope.Detail.push(newData);
                                    }
                                    else {
                                        $scope.Detail.push(value);
                                    }
                                })

                                items.details = $scope.Detail;

                            }
                            else {
                                newData.id = _guid();
                                newData.driver_Name = datalist.driver_Name;
                                // newData.vehicleType_Id = datalist.vehicleType_Id;
                                // newData.vehicleType_Index = datalist.vehicleType_Index;
                                // newData.vehicleType_Name = datalist.vehicleType_Name;
                                newData.vehicle_No = datalist.vehicle_No;
                                newData.inserted = 1;
                                $scope.detailList.push(newData);
                                items.details = $scope.detailList;
                            }
                            if ($scope.detailList.length > 0) {
                                angular.forEach($scope.detailList, function (value, key) {

                                    if (value.inserted == 0) {
                                        // value.vehicleType_Id = value.select_vehicle.vehicleType_Id;
                                        // value.vehicleType_Index = value.select_vehicle.vehicleType_Index;
                                        // value.vehicleType_Name = value.select_vehicle.vehicleType_Name;
                                        value.inserted = 1;
                                        value.id = _guid();
                                    }
                                    else {
                                        value.select_vehicle = {}
                                        // value.select_vehicle.vehicleType_Name = value.vehicleType_Name;
                                        // value.select_vehicle.vehicleType_Index = value.vehicleType_Index;
                                        // value.select_vehicle.vehicleType_Id = value.vehicleType_Id;
                                    }

                                })
                            }

                            var datalist = $scope.detailList.length;
                            $scope.detailList[datalist] = {};
                            $scope.detailList[datalist].inserted = 0;
                            $scope.dropdownTypeCar = $scope.bkItem.vehecleType;

                        }


                        $scope.itemModels = {
                            onShow: false,
                            config: {
                                title: "Route"
                            },
                            invokes: {
                                set: function () {

                                },
                                add: function (param) {
                                    debugger
                                    $scope.itemModels.onShow = !$scope.itemModels.onShow;
                                    $scope.bkItem.DockQoutaIntervalBreakTime = param.BreakTime;
                                    
                                    $scope.isResetIntervalTime = 0;
                                    if ($scope.bkItem.DockQoutaIntervalBreakTime != undefined) {
                                        if ($scope.bkItem.DockQoutaIntervalBreakTime.length > 0) {
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
                            debugger
                            if ($scope.bkItem.DockQoutaIntervalBreakTime.length > 0) {
                                var _dataDelete = angular.copy($scope.bkItem.DockQoutaIntervalBreakTime)
                                for (let index = 0; index < $scope.bkItem.DockQoutaIntervalBreakTime.length; index++) {
                                    if ($scope.bkItem.DockQoutaIntervalBreakTime[index].index == $scope.bkItem.DockQoutaIntervalBreakTime.model.index) {
                                        $scope.bkItem.DockQoutaIntervalBreakTime.splice([index], 1);
                                    }
                                }
                            }
                            if ($scope.bkItem.DockQoutaIntervalBreakTime.length <= 0) {
                                $scope.deleteTimeItem = false;
                                param.isResetIntervalTime = 1;
                            }
            
                            if ($scope.itemModels.delegates.set) {
                                param.deleteFromGet = _dataDelete;
                                param.bkItem.DockQoutaIntervalBreakTime = $scope.ItemsTime;
                                $scope.itemModels.delegates.set(param);
                            }
            
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

                        $scope.checkdeleteDetails = function (param) {
                            if ($scope.bkItem.action == "EDIT") {
                                if ($scope.detailList.length > 0) {
                                    for (let index = 0; index < $scope.detailList.length; index++) {
                                        if (param.id == $scope.detailList[index].id) {
                                            $scope.detailList.splice([index], 1);
                                        }
                                    }
                                }

                                if (param.appointmentItemDetail_Index != undefined) {
                                    $scope.deleteDetails(param);
                                }
                                if ($scope.detailList.length == 0) {
                                    $scope.detailItem = {}
                                    $scope.vehicleTypeModel();
                                }
                            }
                        }

                        $scope.deleteDetails = function (param) {
                            // var criteria = {};
                            // criteria.appointmentItemDetail_Index = param.appointmentItemDetail_Index
                            // criteria.isRemove = true;
                            var checkLanguage = checkedlang()
                            var messagebox = {}

                            if (checkLanguage.name == 'TH') {
                                messagebox.text = 'คุณต้องการลบข้อมูลใช่หรือไม่'
                                messagebox.success = 'ลบข้อมูลเสร็จสิ้น'
                                messagebox.alert = 'แจ้งเตือน'
                            }
                            else {
                                messagebox.text = 'Do you want to Delete ?'
                                messagebox.success = 'Delete Success'
                                messagebox.alert = 'Information'
                            }
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: messagebox.alert,
                                message: messagebox.text
                            }).then(function success() {
                                if ($scope.bkItem.action == "EDIT") {
                                    if ($scope.detailList.length > 0) {
                                        for (let index = 0; index < $scope.detailList.length; index++) {
                                            if ($scope.detailList[index].appointmentItemDetail_Index == param.appointmentItemDetail_Index) {
                                                $scope.detailList.splice([index], 1);
                                            }
                                        }
                                    }

                                }
                                if (param.appointmentItemDetail_Index != undefined) {
                                    var criteria = {};
                                    criteria.appointmentItemDetail_Index = param.appointmentItemDetail_Index
                                    criteria.isRemove = true;
                                }
                                viewModel.deleteDetails(criteria).then(function success(res) {
                                    if (res.data == "") {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: messagebox.alert,
                                                message: messagebox.success
                                            }
                                        )
                                        $scope.vehicleTypeModel();
                                    }

                                }, function error(res) {
                                    $scope.response = "M_ERROR";
                                    if (res.Message.data != null) {
                                        $scope.message = res.Message.data.Message;
                                    }
                                    else {
                                        $scope.message = "Data not found";
                                    }
                                });
                            });

                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            viewModel.filter(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.url = {
                            Master: webServiceAPI.Master,
                            PlanGI: webServiceAPI.PlanGI,
                            PlanGR: webServiceAPI.PlanGR,
                            PO: webServiceAPI.PO,
                            Load: webServiceAPI.Load,
                        };

                        $scope.autoComplete = {
                            owner: "Autocomplete/autoOwnerId",
                            PlanGR_NO: "AutoPlanGoodsReceive/autoPlanGoodsReceiveNoAndOwner",
                            PO_NO: "Autocomplete/autoPurchaseOrderNoAndOwner",
                            TruckloadNo: "AutoLoad/autoTruckloadNo",
                        };
                        $scope.selectOwner = function (param) {
                            if (param.owner_Name != undefined) {
                                $scope.bkItem.owner_Id = param.owner_Id;
                                $scope.bkItem.owner_Index = param.owner_Index;
                                $scope.bkItem.owner_Name = param.owner_Name;
                            }
                        }
                        $scope.selectDriver = function (param) {
                            if (param.driver_Name != undefined) {
                                $scope.bkItem.driver_Id = param.driver_Id;
                                $scope.bkItem.driver_Index = param.driver_Index;
                                $scope.bkItem.driver_Name = param.driver_Name;
                            }
                        }

                        $scope.openPickTime = function () {

                            $scope.itemModels.onShow = !$scope.itemModels.onShow;
                            if ($scope.itemModels.delegates.set) {
                                $scope.itemModels.delegates.set($scope.bkItem);
                            }
                        }

                        function initial() {
                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());
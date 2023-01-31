
(function () {
    'use strict'
    app.directive('bookingAssignDockForm', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingAssignDock/component/bookingAssignDockForm.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?',
                    searchResultModel: '=?',
                    filterModel: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', 'dpMessageBox', 'bookingAssignDockFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, dpMessageBox, bookingAssignDockFactory) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        var $vm = this;
                        var viewModel = bookingAssignDockFactory;
                        $scope.onHide = function () {
                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $window.localStorage.setItem("displayHead", "");
                            $window.localStorage.setItem("marginHead", "");
                            $window.localStorage.setItem("marginmenu", "120px");
                        };

                        $scope.bkItem = {}

                        $scope.dataItem = [];
                        $scope.delegate = {
                            set: function (param) {
                                if (param.status != "NEW") {
                                    $scope.bkItem = param;
                                    if ($scope.bkItem.isActive == 1) {
                                        $scope.bkItem.isActive = true;
                                    } else {
                                        $scope.bkItem.isActive = false;
                                    }
                                    if (param.wareHouse_Index) {

                                        $scope.dataItem = {
                                            'wareHouse_Name': param.wareHouse_Name,
                                            'wareHouse_Id': param.wareHouse_Id,
                                            'wareHouse_Index': param.wareHouse_Index,
                                        }
                                    }
                                    $scope.itemsWarehouse = $scope.dataItem;
                                    dropdownDisplayDate();
                                    if ($scope.bkItem.display_Date) {
                                        const displayDate = $scope.dropdownDisplayDate.filter(elem => elem.value == param.display_Date)
                                        $scope.dropdownDisplayDate.model = {};
                                        $scope.dropdownDisplayDate.model = displayDate[0];
                                    }

                                    if ($scope.dataItem) {
                                        $scope.itemsWarehouse = {};
                                        $scope.itemsWarehouse.model = $scope.dataItem;
                                    }
                                }
                                else {
                                    $scope.bkItem = {}
                                    dropdownDisplayDate();
                                    $scope.filterWarehouse();

                                }

                            }
                        }
                        $scope.delegates = $scope.delegate;

                        $vm.onShow = function (param) {
                            defer = $q.defer();
                            if ($scope.filterModel != null) {
                                $scope.filterModel = {};

                            }
                            $scope.onShow = true;
                            //Update
                            if (param != undefined) {
                                pageLoading.show();
                                $scope.create = false;
                                viewModel.find(param.workArea_Index).then(function (res) {
                                    pageLoading.hide();
                                    $scope.filterModel = res.data;
                                    $scope.update = true;
                                    if ($scope.filterModel.isActive == 0) {
                                        $scope.getCheck = false;
                                    } else {
                                        $scope.getCheck = true;
                                    }
                                });
                            }
                            else {
                                $scope.update = false
                                $scope.create = true;
                                $scope.getCheck = true;
                                $scope.filterModel.isActive = 1;


                            }
                            return defer.promise;
                        };

                        function checkedlang() {
                            $scope.switLang = {}
                            if ($window.localStorage['LANGUAGE'] == "th") {
                                $scope.switLang.name = 'TH'
                            } else {
                                $scope.switLang.name = 'EN'
                            }
                            return $scope.switLang;
                        }

                        $scope.save = function () {
                            var items = $scope.bkItem;
                            items.messagebox = {}
                            // $scope.dropdownDisplayDate = {}
                            // $scope.itemsWarehouse = {}
                            $scope.bkItem = {};
                            if ($scope.invokes.add) {
                                var checkLanguage = checkedlang()
                                var messagebox = {}

                                if (checkLanguage.name == 'TH') {
                                    messagebox.text = 'บันทึกข้อมูลเสร็จสิ้น';
                                    messagebox.error = 'ไม่พบข้อมูล';
                                    messagebox.wh = 'กรุณากรอกคลังสินค้า !';
                                    messagebox.alert = 'แจ้งเตือน'
                                    items.messagebox.text = messagebox.text;
                                    items.messagebox.error = messagebox.error;
                                }
                                else {
                                    messagebox.text = 'Save Success';
                                    messagebox.error = 'Data not found';
                                    messagebox.wh = 'Please Input Warehouse !';
                                    messagebox.alert = 'Information'
                                    items.messagebox.text = messagebox.text;
                                    items.messagebox.error = messagebox.error;
                                }
                                //Validate
                                if (items.wareHouse_Index == undefined || items.wareHouse_Index == "") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: messagebox.alert,
                                        message: messagebox.wh
                                    })
                                    return "";
                                }

                                $scope.invokes.add(items);
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

                        $scope.selectDate = function (param) {
                            if (param != null || param != undefined) {
                                $scope.bkItem.Display_Date = param.value;
                            }
                        }
                        $scope.selectWH = function (param) {

                            if ($scope.itemsWarehouse.model != null && $scope.itemsWarehouse != undefined) {
                                $scope.bkItem.wareHouse_Id = $scope.itemsWarehouse.model.wareHouse_Id;
                                $scope.bkItem.wareHouse_Name = $scope.itemsWarehouse.model.warehouse_Name;
                                $scope.bkItem.wareHouse_Index = $scope.itemsWarehouse.model.wareHouse_Index;
                            } else {
                                $scope.bkItem.wareHouse_Id = ''
                                $scope.bkItem.wareHouse_Name = ''
                                $scope.bkItem.wareHouse_Index = ''
                            }
                        }

                        function dropdownDisplayDate() {
                            let data = [
                                {
                                    'displayDate': '1 วัน',
                                    'value': 1
                                },
                                {
                                    'displayDate': '2 วัน',
                                    'value': 2
                                },
                                {
                                    'displayDate': '3 วัน',
                                    'value': 3
                                },
                                {
                                    'displayDate': '7 วัน',
                                    'value': 7
                                },
                                {
                                    'displayDate': '15 วัน',
                                    'value': 15
                                },
                                {
                                    'displayDate': '30 วัน',
                                    'value': 30
                                }
                            ];

                            $scope.dropdownDisplayDate = data;
                        }

                        function initial() {
                            $scope.filterWarehouse();
                            dropdownDisplayDate();
                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());
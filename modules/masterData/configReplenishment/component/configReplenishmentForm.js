(function () {
    'use strict'

    app.component('configReplenishmentForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/configReplenishment/component/configReplenishmentForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, moment, productFactory, locationFactory, productCategoryFactory, pageLoading, webServiceAPI, zoneFactory, replenishmentFactory) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;

            var viewModel = productFactory;
            $scope.tabProduct = true;
            var viewModelLocation = locationFactory;
            var viewModelproductCategoryFactory = productCategoryFactory;
            var viewModelZone = zoneFactory;
            var viewModelReplenishment = replenishmentFactory;
            $scope.isFilter = true;
            $scope.tabLocation = true;
            $scope.page = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                advanceSearch: false,
                showError: false,
                type: 1
            };
            $scope.filterModel = {
                key: '',

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

            function convertDate(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }

            $vm.onShow = function (param) {

                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.filterModel.trigger_Time = getTime();
                    $scope.filterModel.trigger_Time_End = getTime();
                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    if (param.plan_By_Location == 'No') {
                        param.plan_By_Location = 0;
                        param.chkallLocation = false;
                    }
                    else if (param.plan_By_Location == 'All') {
                        param.plan_By_Location = 2;
                        param.chkallLocation = true;
                    }
                    else {
                        param.plan_By_Location = 1;
                    }

                    if (param.plan_By_Product == 'No') {
                        param.plan_By_Product = 0;
                        param.chkAllProduct = false;
                    }
                    else if (param.plan_By_Product == 'All') {
                        param.plan_By_Product = 2;
                        param.chkAllProduct = true;
                    } else {
                        param.plan_By_Product = 1;
                    }

                    if (param.isActive == 'No') {
                        param.isActive = 0;
                    }
                    else {
                        param.isActive = 1;
                    }
                    if (param.trigger_Date != null) {
                        var ds = formatDate(param.trigger_Date);
                        param.trigger_Date = ds;
                    }
                    if (param.trigger_Date_End != null) {
                        var de = formatDate(param.trigger_Date_End);
                        param.trigger_Date_End = de;
                    }
                    if (param.trigger_Date != null) {
                        var ds = convertDate(param.trigger_Date);
                        param.trigger_Date = ds;
                    }
                    if (param.trigger_Date_End != null) {
                        var de = convertDate(param.trigger_Date_End);
                        param.trigger_Date_End = de;
                    }
                    viewModelReplenishment.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.dtChoose = $scope.filterModel.replenishmentProducts;
                        $scope.dtChooseLocation = $scope.filterModel.replenishmentLocations;

                        if ($scope.filterModel.trigger_Date != null) {
                            var ds = formatDate($scope.filterModel.trigger_Date);
                            $scope.filterModel.trigger_Date = ds;
                        }
                        if ($scope.filterModel.trigger_Date_End != null) {
                            var de = formatDate($scope.filterModel.trigger_Date_End);
                            $scope.filterModel.trigger_Date_End = de;
                        }
                        if ($scope.filterModel.plan_By_Product == 2) {
                            $scope.filterModel.chkAllProduct = true;
                        }
                        if ($scope.filterModel.plan_By_Location == 2) {
                            $scope.filterModel.chkallLocation = true;
                        }
                        if ($scope.filterModel.isActive == 1) {
                            $scope.filterModel.isActive = true;
                        }
                        $scope.create = false;
                        $scope.update = true;
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                }
                return defer.promise;
            };

            function checkDatalist() {

            }

            $scope.back = function () {
                defer.resolve('1');
            }
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsEquipment;
                });
            };

            $scope.keyEnterGetProduct = function (keyEvent) {
                if (keyEvent.which === 13) {
                    getProduct()
                }
            }

            $scope.keyEnterGetLocation = function (keyEvent) {
                if (keyEvent.which === 13) {
                    getLocation()
                }
            }

            function getZone() {

                let obj = {};

                if ($scope.filterModel) {
                    obj.key = $scope.filterModel.key;
                }

                pageLoading.show();
                viewModelZone.filter(obj).then(function (res) {
                    pageLoading.hide();
                    $scope.dtResZone = res.data.itemsZone;
                })
            }

            function getproductCategoryFactory() {
                let obj = {};
                if ($scope.filterModel) {
                    obj.key = $scope.filterModel.key;
                }

                pageLoading.show();
                viewModelproductCategoryFactory.filter(obj).then(function (res) {

                    pageLoading.hide();
                    $scope.dtResProductType = res.data.itemsProductCategory;
                })
            }
            function getLocation() {
                let obj = {};
                if ($scope.filterModel) {
                    obj.key = $scope.filterModel.key;
                }
                pageLoading.show();
                viewModelLocation.filter(obj).then(function (res) {
                    pageLoading.hide();
                    $scope.dtResLocation = res.data.itemsLocation;

                })
            }

            function getProduct() {

                let obj = {};
                if ($scope.filterItemModel) {
                    obj.key = $scope.filterItemModel.product_Id;

                }

                pageLoading.show();
                viewModel.filter(obj).then(function (res) {
                    pageLoading.hide();
                    $scope.dtRes = res.data.itemsProduct;
                    console.log(res);
                })
            }
            $scope.autoComplete = {
                owner: "AutoPlanGoodsReceive/autoOwnerfilter",
                planGoodsReceive_No: "AutoPlanGoodsReceive/autoPlanGoodsReceiveNo",
                warehouse_Name: "AutoPlanGoodsReceive/autoWarehousefilter",
                vendor: "AutoPlanGoodsReceive/autoVenderfilter",
                documentType: "AutoPlanGoodsReceive/autoDocumentTypefilter",
                processStatus: "AutoPlanGoodsReceive/autoStatusfilter",
                sku: "AutoPlanGoodsReceive/autoSkufilter",
                product: "AutoPlanGoodsReceive/autoProductfilter",
                location: "autoLocation/autoSearchLocationFilter"

            };

            $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
                Master: webServiceAPI.Master
            };

            $scope.changeStatusSelected = function () {
                if ($scope.filterModel.chkStatus) {
                    $scope.filterModel.isActive
                }
            }

            //Product/
            $scope.chkAllProduct = function () {
                if ($scope.filterModel.chkAllProduct) {
                    $scope.filterModel.Plan_By_Product = 2
                    $scope.dtChoose = [];
                }
                else {
                    $scope.filterModel.Plan_By_Product = 0
                }
            }

            //Zone & location
            $scope.chkAllItem = function () {

                if ($scope.filterModel.chkallLocation) {
                    $scope.filterModel.Plan_By_Location = 2;
                    $scope.dtChooseLocation = [];
                } else {

                    $scope.filterModel.Plan_By_Location = 0;
                }
            }
            $scope.filterModel.chkdate = true;
            //All Date
            $scope.selectAllDate = function () {
                if ($scope.filterModel.chkDateAll) {
                    noSelectDay();
                }
            }
            function noSelectDay() {
                $scope.filterModel.isMonday = false;
                $scope.filterModel.isTuesday = false;
                $scope.filterModel.isWednesday = false;
                $scope.filterModel.isThursday = false;
                $scope.filterModel.isFriday = false;
                $scope.filterModel.isSaturday = false;
                $scope.filterModel.isSunday = false;
            }
            //Clear Date
            $scope.clearDate = function () {
                if ($scope.filterModel.trigger_Date != null || $scope.filterModel.trigger_Date != undefined) {
                    $scope.filterModel.trigger_Date = null;

                    $scope.filterModel.clearSelectDate = false;
                    $scope.filterModel.chkdate = false;
                }
            }

            //Clear Date

            let countSelect = 0;
            $scope.clearPlanDate = function (param) {

                if (param == true) {
                    countSelect++;
                }
                else {
                    countSelect--;
                }
                if ($scope.filterModel.chkDateAll) {
                    noSelectDay();
                }
                else {
                    if ($scope.filterModel.trigger_Date != null) {
                        noSelectDay();
                        $scope.filterModel.chkdate = true;
                    }
                    else {
                        $scope.filterModel.chkdate = false;
                    }

                }
                if (countSelect != 0) {
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                    countSelect = 0;
                }
            }
            $scope.clearPlanDate2 = function () {
                if ($scope.filterModel.trigger_Date != null) {
                    $scope.filterModel.chkdate = false;
                }
            }
            //check Day
            $scope.checkDay = function (param) {

                if (param.isMonday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isTuesday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isWednesda == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isThursday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isFriday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isSaturday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.isSunday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
                else if (param.chkDateAll == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;

                }
            }

            $scope.userSelected = [];
            $scope.userSelectedTab2 = [];
            $scope.selectItem = function (id, index, checked, datarow, tab) {
                if (tab == 1) {
                    console.log(id);
                    console.log(index);
                    $scope.userSelected[index] = {};
                    $scope.userSelected[index].index = index;
                    $scope.userSelected[index].checked = checked;
                    $scope.userSelected[index].datarow = datarow;

                    if ($scope.userSelected[index].datarow.inserted != 1) {
                        $scope.userSelected[index].datarow.inserted = 0
                    }
                } else if (tab == 2) {
                    console.log(id);
                    console.log(index);
                    $scope.userSelectedTab2[index] = {};
                    $scope.userSelectedTab2[index].index = index;
                    $scope.userSelectedTab2[index].checked = checked;
                    $scope.userSelectedTab2[index].datarow = datarow;

                    if ($scope.userSelectedTab2[index].datarow.inserted != 1) {
                        $scope.userSelectedTab2[index].datarow.inserted = 0
                    }
                }

            }

            $scope.dtChoose = [];
            $scope.userSelected2 = [];
            $scope.selectItem2 = function (id, index, checked, datarow) {

                $scope.userSelected2[index] = {};
                $scope.userSelected2[index].index = index;
                $scope.userSelected2[index].checked = checked;
                $scope.userSelected2[index].datarow = datarow;

                if ($scope.userSelected2[index].datarow.inserted != 1) {
                    $scope.userSelected2[index].datarow.inserted = 0
                }

            }

            $scope.deleteItem = function () {
                angular.forEach($scope.userSelected2, function (value, key) {
                    if (value.checked == "checking") {
                        angular.forEach($scope.dtChoose, function (value2, key2) {
                            if (value2.product_Index == value.datarow.product_Index && value.datarow.tab == 1) {
                                $scope.dtChoose.splice(key2, 1);
                            }
                            if (value2.productCategory_Index == value.datarow.productCategory_Index && value.datarow.tab == 2) {
                                $scope.dtChoose.splice(key2, 1);
                            }
                        });
                    }
                });

                $scope.userSelected2 = [];
            }

            //Product/
            $scope.chooseItem = function () {
                if ($scope.filterModel.chkAllProduct != true) {
                    angular.forEach($scope.userSelected, function (value, key) {
                        if (value.checked == "checking") {
                            if ($scope.dtChoose.length <= 0) {
                                value.datarow.inserted = 1
                                value.datarow.tab = 1;
                                $scope.dtChoose.push(value.datarow);
                            } else {

                                if ($scope.dtChoose.filter(elem => elem.product_Index == value.datarow.product_Index && elem.inserted == 1).length <= 0) {
                                    value.datarow.inserted = 1
                                    //      $scope.dtChoose[value.index] = value.datarow;
                                    value.datarow.tab = 1;
                                    $scope.dtChoose.push(value.datarow);

                                }
                            }
                        }
                    });

                    angular.forEach($scope.userSelectedTab2, function (value, key) {

                        if (value.checked == "checking") {
                            if ($scope.dtChoose.length <= 0) {
                                value.datarow.inserted = 1
                                value.datarow.tab = 2;
                                $scope.dtChoose.push(value.datarow);
                            } else {

                                if ($scope.dtChoose.filter(elem => elem.productCategory_Index == value.datarow.productCategory_Index && elem.inserted == 1).length <= 0) {
                                    value.datarow.inserted = 1
                                    value.datarow.tab = 2;
                                    //      $scope.dtChoose[value.index] = value.datarow;
                                    $scope.dtChoose.push(value.datarow);

                                }
                            }
                        }
                    });
                    $scope.userSelected = [];
                    $scope.userSelectedTab2 = [];
                }
            }


            //location/
            $scope.userSelectedLocation = [];
            $scope.userSelectedLocationTab2 = [];

            let countCheckItem = 0;
            $scope.selectItemLocation = function (id, index, checked, datarow, tab) {
                $scope.userSelectedLocation[index] = {};
                countCheckItem++;
                $scope.userSelectedLocation[index].countChecking = countCheckItem;
                let chkCount = $scope.userSelectedLocation[index].countChecking;

                if (checked == "checking" && chkCount > 1) {
                    $scope.userSelectedLocation[index].checked = "noCheck";
                    countCheckItem = 0;
                }
                else {
                    $scope.userSelectedLocation[index].checked = checked;
                }
                if (tab == 1) {
                    $scope.userSelectedLocation[index].index = index;
                    $scope.userSelectedLocation[index].datarow = datarow;

                    if ($scope.userSelectedLocation[index].datarow.inserted != 1) {
                        $scope.userSelectedLocation[index].datarow.inserted = 0
                    }
                } else if (tab == 2) {

                    $scope.userSelectedLocationTab2[index] = {};
                    $scope.userSelectedLocationTab2[index].index = index;
                    $scope.userSelectedLocationTab2[index].checked = checked;
                    $scope.userSelectedLocationTab2[index].datarow = datarow;

                    if ($scope.userSelectedLocationTab2[index].datarow.inserted != 1) {
                        $scope.userSelectedLocationTab2[index].datarow.inserted = 0
                    }
                }
            }
            $scope.dtChooseLocation = [];
            $scope.userSelectedLocation2 = [];
            $scope.selectItemLocation2 = function (id, index, checked, datarow) {

                $scope.userSelectedLocation2[index] = {};
                $scope.userSelectedLocation2[index].index = index;
                $scope.userSelectedLocation2[index].checked = checked;
                $scope.userSelectedLocation2[index].datarow = datarow;

                if ($scope.userSelectedLocation2[index].datarow.inserted != 1) {
                    $scope.userSelectedLocation2[index].datarow.inserted = 0
                }
            }

            $scope.deleteItemlocation = function () {
                angular.forEach($scope.userSelectedLocation2, function (value, key) {
                    if (value.checked == "checking") {
                        angular.forEach($scope.dtChooseLocation, function (value2, key2) {
                            if (value2.location_Index == value.datarow.location_Index && value.datarow.tab == 1) {

                                $scope.dtChooseLocation.splice(key2, 1);
                            }
                            if (value2.zone_Index == value.datarow.zone_Index && value.datarow.tab == 2) {
                                $scope.dtChooseLocation.splice(key2, 1);
                            }
                        });
                    }
                });
                $scope.userSelectedLocation2 = [];
            }

            //Location
            $scope.chooseItemLocation = function () {
                if ($scope.filterModel.chkallLocation != true) {
                    angular.forEach($scope.userSelectedLocation, function (value, key) {
                        if (value.checked == "checking" && value.datarow != undefined) {
                            if ($scope.dtChooseLocation.length <= 0) {
                                value.datarow.inserted = 1
                                value.datarow.tab = 1;
                                $scope.dtChooseLocation.push(value.datarow);
                            }
                            else {
                                if ($scope.dtChooseLocation.filter(elem => elem.location_Index == value.datarow.location_Index && elem.inserted == 1).length <= 0) {
                                    value.datarow.inserted = 1
                                    value.datarow.tab = 1;
                                    $scope.dtChooseLocation.push(value.datarow);
                                }
                            }
                        }
                    });
                    angular.forEach($scope.userSelectedLocationTab2, function (value, key) {
                        if (value.checked == "checking") {
                            if ($scope.dtChoose.length <= 0) {
                                value.datarow.inserted = 1
                                value.datarow.tab = 2;
                                $scope.dtChooseLocation.push(value.datarow);
                            } else {

                                if ($scope.dtChooseLocation.filter(elem => elem.zone_Index == value.datarow.zone_Index && elem.inserted == 1).length <= 0) {
                                    value.datarow.inserted = 1
                                    value.datarow.tab = 2;
                                    $scope.dtChooseLocation.push(value.datarow);

                                }
                            }
                        }
                    });
                    $scope.userSelectedLocationTab2 = [];
                    $scope.userSelectedLocation = [];
                }
            }


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.switchTabProduct = function () {
                $scope.tabProduct = true;
            }

            $scope.switchTabProductType = function () {
                $scope.tabProduct = false;
            }

            $scope.switchTabLocation = function () {
                $scope.tabLocation = true;
            }

            $scope.switchTabZone = function () {
                $scope.tabLocation = false;
            }

            $scope.saveReplenishment = function () {
                var model = $scope.filterModel;
                if (model.trigger_Date != null) {
                    var ds = convertDate(param.trigger_Date);
                    param.trigger_Date = ds;
                    model.trigger_Date_End = a1;
                }
                if (model.trigger_Date_End != null) {
                    var de = convertDate(param.trigger_Date_End);
                    param.trigger_Date_End = de;
                }

                if ($scope.dtChoose.length > 1) {
                    model.ReplenishmentProducts = $scope.dtChoose;
                    model.Plan_By_Product = 1;// มีการเลือกสินค้าเพื่อเข้าเติม
                }
                else if (model.Plan_By_Product != 2) {
                    model.Plan_By_Product = 0
                }

                if ($scope.dtChooseLocation.length > 1) {
                    model.Plan_By_Location = 1;
                    model.ReplenishmentLocations = $scope.dtChooseLocation;
                } else if (model.Plan_By_Location != 2) {
                    model.Plan_By_Location = 0;
                }

                pageLoading.show();
                viewModelReplenishment.saveData(model).then(function (res) {
                    var x = 1;
                    pageLoading.hide();
                    //      $scope.dtRes = res.data.itemsProduct;
                    console.log(res);
                })

            }
            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }
            function init() {
                $scope.click = 1;
                $scope.click = 3;
                $scope.hideTap = true;
                getProduct();
                getLocation();
                getproductCategoryFactory();
                getZone();
            }
            init();
            //Location//
        }
    })
})();
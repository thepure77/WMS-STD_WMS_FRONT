(function () {
    'use strict'

    app.component('tranferDynamicSlottingForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/tranferDynamicSlotting/tranferDynamicSlotting/tranferDynamicSlottingForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($filter, dpMessageBox, $scope, $q, $window, productFactory, locationFactory, localStorageService, productCategoryFactory, pageLoading, webServiceAPI, zoneFactory, tranferDynamicSlottingFactory) {
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
            var viewModelviewModeltranferDynamicSlotting = tranferDynamicSlottingFactory;
            $scope.isFilter = true;
            $scope.tabLocation = true;
            $scope.dtChoose1 = [];
            $scope.closeDay = true;
            $scope.closePeriod = false;

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



            init();



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

                    chkDefaultDate();

                    $scope.filterModel.isActive = true;

                }
                $scope.onShow = true;
                //Update

                return defer.promise;
            };


            $scope.back = function () {
                $scope.filterModel = {};
                $scope.dtChooseLocation = [];
                $scope.dtChooseLocation = [];
                $scope.dtChoose = [];
                $scope.dtChoose1 = [];
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
            $scope.keyEnterGetProductType = function (keyEvent) {
                if (keyEvent.which === 13) {
                    getproductCategoryFactory()
                }
            }


            $scope.keyEnterGetLocation = function (keyEvent) {
                if (keyEvent.which === 13) {
                    getLocation()
                }
            }


            $scope.keyEnterGetZone = function (keyEvent) {
                if (keyEvent.which === 13) {
                    getZone();
                }
            }



            function getZone() {

                let obj = {};

                if ($scope.filterModel) {
                    obj.key = $scope.filterModel.Zone;
                }


                pageLoading.show();
                viewModelZone.filter(obj).then(function (res) {
                    pageLoading.hide();
                    $scope.dtResZone = res.data.itemsZone;
                })
            }

            function getproductCategoryFactory() {
                let obj = {};
                if ($scope.filterItemModel) {
                    obj.key = $scope.filterItemModel.product_Id;
                }

                pageLoading.show();
                viewModelproductCategoryFactory.filter(obj).then(function (res) {

                    pageLoading.hide();
                    $scope.dtResProductType = res.data.itemsProductCategory;
                })
            }
            function getLocation() {
                let obj = {};
                obj.listLocationType_Index = ["F9EDDAEC-A893-4F63-A700-526C69CC0774"];
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
                })
            }
            $scope.autoComplete = {
                sku: "Autocomplete/autoSku"
            };

            $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
                Master: webServiceAPI.Master
            };



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
            // $scope.filterModel.chkdate = true;
            //All Date
            $scope.selectAllDate = function () {
                if ($scope.closePeriod) {
                    $scope.filterModel.chkDateAll = false;
                    $scope.filterModel.isMonday = false;
                    $scope.filterModel.isTuesday = false;
                    $scope.filterModel.isWednesday = false;
                    $scope.filterModel.isThursday = false;
                    $scope.filterModel.isFriday = false;
                    $scope.filterModel.isSaturday = false;
                    $scope.filterModel.isSunday = false;

                }
                if ($scope.filterModel.chkDateAll) {
                    checkAllDate(false);

                } else {
                    checkAllDate(true);
                }


            }


            function checkAllDate(param) {
                if (param == true) {
                    $scope.filterModel.isMonday = false;
                    $scope.filterModel.isTuesday = false;
                    $scope.filterModel.isWednesday = false;
                    $scope.filterModel.isThursday = false;
                    $scope.filterModel.isFriday = false;
                    $scope.filterModel.isSaturday = false;
                    $scope.filterModel.isSunday = false;
                }
                else {
                    $scope.filterModel.isMonday = true;
                    $scope.filterModel.isTuesday = true;
                    $scope.filterModel.isWednesday = true;
                    $scope.filterModel.isThursday = true;
                    $scope.filterModel.isFriday = true;
                    $scope.filterModel.isSaturday = true;
                    $scope.filterModel.isSunday = true;
                }

            }
            //Day And Period

            function chkDefaultDate() {
                $scope.filterModel.chkDateAll = true;
                $scope.filterModel.isMonday = true;
                $scope.filterModel.isTuesday = true;
                $scope.filterModel.isWednesday = true;
                $scope.filterModel.isThursday = true;
                $scope.filterModel.isFriday = true;
                $scope.filterModel.isSaturday = true;
                $scope.filterModel.isSunday = true;
            }

            $scope.chkDayPeriod = function (param) {

                if (param == 0) {
                    if ($scope.closeDay) {
                        $scope.closeDay = true;
                        $scope.closePeriod = false;

                        $scope.filterModel.chkDateAll = true;
                        $scope.filterModel.isMonday = true;
                        $scope.filterModel.isTuesday = true;
                        $scope.filterModel.isWednesday = true;
                        $scope.filterModel.isThursday = true;
                        $scope.filterModel.isFriday = true;
                        $scope.filterModel.isSaturday = true;
                        $scope.filterModel.isSunday = true;


                        $scope.filterModel.trigger_Date = null;
                        $scope.filterModel.trigger_Date_End = null;



                    } else {
                        $scope.closeDay = false;
                        $scope.closePeriod = true;
                        $scope.filterModel.chkDateAll = false;
                        $scope.filterModel.isMonday = false;
                        $scope.filterModel.isTuesday = false;
                        $scope.filterModel.isWednesday = false;
                        $scope.filterModel.isThursday = false;
                        $scope.filterModel.isFriday = false;
                        $scope.filterModel.isSaturday = false;
                        $scope.filterModel.isSunday = false;

                        $scope.filterModel.trigger_Date = $filter('date')(new Date(), 'yyyyMMdd');
                        $scope.filterModel.trigger_Date_End = $filter('date')(new Date(), 'yyyyMMdd');

                    }
                }



                if (param == 1) {



                    if ($scope.closePeriod) {
                        $scope.closeDay = false;
                        $scope.closePeriod = true;
                        $scope.filterModel.chkDateAll = false;
                        $scope.filterModel.isMonday = false;
                        $scope.filterModel.isTuesday = false;
                        $scope.filterModel.isWednesday = false;
                        $scope.filterModel.isThursday = false;
                        $scope.filterModel.isFriday = false;
                        $scope.filterModel.isSaturday = false;
                        $scope.filterModel.isSunday = false;

                        $scope.filterModel.trigger_Date = $filter('date')(new Date(), 'yyyyMMdd');
                        $scope.filterModel.trigger_Date_End = $filter('date')(new Date(), 'yyyyMMdd');

                    } else {
                        $scope.closeDay = true;
                        $scope.closePeriod = false;
                        $scope.filterModel.chkDateAll = true;
                        $scope.filterModel.isMonday = true;
                        $scope.filterModel.isTuesday = true;
                        $scope.filterModel.isWednesday = true;
                        $scope.filterModel.isThursday = true;
                        $scope.filterModel.isFriday = true;
                        $scope.filterModel.isSaturday = true;
                        $scope.filterModel.isSunday = true;

                        $scope.filterModel.trigger_Date = null;
                        $scope.filterModel.trigger_Date_End = null;


                    }
                }

            }

            //Clear Date        
            let countSelect = 0;

            $scope.chkchooseDate = function (ssss) {

                if ($scope.closePeriod) {
                    $scope.filterModel.chkDateAll = false;
                    $scope.filterModel.isMonday = false;
                    $scope.filterModel.isTuesday = false;
                    $scope.filterModel.isWednesday = false;
                    $scope.filterModel.isThursday = false;
                    $scope.filterModel.isFriday = false;
                    $scope.filterModel.isSaturday = false;
                    $scope.filterModel.isSunday = false;

                }

                if (
                    $scope.filterModel.isMonday == true &&
                    $scope.filterModel.isTuesday == true &&
                    $scope.filterModel.isWednesday == true &&
                    $scope.filterModel.isThursday == true &&
                    $scope.filterModel.isFriday == true &&
                    $scope.filterModel.isSaturday == true &&
                    $scope.filterModel.isSunday == true) {

                    $scope.filterModel.chkDateAll = true;

                } else {
                    $scope.filterModel.chkDateAll = false;

                }
            }



            $scope.clearPlanDate = function (param) {

                if (param == true) {
                    countSelect++;
                }
                else {
                    countSelect--;
                }
                if ($scope.filterModel.chkDateAll) {
                    checkAllDate(true);
                }
                else {
                    if ($scope.filterModel.trigger_Date != null) {
                        checkAllDate(true);
                        $scope.filterModel.chkdate = true;
                    }
                    else {
                        $scope.filterModel.chkdate = false;
                    }

                }
                if (countSelect != 0) {
                    if ($scope.filterModel.trigger_Date == null) {
                        $scope.filterModel.trigger_Date = null;
                        $scope.filterModel.trigger_Date_End = null;
                        $scope.filterModel.chkdate = false;
                    } else {
                        $scope.filterModel.chkdate = true;
                    }

                    countSelect = 0;
                }
            }


            $scope.checkDay = function (param) {




                if (param.isMonday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isTuesday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isWednesda == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isThursday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isFriday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isSaturday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.isSunday == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
                else if (param.chkDateAll == true) {
                    $('.daterange').daterangepicker().disabled;
                    $scope.filterModel.trigger_Date = null;
                    $scope.filterModel.trigger_Date_End = null;
                    $scope.filterModel.chkdate = false;

                }
            }

            $scope.userSelected = [];
            $scope.userSelectedTab2 = [];
            $scope.selectItem = function (id, index, checked, datarow, tab) {
                if (tab == 1) {
                    $scope.userSelected[index] = {};
                    $scope.userSelected[index].index = index;
                    $scope.userSelected[index].checked = checked;
                    $scope.userSelected[index].datarow = datarow;

                    if ($scope.userSelected[index].datarow.inserted != 1) {
                        $scope.userSelected[index].datarow.inserted = 0
                    }
                } else if (tab == 2) {
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
                        if ($scope.dtChoose1 != null) {
                            angular.forEach($scope.dtChoose1, function (value2, key2) {
                                if (value2.product_Index == value.datarow.product_Index && value.datarow.tab == 1) {
                                    $scope.dtChoose1.splice(key2, 1);
                                }
                                // else if (value.datarow.productType_Index1 && value.datarow.tab == 2) {
                                //     $scope.dtChoose1.splice(key2, 1);
                                // }
                                else if (value2.productType_Index1 == value.datarow.productCategory_Index && value.datarow.tab == 2) {
                                    if (value.datarow.productType_Index1 == value2.productType_Index1) {
                                        $scope.dtChoose1.splice(key2, 1);
                                    }

                                }
                                else if (value2.replenishment_Product_Index != undefined && value2.inserted == 0) {
                                    $scope.dtChoose1.splice(key2, 1);
                                }
                                else if (value2.replenishment_Product_Index != undefined && value2.inserted == 0) {
                                    $scope.dtChoose1.splice(key2, 1);
                                }

                            });
                        }
                        else if ($scope.dtChoose != null) {
                            angular.forEach($scope.dtChoose, function (value2, key2) {
                                if (value2.product_Index == value.datarow.product_Index && value.datarow.tab == 1) {
                                    $scope.dtChoose.splice(key2, 1);
                                }
                                if (value2.productType_Index1 == value.datarow.productType_Index1 && value.datarow.tab == 2) {
                                    $scope.dtChoose.splice(key2, 1);
                                }
                                if (value2.replenishment_Product_Index != undefined && value2.inserted == 0) {
                                    $scope.dtChoose.splice(key2, 1);
                                }
                            });
                        }

                    }
                });

                $scope.userSelected2 = [];
            }

            //Product/
            $scope.chooseItem = function () {
                if ($scope.filterModel.chkAllProduct != true) {
                    angular.forEach($scope.userSelected, function (value, key) {
                        if (value.checked == "checking" && $scope.click == 3) {
                            var newDatarow = {};

                            if ($scope.dtChoose1 != null) {
                                if ($scope.dtChoose1.length <= 0) {
                                    if (value.datarow.productType_Index != null || value.datarow.productType_Index != undefined) {
                                        newDatarow.productType_Index = value.datarow.productType_Index;
                                        newDatarow.productType_Id = value.datarow.productType_Id;
                                        newDatarow.productType_Name = value.datarow.productType_Name;
                                    }
                                    if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                        newDatarow.productCategory_Index = value.datarow.productCategory_Index;
                                        newDatarow.productCategory_Id = value.datarow.productCategory_Id;
                                        newDatarow.productCategory_Name = value.datarow.productCategory_Name;
                                    }
                                    if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                        newDatarow.product_Index = value.datarow.product_Index;
                                        newDatarow.product_Id = value.datarow.product_Id;
                                        newDatarow.product_Name = value.datarow.product_Name;
                                    }
                                    newDatarow.inserted = 1;
                                    newDatarow.tab = 1;
                                    $scope.dtChoose1.push(newDatarow);
                                }
                                else {
                                    if ($scope.dtChoose1.filter(elem => elem.product_Index == value.datarow.product_Index && elem.inserted == 1).length <= 0) {
                                        if (value.datarow.productType_Index != null || value.datarow.productType_Index != undefined) {
                                            newDatarow.productType_Index = value.datarow.productType_Index;
                                            newDatarow.productType_Id = value.datarow.productType_Id;
                                            newDatarow.productType_Name = value.datarow.productType_Name;
                                        }
                                        if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                            newDatarow.productCategory_Index = value.datarow.productCategory_Index;
                                            newDatarow.productCategory_Id = value.datarow.productCategory_Id;
                                            newDatarow.productCategory_Name = value.datarow.productCategory_Name;
                                        }
                                        if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                            newDatarow.product_Index = value.datarow.product_Index;
                                            newDatarow.product_Id = value.datarow.product_Id;
                                            newDatarow.product_Name = value.datarow.product_Name;
                                        }
                                        newDatarow.inserted = 1;
                                        newDatarow.tab = 1;
                                        $scope.dtChoose1.push(newDatarow);

                                    }
                                }
                            }
                            else {
                                if ($scope.dtChoose.length <= 0) {
                                    if (value.datarow.productType_Index != null || value.datarow.productType_Index != undefined) {
                                        newDatarow.productType_Index = value.datarow.productType_Index;
                                        newDatarow.productType_Id = value.datarow.productType_Id;
                                        newDatarow.productType_Name = value.datarow.productType_Name;
                                    }
                                    if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                        newDatarow.productCategory_Index = value.datarow.productCategory_Index;
                                        newDatarow.productCategory_Id = value.datarow.productCategory_Id;
                                        newDatarow.productCategory_Name = value.datarow.productCategory_Name;
                                    }
                                    if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                        newDatarow.product_Index = value.datarow.product_Index;
                                        newDatarow.product_Id = value.datarow.product_Id;
                                        newDatarow.product_Name = value.datarow.product_Name;
                                    }
                                    newDatarow.inserted = 1;
                                    newDatarow.tab = 1;
                                    $scope.dtChoose.push(newDatarow);
                                }
                                else {
                                    if ($scope.dtChoose.filter(elem => elem.product_Index == value.datarow.product_Index && elem.inserted == 1).length <= 0) {
                                        if (value.datarow.productType_Index != null || value.datarow.productType_Index != undefined) {
                                            newDatarow.productType_Index = value.datarow.productType_Index;
                                            newDatarow.productType_Id = value.datarow.productType_Id;
                                            newDatarow.productType_Name = value.datarow.productType_Name;
                                        }
                                        if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                            newDatarow.productCategory_Index = value.datarow.productCategory_Index;
                                            newDatarow.productCategory_Id = value.datarow.productCategory_Id;
                                            newDatarow.productCategory_Name = value.datarow.productCategory_Name;
                                        }
                                        if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                            newDatarow.product_Index = value.datarow.product_Index;
                                            newDatarow.product_Id = value.datarow.product_Id;
                                            newDatarow.product_Name = value.datarow.product_Name;
                                        }
                                        newDatarow.inserted = 1;
                                        newDatarow.tab = 1;
                                        $scope.dtChoose.push(newDatarow);

                                    }
                                }
                            }

                        }
                    });

                    angular.forEach($scope.userSelectedTab2, function (value, key) {

                        if (value.checked == "checking" && $scope.click == 4) {
                            var newDatarow2 = {};
                            if ($scope.dtChoose1 != null || $scope.dtChoose1 != undefined) {
                                if ($scope.dtChoose1.length <= 0) {
                                    if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                        newDatarow2.productType_Index1 = value.datarow.productCategory_Index;
                                        newDatarow2.productType_Id = value.datarow.productCategory_Id;
                                        newDatarow2.productType_Name = value.datarow.productCategory_Name;
                                    }
                                    if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                        newDatarow2.product_Index = value.datarow.product_Index;
                                        newDatarow2.product_Id = value.datarow.product_Id;
                                        newDatarow2.product_Name = value.datarow.product_Name;
                                    }


                                    newDatarow2.inserted = 1;
                                    newDatarow2.tab = 2;
                                    $scope.dtChoose1.push(newDatarow2);
                                }
                                else {
                                    if ($scope.dtChoose1.filter(elem => elem.productType_Index1 == value.datarow.productCategory_Index && elem.inserted == 1).length <= 0) {

                                        if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                            newDatarow2.productType_Index1 = value.datarow.productCategory_Index;
                                            newDatarow2.productType_Id = value.datarow.productCategory_Id;
                                            newDatarow2.productType_Name = value.datarow.productCategory_Name;
                                        }
                                        if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                            newDatarow2.product_Index = value.datarow.product_Index;
                                            newDatarow2.product_Id = value.datarow.product_Id;
                                            newDatarow2.product_Name = value.datarow.product_Name;
                                        }
                                        newDatarow2.inserted = 1;
                                        newDatarow2.tab = 2;
                                        $scope.dtChoose1.push(newDatarow2);

                                    }
                                }
                            }
                            else {
                                if ($scope.dtChoose.length <= 0) {
                                    if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                        newDatarow2.productType_Index1 = value.datarow.productCategory_Index;
                                        newDatarow2.productCategory_Id = value.datarow.productCategory_Id;
                                        newDatarow2.productCategory_Name = value.datarow.productCategory_Name;
                                    }
                                    if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                        newDatarow2.product_Index = value.datarow.product_Index;
                                        newDatarow2.product_Id = value.datarow.product_Id;
                                        newDatarow2.product_Name = value.datarow.product_Name;
                                    }


                                    newDatarow2.inserted = 1;
                                    newDatarow2.tab = 2;
                                    $scope.dtChoose.push(newDatarow2);
                                }
                                else {

                                    if ($scope.dtChoose.filter(elem => elem.productType_Index1 == value.datarow.productCategory_Index && elem.inserted == 1).length <= 0) {

                                        if (value.datarow.productCategory_Index != null || value.datarow.productCategory_Index != undefined) {
                                            newDatarow2.productType_Index1 = value.datarow.productCategory_Index;
                                            newDatarow2.productCategory_Id = value.datarow.productCategory_Id;
                                            newDatarow2.productCategory_Name = value.datarow.productCategory_Name;
                                        }
                                        if (value.datarow.product_Index != null || value.datarow.product_Index != undefined) {
                                            newDatarow2.product_Index = value.datarow.product_Index;
                                            newDatarow2.product_Id = value.datarow.product_Id;
                                            newDatarow2.product_Name = value.datarow.product_Name;
                                        }

                                        newDatarow2.inserted = 1;
                                        newDatarow2.tab = 2;

                                        $scope.dtChoose.push(newDatarow2);

                                    }
                                }
                            }

                        }
                    });
                    $scope.userSelected = [];
                    $scope.userSelectedTab2 = [];
                }
            }

            $scope.userSelectedLocation = [];
            $scope.userSelectedLocationTab2 = [];
            let countCheckItem = 0;

            $scope.selectItemLocation = function (id, index, checked, datarow, tab) {

                if (tab == 1) {
                    $scope.userSelectedLocation[index] = {};
                    $scope.userSelectedLocation[index].index = index;
                    $scope.userSelectedLocation[index].checked = checked;
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
                            // else if (value2.location_Index == value.datarow.location_Index && value.datarow.tab == undefined) {
                            //     $scope.dtChooseLocation.splice(key2, 1);
                            // }
                            else if (value2.zone_Index == value.datarow.zone_Index && value.datarow.tab == 2) {
                                $scope.dtChooseLocation.splice(key2, 1);
                            }
                            else if (value2.zone_Index == value.datarow.zone_Index) {
                                if (value2.location_Index == value.datarow.location_Index) {
                                    $scope.dtChooseLocation.splice(key2, 1);
                                }
                            }
                            else if (value2.location_Index == value.datarow.location_Index) {
                                if (value2.zone_Index == value.datarow.zone_Index) {
                                    $scope.dtChooseLocation.splice(key2, 1);
                                }

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
                        if (value.checked == "checking" && value.datarow != undefined && $scope.clickTabLocation == 1) {
                            var newDatarow = {};
                            if ($scope.dtChooseLocation.length <= 0) {

                                if (value.datarow.zone_Index != null || value.datarow.zone_Index != undefined) {
                                    newDatarow.zone_Index = value.datarow.zone_Index;
                                    newDatarow.zone_Id = value.datarow.zone_Id;
                                    newDatarow.zone_Name = value.datarow.zone_Name;
                                }
                                if (value.datarow.location_Index != null || value.datarow.location_Index != undefined) {
                                    newDatarow.location_Index = value.datarow.location_Index;
                                    newDatarow.location_Id = value.datarow.location_Id;
                                    newDatarow.location_Name = value.datarow.location_Name;
                                }
                                newDatarow.inserted = 1;
                                newDatarow.tab = 1;
                                $scope.dtChooseLocation.push(newDatarow);
                            }
                            else {
                                if ($scope.dtChooseLocation.filter(elem => elem.location_Index == value.datarow.location_Index && elem.inserted == 1).length <= 0) {

                                    if (value.datarow.zone_Index != null || value.datarow.zone_Index != undefined) {
                                        newDatarow.zone_Index = value.datarow.zone_Index;
                                        newDatarow.zone_Id = value.datarow.zone_Id;
                                        newDatarow.zone_Name = value.datarow.zone_Name;
                                    }
                                    if (value.datarow.location_Index != null || value.datarow.location_Index != undefined) {
                                        newDatarow.location_Index = value.datarow.location_Index;
                                        newDatarow.location_Id = value.datarow.location_Id;
                                        newDatarow.location_Name = value.datarow.location_Name;
                                    }
                                    newDatarow.inserted = 1;
                                    newDatarow.tab = 1;
                                    $scope.dtChooseLocation.push(newDatarow);
                                }
                            }
                        }
                    });
                    angular.forEach($scope.userSelectedLocationTab2, function (value, key) {
                        if (value.checked == "checking" && $scope.clickTabLocation == 2) {
                            var newDatarow2 = {};
                            if ($scope.dtChoose.length <= 0) {
                                if (value.datarow.zone_Index != null || value.datarow.zone_Index != undefined) {
                                    newDatarow2.zone_Index = value.datarow.zone_Index;
                                    newDatarow2.zone_Id = value.datarow.zone_Id;
                                    newDatarow2.zone_Name = value.datarow.zone_Name;
                                }
                                if (value.datarow.location_Index != null || value.datarow.location_Index != undefined) {
                                    newDatarow2.location_Index = value.datarow.location_Index;
                                    newDatarow2.location_Id = value.datarow.location_Id;
                                    newDatarow2.location_Name = value.datarow.location_Name;
                                }
                                newDatarow2.inserted = 1;
                                newDatarow2.tab = 2;
                                $scope.dtChooseLocation.push(newDatarow2);
                            }
                            else {
                                if ($scope.dtChooseLocation.filter(elem => elem.zone_Index == value.datarow.zone_Index && elem.inserted == 1).length <= 0) {
                                    if (value.datarow.zone_Index != null || value.datarow.zone_Index != undefined) {
                                        newDatarow2.zone_Index = value.datarow.zone_Index;
                                        newDatarow2.zone_Id = value.datarow.zone_Id;
                                        newDatarow2.zone_Name = value.datarow.zone_Name;
                                    }
                                    if (value.datarow.location_Index != null || value.datarow.location_Index != undefined) {
                                        newDatarow2.location_Index = value.datarow.location_Index;
                                        newDatarow2.location_Id = value.datarow.location_Id;
                                        newDatarow2.location_Name = value.datarow.location_Name;
                                    }

                                    newDatarow2.inserted = 1;
                                    newDatarow2.tab = 2;
                                    // value.datarow.inserted = 1
                                    // value.datarow.tab = 2;
                                    $scope.dtChooseLocation.push(newDatarow2);

                                }
                            }
                        }
                    });
                    $scope.userSelectedLocationTab2 = [];
                    $scope.userSelectedLocation = [];
                }
            }


            $scope.clickTab = function (tab) {

                if (tab == 1 || tab == 2) {

                    $scope.clickTabLocation = tab;
                } else if (tab == 4 || tab == 3) {
                    $scope.click = tab;
                }
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

            function sentProductModels(param) {
                var itemList = [];

                angular.forEach(param, function (value, key) {
                    var newDatarow = {};
                    if (value.replenishment_Product_Index != undefined || value.replenishment_Product_Index != null) {

                        if (value.replenishment_Product_Index != undefined && value.product_Index != null && value.productType_Index != null) {
                            newDatarow.productType_Index = value.productType_Index;
                            newDatarow.product_Index = value.product_Index;
                        }
                        if (value.replenishment_Product_Index != undefined && value.product_Index == null && value.productType_Index != null) {
                            newDatarow.productType_Index = value.productType_Index;
                            newDatarow.product_Index = null;
                        }
                    }
                    else {
                        if (value.productType_Index1 != undefined && value.productType_Index1 != undefined) {
                            newDatarow.productType_Index = value.productType_Index1;
                            newDatarow.product_Index = null;
                        }

                        if (value.product_Index != undefined && value.product_Index != undefined) {
                            newDatarow.productType_Index = value.productCategory_Index;
                            newDatarow.product_Index = value.product_Index;
                        }
                        if (value.location_Index != undefined && value.location_Index != undefined) {
                            newDatarow.location_Index = value.location_Index;
                            newDatarow.zone_Index = null;
                        }
                        if (value.zone_Index != undefined && value.zone_Index != undefined) {
                            newDatarow.location_Index = null;
                            newDatarow.zone_Index = value.zone_Index;
                        }

                    }


                    itemList.push(newDatarow);
                });
                return itemList;
            }

            function validatePopup(message) {
                let defer = $q.defer();
                defer.resolve(message);
                return defer.promise;
            }

            function validateTime() {
                validatePopup("Invalid Format Time (HH:MM:SS)").then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                });
            }

            function validateTimePopup(model) {
                if (model.trigger_Time.split(":").length == 3 && model.trigger_Time_End.split(":").length == 3) {


                    if (isNumber(model.trigger_Time.split(":")[0]) && isNumber(model.trigger_Time.split(":")[1]) && isNumber(model.trigger_Time.split(":")[2]) && isNumber(model.trigger_Time_End.split(":")[0]) && isNumber(model.trigger_Time_End.split(":")[1]) && isNumber(model.trigger_Time_End.split(":")[2])) {
                        if (model.trigger_Time.split(":")[0] >= 0 && model.trigger_Time.split(":")[0] <= 23 && model.trigger_Time_End.split(":")[0] >= 0 && model.trigger_Time_End.split(":")[0] <= 23) {

                        } else {

                            validateTime();
                            return false;
                        }
                        if (model.trigger_Time.split(":")[1] >= 0 && model.trigger_Time.split(":")[1] <= 59 && model.trigger_Time_End.split(":")[1] >= 0 && model.trigger_Time_End.split(":")[1] <= 59) {

                        } else {
                            validateTime();
                            return false;
                        }

                        if (model.trigger_Time.split(":")[2] >= 0 && model.trigger_Time.split(":")[2] <= 59 && model.trigger_Time_End.split(":")[2] >= 0 && model.trigger_Time_End.split(":")[2] <= 59) {

                        } else {
                            validateTime();
                            return false;
                        }


                    } else {
                        validateTime();
                        return false;
                    }

                } else {
                    validateTime();
                    return false;
                }


                return true;

            }

            function validateDatePopup(model) {

                if ($scope.closePeriod) {
                    if (convertDate(model.trigger_Date) > convertDate(model.trigger_Date_End)) {
                        validatePopup("Start Date must less than End Date").then(function (result) {
                            if (result) {
                                $scope.validateMsg = result;
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: result
                                    }
                                )
                            }
                        });
                    } else {
                        return true;
                    }

                    return false;
                }

                if ($scope.closeDay) {
                    if ($scope.filterModel.isMonday == true ||
                        $scope.filterModel.isTuesday == true ||
                        $scope.filterModel.isWednesday == true ||
                        $scope.filterModel.isThursday == true ||
                        $scope.filterModel.isFriday == true ||
                        $scope.filterModel.isSaturday == true ||
                        $scope.filterModel.isSunday == true ||
                        $scope.filterModel.chkDateAll == true) {

                        return true
                    } else {
                        validatePopup("Please Specify Day at least 1 Day").then(function (result) {
                            if (result) {
                                $scope.validateMsg = result;
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: result
                                    }
                                )
                            }
                        });
                        return false;
                    }
                }


                return true;
            }
            function isNumber(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            function checkItemProductAndLocation(model) {
                //  debugger;
                let checkTrue = false;
                if (model.chkAllProduct == null || model.chkAllProduct == false) {

                    if ($scope.dtChoose != null) {
                        if ($scope.dtChoose1.length <= 0) {

                        } else {
                            checkTrue = true;
                        }

                    }
                } else {
                    checkTrue = true;
                }

                if (model.chkallLocation == false || model.chkallLocation == undefined) {

                    if ($scope.dtChooseLocation != null) {
                        if ($scope.dtChooseLocation.length <= 0) {

                        } else {
                            checkTrue = true;
                        }
                    }

                } else {
                    checkTrue = true;
                }

                if (checkTrue == false) {
                    validatePopup("Please Specify Detial Product or Location").then(function (result) {
                        if (result) {
                            $scope.validateMsg = result;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: result
                                }
                            )
                        }
                    });
                    return false;
                }
                return checkTrue
            }



            $scope.createDynamicSlotting = function () {

                var model = $scope.filterModel;

                model.create_By = $scope.userName;
                model.update_By = $scope.userName;
                pageLoading.show();

                viewModelviewModeltranferDynamicSlotting.createDynamicSlotting(model).then(function (res) {
                    pageLoading.hide();
                    if (res.data.resultIsUse) {
                        $vm.searchResultModel = []
                        $vm.searchResultModel.push(res.data);
                        $scope.filterModel = {};
                        $scope.dtChooseLocation = [];
                        $scope.dtChoose = [];
                        $scope.dtChoose1 = [];
                        $scope.back();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: "บันทึกสำเร็จ " 
                            }
                        )
                    }else{
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: res.data.resultMsg
                            }
                        )
                    }

                    
                })

            }


            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString() + ":00"
            }
            function init() {
                $scope.clickTabLocation = 1;
                $scope.click = 3;
                $scope.hideTap = true;
                getProduct();
                getproductCategoryFactory();
                getLocation();
                getZone();

                $scope.userName = localStorageService.get('userTokenStorage');
            }

            //Location//
        }
    })
})();
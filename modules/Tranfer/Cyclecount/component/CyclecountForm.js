(function () {
    'use strict'

    app.component('cyclecountForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/Cyclecount/component/CyclecountForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cyclecountFactory, webServiceAPI) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = cyclecountFactory;
            $scope.binModel = {};
            $scope.listBinLoc = {};
            $scope.checkAll = {};
            $scope.listBinLocOld = {};
            $scope.ownerModel = {};

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
                $scope.binModel = {};
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = false;
                $scope.dropdownDocumentType();
            }

            $scope.sku = {
                chk: false
            };


            $scope.hide = function () {
                $scope.sku.chk = $scope.sku.chk === false ? true : false;
                $scope.binModel.isSku = $scope.sku.chk;
            };
            $scope.header = {
                show: true
            };

            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $vm.onShow = function (param) {
                $scope.filterModel = {};
                $scope.listBinLoc = {};
                $scope.listBinLocOld = {};
                $scope.binModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = true;
                $scope.dropdownDocumentType.model = null;
                $scope.binModel.cycleCount_Date = getToday();
                defer = $q.defer();
                $scope.onShow = true;
                $scope.sku.chk = true;
                $scope.sku.selected = true;
                $scope.isNew = false;
                $scope.ownerModel.owner_Index = "EB9DF5FC-960A-49C9-8542-0E71A90186F6";
                $scope.ownerModel.owner_Id = "0";
                $scope.ownerModel.owner_Name = "ไม่ระบุ";
                $scope.round1 = [];
                $scope.round2 = [];
                $scope.round3 = [];

                if (param != undefined) {
                    $scope.isNew = true;

                    viewModel.find(param.cycleCount_Index).then(function (res) {

                        $scope.binModel = res.data.listHeader;
                        $scope.listBinLoc = res.data.listItem;
                        $scope.listDetail = res.data.listDetail;
                        if ($scope.listDetail.length > 0) {
                           $scope.round1 = $scope.listDetail.filter(f => f.count == 1);
                           $scope.round2 = $scope.listDetail.filter(f => f.count == 2);
                           $scope.round3 = $scope.listDetail.filter(f => f.count == 3);
                        }

                        $scope.ownerModel.owner_Index = $scope.binModel.owner_Index;
                        $scope.ownerModel.owner_Id = $scope.binModel.owner_Id;
                        $scope.ownerModel.owner_Name = $scope.binModel.owner_Name;

                        var documentType = $scope.dropdownDocumentType
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Index == res.data.listHeader.documentType_Index;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];

                    });

                    return defer.promise;

                }
                else {
                    return defer.promise;

                }

            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.SearchBin = function (param) {
                var deferred = $q.defer();
                if ($scope.listBinLoc.length > 0 && $scope.isNew == true) {
                    $scope.listBinLocOld = $scope.listBinLoc;
                }
                if ($scope.listBinLoc.length > 0 && $scope.isNew == false) {
                    $scope.listBinLocOld = $scope.listBinLoc.filter(c => c.selected);
                }
                

                pageLoading.show();
                viewModel.BinSearch(param).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.length <= 0) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่พบข้อมูล'
                                }
                            )
                        }
                        $scope.listBinLoc = res.data;
                        if ($scope.listBinLocOld.length > 0) {
                            let dataList = $scope.listBinLocOld;
                            for (var i = 0; i <= dataList.length - 1; i++) {
                                $scope.listBinLoc.push(angular.copy(dataList[i]));
                            }
                        }
                        deferred.resolve(res);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ค้นหาผิดพลาด'
                            }
                        )
                    });
                return deferred.promise;
            }


            $scope.detectCheckAll = function (c) {
                if (c === true) {
                    angular.forEach($scope.listBinLoc, function (v, k) {
                        $scope.listBinLoc[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.listBinLoc, function (v, k) {
                        $scope.listBinLoc[k].selected = false;
                    });
                }
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }

            $scope.add = function (data, param) {

                var item = angular.copy(param);
                var model = {};
                model = data;
                var idx = [];
                model.cycleCount_Date = $scope.binModel.cycleCount_Date;
                model.isSku = $scope.binModel.isSku
                if ($scope.dropdownDocumentType.model == null || $scope.dropdownDocumentType.model == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกทะเบียนประเภทเอกสาร'
                        }
                    )
                    return "";
                }

                if ($scope.binModel.cycleCount_Date == null
                    || $scope.binModel.cycleCount_Date == undefined
                    || $scope.binModel.cycleCount_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose cycleCount_Date !'
                        }
                    )
                    return "";

                }
                else {
                    model.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    model.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    model.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                // if ($scope.ownerModel.owner_Id == undefined
                //     || $scope.ownerModel.owner_Id == null
                //     || $scope.ownerModel.owner_Id == "") {
                //     model.owner_Index = $scope.ownerModel.owner_Index;
                //     model.owner_Id = $scope.ownerModel.owner_Id;
                //     model.owner_Name = $scope.ownerModel.owner_Name;
                // }

                if (!isGuid($scope.ownerModel.owner_Index)) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือกเจ้าของสินค้า'
                        }
                    )
                    return "";
                }

                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                model.listBinLocation = idx;

                model.create_By = $scope.userName;
                model.operations = "ADD";
                viewModel.SaveCycleCount(model).then(function (res) {

                    if (res.data.message == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'บันทึกสำเร็จ',
                                message: 'บันทึกสำเร็จ : ' + res.data.document_No
                            }
                        )
                        model = {};
                        $scope.binModel = {};
                        $scope.listBinLoc = {};
                        $scope.dropdownDocumentType.model = {};
                        // $scope.hide();
                        defer.resolve();
                    }
                    else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถบันทึกได้'
                            }
                        )
                    }
                }, function error(model) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ไม่สามารถบันทึกได้'
                        }
                    )
                });
            }


            $scope.$watch("binModel.owner_Id", function () {
                if ($scope.binModel.owner_Id == undefined
                    || $scope.binModel.owner_Id == null
                    || $scope.binModel.owner_Id == "") {
                    $scope.binModel.owner_Index = null;
                    $scope.binModel.owner_Id = null;
                    $scope.binModel.owner_Name = null;
                }
            });

            $scope.$watch("ownerModel.owner_Id", function () {
                if ($scope.ownerModel.owner_Id == undefined
                    || $scope.ownerModel.owner_Id == null
                    || $scope.ownerModel.owner_Id == "") {
                    $scope.ownerModel.owner_Index = null;
                    $scope.ownerModel.owner_Id = null;
                    $scope.ownerModel.owner_Name = null;
                }
            });


            $scope.back = function () {
                $scope.binModel = {};
                $scope.listBinLoc = {};
                $scope.dropdownDocumentType.model = {};
                // $scope.hide();
                var model = $scope.filterModel;
                defer.resolve();

            }

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.zone_Index = angular.copy(param.zoneIndex);
                        $scope.binModel.zone_Id = angular.copy(param.zoneId);
                        $scope.binModel.zone_Name = angular.copy(param.zoneName);
                    }
                }
            };

            $scope.popupLocationType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocationType.onShow = !$scope.popupLocationType.onShow;
                    $scope.popupLocationType.delegates.locationTypePopup(param, index);
                },
                config: {
                    title: "Location Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.locationType_Index = angular.copy(param.locationTypeIndex);
                        $scope.binModel.locationType_Id = angular.copy(param.locationTypeId);
                        $scope.binModel.locationType_Name = angular.copy(param.locationTypeName);

                    }
                }
            };
            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(index);

                },
                config: {
                    title: "product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.binModel.product_Index = angular.copy(param.productIndex);
                        $scope.binModel.product_Id = angular.copy(param.productId);
                        $scope.binModel.product_Name = angular.copy(param.productName);
                        $scope.binModel.productSecond_Name = angular.copy(param.productSecondName);
                        $scope.binModel.productThird_Name = angular.copy(param.productThirdName);

                    }
                }
            };

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.autoComplete = {
                zone: "AutoCyclecount/autoZonefilter",
                locationType: "AutoCyclecount/autoLocationTypFilter",
                location: "AutoCyclecount/autoLocationFilter",
                product: "AutoCyclecount/autoProductFilter",
                owner: "AutoCyclecount/autoOwnerfilter",
            };

            $scope.url = {
                Cyclecount: webServiceAPI.Cyclecount,
            };

            $scope.popupProductCy = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupProductCy.onShow = !$scope.popupProductCy.onShow;
                    $scope.popupProductCy.delegates.productPopupCy(param);
                },
                config: {
                    title: "Product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.listProductViewModel = []
                        $scope.binModel.listProductViewModel = param;
                        if (param.length > 1) {
                            $scope.filterModel.product_Name = param[0].product_Name + "....";
                        }
                        else {
                            $scope.filterModel.product_Name = param[0].product_Name;
                        }
                    }
                }
            };

            $scope.popupZoneCy = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupZoneCy.onShow = !$scope.popupZoneCy.onShow;
                    $scope.popupZoneCy.delegates.zonePopupCy(param);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.listZoneViewModel = []
                        $scope.binModel.listZoneViewModel = param;

                        if (param.length > 1) {
                            $scope.filterModel.zone_Name = param[0].zone_Name + "....";
                        }
                        else {
                            $scope.filterModel.zone_Name = param[0].zone_Name;
                        }
                    }
                }
            };

            // Export Excel
            $scope.exportFile = {

                ExportCycleCountDetail: function () {
                    dpMessageBox.confirm({
                        title: 'Confirm.',
                        message: 'Do you want to download?'
                    }).then(function success() {
                        ExportCycleCountDetail();
                    })
                },
            }

            function ExportCycleCountDetail() {
                // var item = angular.copy($vm.searchResultModel);
                // var model = {};
                // var aa = {};

                var deferred = $q.defer();
                $scope.filterModel.excelName = $scope.binModel.cycleCount_No;
                $scope.filterModel.cycleCount_Index = $scope.binModel.cycleCount_Index;
                viewModel.ExportCycleCountDetail($scope.filterModel).then(
                    function success(results) {
                        // $vm.triggerSearch
                        deferred.resolve(results);
                    },
                    function error(response) {

                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.ClearSearch = function () {
                $scope.filterModel = {};
                $scope.binModel.locationType_Index = undefined;
                $scope.binModel.locationType_Name = undefined;
                $scope.binModel.locationType_Id = undefined;

                $scope.binModel.location_Index = undefined;
                $scope.binModel.location_Name = undefined;
                $scope.binModel.location_Id = undefined;

                $scope.sku.selected = false;
                $scope.sku.chk = false;
                $scope.binModel.movement = '';
                $scope.binModel.owner_Index = undefined;
                $scope.binModel.owner_Id = undefined;
                $scope.binModel.owner_Name = undefined;
            }

            $scope.$watch("ownerModel.owner_Index", function () {
                if (isGuid($scope.ownerModel.owner_Index) && $scope.ownerModel.owner_Index.toUpperCase() != "EB9DF5FC-960A-49C9-8542-0E71A90186F6") {
                    $scope.binModel.owner_Index = $scope.ownerModel.owner_Index;
                    $scope.binModel.owner_Id = $scope.ownerModel.owner_Id;
                    $scope.binModel.owner_Name = $scope.ownerModel.owner_Name;
                    $scope.binModel.ownerDocumentRef_No1 = $scope.ownerModel.ownerDocumentRef_No1;
                    $scope.binModel.ownerDocumentRef_No2 = $scope.ownerModel.ownerDocumentRef_No2;
                }
                else {
                    $scope.binModel.owner_Index = null;
                    $scope.binModel.owner_Id = null;
                    $scope.binModel.owner_Name = null;
                    $scope.binModel.ownerDocumentRef_No1 = null;
                    $scope.binModel.ownerDocumentRef_No2 = null;
                }
            });


            function isGuid(stringToTest) {
                if (!stringToTest) {
                    return false;
                }
                if (stringToTest[0] === "{") {
                    stringToTest = stringToTest.substring(1, stringToTest.length - 1);
                }
                var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
                return regexGuid.test(stringToTest);
            }

        }
    })
})();
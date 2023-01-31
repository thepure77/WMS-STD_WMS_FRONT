(function () {
    'use strict'
    app.component('locationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterLocation/component/locationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, locationFactory,locationWorkAreaFactory,workAreaFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.getCheck2 = false;
            $scope.getCheck3 = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = locationFactory;
            var viewModelLocationWorkArea = locationWorkAreaFactory;
            var viewModelWorkArea = workAreaFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
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
                    viewModel.find(param.location_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        if ($scope.filterModel.blockPut == 0 || $scope.filterModel.blockPut == null) {
                            $scope.getCheck2 = false;
                        } else {
                            $scope.getCheck2 = true;
                        }
                        if ($scope.filterModel.blockPick == 0 || $scope.filterModel.blockPick == null) {
                            $scope.getCheck3 = false;
                        } else {
                            $scope.getCheck3 = true;
                        }
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.getCheck2 = false;
                    $scope.getCheck3 = false;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.location_Id = "";

                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsLocation;
                });
            };

            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if($scope.click == 2){
                    $scope.searchFilterLocationWorkArea();
                }
            }

            $scope.popupLocationWorkArea = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupLocationWorkArea.onShow = !$scope.popupLocationWorkArea.onShow;
                    $scope.popupLocationWorkArea.delegates.locationWorkAreaPopup(param, index);
                },
                config: {
                    title: "LocationWorkAreaPopup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listWorkAreaViewModel = $scope.filterModel.listWorkAreaViewModel || []
                        $scope.filterModel.listWorkAreaViewModel = param;
                        $scope.searchFilterLocationWorkArea();
                    }
                }
            };


            $scope.searchFilterLocationWorkArea = function() {
                pageLoading.show();
                viewModel.filterWorkArea($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.listWorkAreaViewModel = res.data.itemsLocationWorkArea;
                    } else {
                        $scope.filterModel.listWorkAreaViewModel = res.data.itemsLocationWorkArea;
                    }
                });
            };
            $scope.limitMaxQty = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.max_Qty = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.max_Qty = 0;
                }
              };

              $scope.limitMaxWeight = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.max_Weight = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.max_Weight = 0;
                }
              };
               
              $scope.limitMaxVolume = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.max_Volume = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.max_Volume = 0;
                }
              };

                // Add New workArea
            $scope.addWorkArea = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.work_area_form');
            }

              $scope.editItemWorkArea = function (param) {
                console.log(param)
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.work_area_form')
            }
              

            //Add ข้อมูล Location
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                $scope.lang = localStorage.getItem('LANGUAGE');
                //Validate
                if (model.location_Id != "") {
                    if (!model.location_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสตำแหน่งไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.location_Id = model.location_Id;
                    }
                }

                
                if (model.location_Name == undefined || model.location_Name == "") {
                        dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อตำแหน่งจัดเก็บ'
                    })
                    return "";
                }
                if (model.locationType_Index == undefined || model.locationType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทตำแหน่งจัดเก็บ'
                    })
                    return "";
                }
                if (model.locationAisle_Index == undefined || model.locationAisle_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชั้นแถว'
                    })
                    return "";
                }
                if (model.warehouse_Index == undefined || model.warehouse_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกคลังสินค้า'
                    })
                    return "";
                }
                if (model.room_Index == undefined || model.room_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกห้อง'
                    })
                    return "";
                }
                if (model.location_Bay == undefined || model.location_Bay == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกช่อง'
                    })
                    return "";
                }
                if (model.location_Depth == undefined || model.location_Depth == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกความลึก'
                    })
                    return "";
                }
                if (model.location_Level == undefined || model.location_Level == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชั้น'
                    })
                    return "";
                }
                if (model.max_Qty == undefined || model.max_Qty == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกจำนวนสูงสุด'
                    })
                    return "";
                }
                if (model.max_Weight == undefined || model.max_Weight == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกน้ำหนักสูงสุด'
                    })
                    return "";
                }
                if (model.max_Volume == undefined || model.max_Volume == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกปริมาณสูงสุด'
                    })
                    return "";
                }
                if (model.max_Pallet == undefined || model.max_Pallet == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกจำนวนพาเลทสูงสุด'
                    })
                    return "";
                }
                if (model.putAway_Seq == undefined || model.putAway_Seq == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกลำดับการจัดเก็บ'
                    })
                    return "";
                }
                if (model.picking_Seq == undefined || model.picking_Seq == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกลำดับการหยิบ'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        Add(model).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสตำแหน่งซ้ำ'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'error',
                                    message: 'Save error'
                                }
                            )
                        });
                    });
                }
            }

            $scope.deleteLocationWorkArea = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModelLocationWorkArea.getDelete(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                      $scope.searchFilterLocationWorkArea();
                    }, function error(res) { });
                });
            };
            $scope.back = function () {
                if($scope.getModel != undefined){
                    $state.go('wms.location');
                }else{
                defer.resolve('1');
                }
            }

            function Add(param) {
                var deferred = $q.defer();
                viewModel.SaveChanges(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
        
            //API AutoComplete
            $scope.autoComplete = {
                warehouse: "Autocomplete/autoWarehouse",
                room: "Autocomplete/autoRoom",
                locationType: "Autocomplete/autoLocationType",
                locationAisle: "Autocomplete/autoLocationAisle"
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.click = 1;
                $scope.getModel = viewModelWorkArea.get();
                if($scope.getModel != undefined){
                    $scope.filterModel = $scope.getModel;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
               
                }
            };

            
            init();
        }
    })
})();
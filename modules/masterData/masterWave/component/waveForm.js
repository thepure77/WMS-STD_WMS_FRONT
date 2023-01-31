(function() {
    'use strict'

    app.component('waveForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterWave/component/waveForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, waveFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = waveFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.filterItemModel = {};
            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.wave_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                    });
                } else {
                    $scope.filterModel.wave_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;

                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsWave;
                });
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Create Header"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Create Detail"
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Preview"
                }
            ];

            $scope.defaultStep = function () {

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";
                $scope.menu_width = 0 * 50;
                $scope.menu_name = $scope.menu[0].name;

                $scope.menu[1].active = "";
                $scope.menu[1].completed = "";
                $scope.menu_name = $scope.menu[1].name;

                $scope.menu[2].active = "";
                $scope.menu[2].completed = "";
                $scope.menu_name = $scope.menu[2].name;
            }

            $scope.next = function () {
                debugger
                for (var i = 0; i < $scope.menu.length; i++) {

                    if (i == 0) {

                        if ($scope.filterModel.wave_Id != "") {
                            if (!$scope.filterModel.wave_Id.match(/^([a-z0-9])+$/i)) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสการหยิบไม่ถูกต้อง'
                                })
                                return "";
                            } else {
                                $scope.filterModel.wave_Id = $scope.filterModel.wave_Id;
                            }
                        }

                        if ($scope.filterModel.wave_Name == undefined || $scope.filterModel.wave_Name == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณากรอกชื่อการหยิบ'
                            })
                            return "";
                        }

                        if ($scope.filterModel.wave_Case == undefined || $scope.filterModel.wave_Case == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณากรอกลำดับ'
                            })
                            return "";
                        }
                       
                    }

                    if (i == 1) {
                        if ($scope.filterModel.listWaveRuleItemViewModel == undefined || $scope.filterModel.listWaveRuleItemViewModel.length == 0 ) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ต้องเพิ่มเงื่อนไขการรับอย่างน้อย 1 รายการ'
                                }
                            )
                            return "";
                        }
                    }

                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "completed";
                        i++;
                        $scope.menu[i].active = "active";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                        
                    }
            
                }
            }

            $scope.previous = function () {

                for (var i = 0; i < $scope.menu.length; i++) {
                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "";

                        i--;
                        $scope.menu[i].active = "active";
                        $scope.menu[i].completed = "";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                    }
                }
            }

             $scope.addsItem = function (param) {
                if (param.key != null) {
                    let str = param.key.split(" - ")
                    param.rule_Id = str[0]
                    param.rule_Name = str[1]
                }
                if (param.rule_Id == undefined || param.rule_Id == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากรอกเงื่อนไขการรับ'
                        }
                    )
                    return "";
                }

                if (param.rule_Name == undefined ||param.rule_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากรอกเงื่อนไขการรับ'
                        }
                    )
                    return "";
                }
             
                //if (!angular.isNumber(parseFloat($scope.filterItemModel.qty))) {
                if (!(!isNaN(parseFloat(param.waveRule_Seq)) && angular.isNumber(parseFloat(param.waveRule_Seq)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากรอกลำดับ'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat(param.waveRule_Seq) <= 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณากรอกตัวเลขมากกว่า 0'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.listWaveRuleItemViewModel == undefined) {
                    $scope.filterModel.listWaveRuleItemViewModel = $scope.filterModel.listWaveRuleItemViewModel || []
                    $scope.filterModel.listWaveRuleItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.rule_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.rule_Id = null;
                    $scope.filterItemModel.rule_Name = null;
                    $scope.filterItemModel.waveRule_Seq = null;
                }
                else if (param.rowItemIndex != undefined) {

                    $scope.filterModel.listWaveRuleItemViewModel[param.rowItemIndex].rule_Index = $scope.filterItemModel.rule_Index;
                    $scope.filterModel.listWaveRuleItemViewModel[param.rowItemIndex].key = $scope.filterItemModel.key;
                    $scope.filterModel.listWaveRuleItemViewModel[param.rowItemIndex].rule_Id = $scope.filterItemModel.rule_Id;
                    $scope.filterModel.listWaveRuleItemViewModel[param.rowItemIndex].rule_Name = $scope.filterItemModel.rule_Name;
                    $scope.filterModel.listWaveRuleItemViewModel[param.rowItemIndex].waveRule_Seq = param.waveRule_Seq;

                    $scope.filterItemModel.rule_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.rule_Id = null;
                    $scope.filterItemModel.rule_Name = null;
                    $scope.filterItemModel.waveRule_Seq = null;
                    $scope.filterItemModel.rowItemIndex = undefined;

                }
                else {
                    $scope.filterModel.listWaveRuleItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.rule_Index = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.rule_Id = null;
                    $scope.filterItemModel.rule_Name = null;
                    $scope.filterItemModel.waveRule_Seq = null;
                }
            }

            $scope.editItem = function (index) {

                $scope.index = index;
                $scope.filterItemModel.rule_Index = $scope.filterModel.listWaveRuleItemViewModel[index].rule_Index;
                $scope.filterItemModel.key = $scope.filterModel.listWaveRuleItemViewModel[index].rule_Id + " - " + $scope.filterModel.listWaveRuleItemViewModel[index].rule_Name;
                $scope.filterItemModel.rule_Id = $scope.filterModel.listWaveRuleItemViewModel[index].rule_Id;
                $scope.filterItemModel.rule_Name = $scope.filterModel.listWaveRuleItemViewModel[index].rule_Name;
                $scope.filterItemModel.waveRule_Seq = $scope.filterModel.listWaveRuleItemViewModel[index].waveRule_Seq;

                $scope.filterItemModel.rowItemIndex = index;
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }



            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.wave_Id != "") {
                    if (!model.wave_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสการหยิบไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.wave_Id = model.wave_Id;
                    }
                }
                if (model.wave_Name == undefined || model.wave_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อการหยิบ'
                    })
                    return "";
                }
                if ($scope.filterModel.listWaveRuleItemViewModel == undefined || $scope.filterModel.listWaveRuleItemViewModel.length == 0 ) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ต้องเพิ่มเงื่อนไขการรับอย่างน้อย 1 รายการ'
                        }
                    )
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                                $scope.defaultStep();
                            }else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสการหยิบซ้ำ'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'error',
                                message: 'Save error'
                            })
                        });
                    });
                }
            }

           

            //ย้อนกลับ
            $scope.back = function() {
                defer.resolve('1');
            }

            //function Add
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

            $scope.autoComplete = {
                rule: "Autocomplete/autoRule",

            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();
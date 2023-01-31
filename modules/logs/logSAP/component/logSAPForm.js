(function () {
    'use strict'
    app.component('logSAPForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/logs/logSAP/component/logSAPForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, userFactory, webServiceAPI, configUserGroupMenuFactory) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = userFactory;
            var viewModelUserGroupMenu = configUserGroupMenuFactory;
            $scope.isShowPass = true;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.isBlock = true;
            $scope.check = false;
            document.getElementById("myInput").disabled = false;

            function getUserGroupMenu() {
                viewModelUserGroupMenu.getUserGroupMenu({}).then(function (res) {
                    $scope.dropdownUserGroupMenu = res.data;
                });
            };

            var init = function () {
                getUserGroupMenu();
                $scope.dataLogin = userFactory.getParam2();
                if ($scope.dataLogin != undefined && $scope.dataLogin.status_Id == 0) {

                    $scope.onShow = true;
                    $scope.formPage = $scope.dataLogin.formPage;
                    viewModel.find($scope.dataLogin.user_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.key = res.data.userGroup_Name;
                        $scope.update = true;
                        var data = document.getElementById("myInput");
                        document.getElementById("myInput").disabled = true;
                        if (data.type === "text") {
                            data.type = "password";
                        }
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.isResetPass = true;
                        $scope.isShowPass = false;
                        $scope.login = 1;
                        if ($scope.login = 1) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเปลี่ยนรหัสเมื่อแรกเข้า'
                                }
                            )
                        }
                    });
                    // $scope.filterModel.isUseDocumentType = $scope.dataGT.isUseDocumentType;
                }else if ($scope.dataLogin != undefined && $scope.dataLogin.checkupdate == true) {
                    $scope.onShow = true;
                    $scope.formPage = $scope.dataLogin.formPage;
                    viewModel.find($scope.dataLogin.user_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.key = res.data.userGroup_Name;
                        var UserGroupMenu = $scope.dropdownUserGroupMenu;

                        // const resultsUserMenu = UserGroupMenu.filter((UserGroupMenu) => {
                        //     return UserGroupMenu.userGroup_Index == res.data.userGroup_Index;
                        // })
                        // $scope.dropdownUserGroupMenu.model = resultsUserMenu[0];
                        
                        $scope.update = true;
                        $scope.update = false;
                        $scope.isBlock = false;
                        var data = document.getElementById("myInput");
                        document.getElementById("myInput").disabled = false;
                        if (data.type === "text") {
                            data.type = "password";
                        }
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.isResetPass = false;
                        $scope.isShowPass = false;
                        $scope.login = 1;
                        if ($scope.login = 1) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเปลี่ยนรหัสผ่าน เนื่องจากรหัสผ่านหมดอายุ'
                                }
                            )
                        }
                    });
                }else if ($window.localStorage['checkchangepassword'] == 1 ) {
                    $scope.onShow = true;
                    $scope.check  = true;
                    $window.localStorage['checkchangepassword'] = 0;
                    $scope.formPage = $scope.dataLogin.formPage;
                    viewModel.find($scope.dataLogin.user_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.key = res.data.userGroup_Name;

                        var UserGroupMenu = $scope.dropdownUserGroupMenu;
                        const resultsUserMenu = UserGroupMenu.filter((u) => {
                            return u.userGroup_Index == res.data.userGroup_Index;
                        })
                        $scope.dropdownUserGroupMenu.model = resultsUserMenu[0];

                        var data = document.getElementById("myInput");
                        document.getElementById("myInput").disabled = true;
                        if (data.type === "text") {
                            data.type = "password";
                        }
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.isResetPass = true;
                        $scope.isShowPass = false;
                        $scope.update = true;
                        $scope.create = false;
                    });
                }
                else {
                    $scope.filterModel = {};
                }
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();

            $vm.onShow = function (param) {
                $scope.login == 1
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    viewModel.find(param.user_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.filterModel.key = res.data.userGroup_Name;

                        var UserGroupMenu = $scope.dropdownUserGroupMenu;
                        const resultsUserMenu = UserGroupMenu.filter((u) => {
                            return u.userGroup_Index == res.data.userGroup_Index;
                        })
                        $scope.dropdownUserGroupMenu.model = resultsUserMenu[0];

                        var data = document.getElementById("myInput");
                        document.getElementById("myInput").disabled = true;
                        if (data.type === "text") {
                            data.type = "password";
                        }
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.isResetPass = true;
                        $scope.isShowPass = false;
                        $scope.update = true;
                        $scope.create = false;
                    });
                }
                else {
                    var data = document.getElementById("myInput");
                    document.getElementById("myInput").disabled = false;
                    $scope.isResetPass = false;
                    $scope.isShowPass = true;
                    $scope.update = false;
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.status_Emp = 'Active';

                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsUser;
                });
            };

            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.first_Name == undefined || model.first_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อ'
                    })
                    return "";
                }
                if (model.last_Name == undefined || model.last_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกนามสกุล'
                    })
                    return "";
                }
                //if (model.position_Code == undefined || model.position_Code == "" && $scope.login != 1) {
                //    dpMessageBox.alert({
                //        ok: 'Close',
                //        title: 'แจ้งเตือน',
                //        message: 'กรุณากรอกรหัสตำแหน่ง'
                //    })
                //    return "";
                //}
                //if (model.position_Name == undefined || model.position_Name == "" && $scope.login != 1) {
                //    dpMessageBox.alert({
                //        ok: 'Close',
                //        title: 'แจ้งเตือน',
                //        message: 'กรุณากรอกชื่อตำแหน่ง'
                //    })
                //    return "";
                //}
                //if (model.station_Code == undefined || model.station_Code == "" && $scope.login != 1) {
                //    dpMessageBox.alert({
                //        ok: 'Close',
                //        title: 'แจ้งเตือน',
                //        message: 'กรุณากรอกรหัสแผนก'
                //    })
                //    return "";
                //}
                if (model.station_Name == undefined || model.station_Name == "" && $scope.login != 1) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อแผนก'
                    })
                    return "";
                }
                //if (model.branch_Code == undefined || model.branch_Code == "") {
                //    dpMessageBox.alert({
                //        ok: 'Close',
                //        title: 'แจ้งเตือน',
                //        message: 'กรุณากรอกรหัสหน่วยงาน'
                //    })
                //    return "";
                //}
                if (model.branch_Name == undefined || model.branch_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อหน่วยงาน'
                    })
                    return "";
                }
                if (model.emp_Code == undefined || model.emp_Code == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกรหัสพนักงาน'
                    })
                    return "";
                }
                if (model.user_Name == undefined || model.user_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้ใช้งาน'
                    })
                    return "";
                }else if (model.user_Name.length < 6){
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาระบุชื่อผู้ใช้งาน 6 ตัวขึ้นไป'
                    })
                    return "";
                }
                var regularExpression_special  = /(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]).{1,}/ 
                var regularExpression_character  = /(?=(.*[0-9]))(?=.*[a-z])(?=(.*[A-Z])).{6,}/ 
                if (model.user_Password == undefined || model.user_Password == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกรหัสผ่าน'
                    })
                    return "";
                }else if (model.user_Password.length < 6 ) {
                    debugger
                    if(regularExpression_special.test(model.user_Password)){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากำหนดเป็นตัวอักษรพิมพ์เล็ก/ใหญ่ และตัวเลขเท่านั้น'
                        })
                        return "";
                    }else{
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุรหัสผ่าน 6 ตัวขึ้นไป'
                        })
                        return "";
                    }
                }else if(regularExpression_special.test(model.user_Password) || !regularExpression_character.test(model.user_Password)) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากำหนดเป็นตัวอักษรพิมพ์เล็ก/ใหญ่ และตัวเลขเท่านั้น'
                    })
                    return "";
                }
                // if (model.userGroup_Index == undefined || model.userGroup_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกกลุ่มสิทธิ์'
                //     })
                //     return "";
                // }
                if ($scope.isBlock != false){
                    if (!$scope.dropdownUserGroupMenu.model) {
                        $scope.filterModel.userGroup_Index = null;
                        $scope.filterModel.userGroup_Id = null;
                        $scope.filterModel.warehouse_Name = null;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากรอกกลุ่มสิทธิ์'
                        })
                        return "";
                    }
                    else {
                        $scope.filterModel.userGroup_Index = $scope.dropdownUserGroupMenu.model.userGroup_Index;
                        $scope.filterModel.userGroup_Id = $scope.dropdownUserGroupMenu.model.userGroup_Id;
                        $scope.filterModel.userGroup_Name = $scope.dropdownUserGroupMenu.model.userGroup_Name;
                    }
                }
                
                if (model.status_Emp == undefined || model.status_Emp == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'Status is required !!'
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
                                if ($scope.login = 1) {
                                    $window.localStorage['isBlock'] = true;
                                    $window.localStorage['isGoIndex'] = 1;
                                    $scope.login = 0
                                    $scope.dataLogin = {};
                                    $scope.dropdownUserGroupMenu.model = {};
                                    userFactory.setParam2($scope.dataLogin)
                                    $state.go('home');
                                }

                                else {
                                    defer.resolve('1');
                                    $scope.filterModel = {};
                                }

                            }else{
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'error',
                                        message: 'ไม่สามารถเปลี่ยนเป็นรหัสเดิมได้'
                                    }
                                )
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



            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.user_Name == undefined) {
            //         msg = ' UserName is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.userGroup_Name == null) {
            //         msg = ' UserGroup is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.user_Password == null) {
            //         msg = ' UserPassword is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);
            //     return defer.promise;
            // }

            $scope.back = function () {
                $scope.dropdownUserGroupMenu.model = {};
                if($scope.check){
                    $state.go('wms.index');
                }else{defer.resolve('1');}
                
            }
            $scope.isResetPassword = function () {
                $scope.filterModel.userPassword = null;
                $scope.isShowPass = true;
                $scope.isResetPass = false;
                var data = document.getElementById("myInput");
                data.disabled = false;
                data.type = "text";
                $scope.showPassword();
            }
            $scope.showPassword = function () {
                var data = document.getElementById("myInput");
                if (data.type === "password") {
                    data.type = "text";
                }
                else {
                    data.type = "password";
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



            $scope.autoComplete = {
                userGroup: "Autocomplete/autoUserGroup",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };


        }
    })
})();
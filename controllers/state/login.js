
'use strict';
app.controller('loginController', ['$scope', '$location', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', 'authService', 'localStorageService', 'dpMessageBox', 'userFactory',
    function ($scope, $location, ngAuthSettings, $state, pageLoading, $window, commonService, authService, localStorageService, dpMessageBox, userFactory) {
        $scope.loginData = {};
        $scope.component = {};

        var viewModel = userFactory;
        pageLoading.hide();
        $scope.login = function (username, password) {

            var loginData = {
                "Username": username,
                "UserPassword": password
            }

            //let data = $scope.loginData;
            if (loginData.Username != undefined && loginData.Username.length < 6) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'Username และ Password ไม่ถูกต้อง'
                })
                return "";
            }

            else if (loginData.UserPassword != undefined && loginData.UserPassword.length < 6) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาระบุรหัสผ่าน 6 ตัวขึ้นไป'
                })
                return "";
            }
            else if (loginData.Username != null && loginData.UserPassword != null) {
                pageLoading.show();

                viewModel.addUser(loginData).then(function (res) {
                    pageLoading.hide();
                    if (res.data.userName == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Username และ Password ไม่ถูกต้อง'
                        })
                        return "";
                    }
                    else {
                        viewModel.setParam(res.data.userName);
                        $scope.component.username = res.data.userName;
                        if (viewModel.getParam()) {
                            $window.localStorage['userlogin'] = JSON.stringify(res.data.userlogin);
                            $window.localStorage['isReload'] = 1;
                            $window.localStorage['userGroupName'] = res.data.userGroupName;
                            $window.localStorage['m3n7'] = JSON.stringify(res.data.userMenuViewModel);
                            // $window.localStorage['toKen'] = JSON.stringify(res.data.toKen);
                            localStorageService.set('toKen', res.data.toKen);
                            localStorageService.set('toKenRefresh', res.data.toKenRefresh);
                            $window.localStorage['reload'] = 0;
                            $window.localStorage['isGoIndex'] = 0;
                            $state.go('wms.index');
                        }
                    }
                });
            }
        };

        var init = function () {
            var rememberMe = viewModel.getParam();
            if (rememberMe != undefined) {
                $scope.loginData.User = rememberMe;
                $scope.loginData.Rememberme = true;


                // $state.go('wms.index');
                $state.transitionTo('wms.index', {}, {
                    reload: true, inherit: false, notify: true
                });
            }
        }

        init();
    }]);

'use strict';
app.controller('homeController', ['$scope', '$state', 'pageLoading', 'userFactory', '$window', '$interval', 'scanReceiveFactory', 'dpMessageBox',
    function ($scope, $state, pageLoading, userFactory, $window, $interval, scanReceiveFactory, dpMessageBox) {

        pageLoading.hide();
        $scope.component = {};
        //$scope.component.user = "นาย เรียนรู้คน เรียนรู้โลก (บริษัท ตัวอย่างจำกัด)";
        //$scope.component.title = "KASCO TRUCK QUEUE";
        $scope.userModel = {};
        $scope.isBlock = {};
        initialize();
        var viewModel = userFactory;

        $scope.logout = function () {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องออกจากระบบใช่หรือไม่'
            }).then(function success() {
                userFactory.reset();
                $state.go('login');
            });
        }

        $scope.selected = "Home";

        $scope.selectedMenu = function (selected) {
            $scope.selected = selected;

            $scope.c = '';

            if ($('html').hasClass('sidebar-left-opened')) {
                $('html').toggleClass('sidebar-left-opened');
            }
        }

        // $interval(function(){
        //     // do wahetever you need here
        //     if ($window.localStorage['MaxDelAssignKey'])
        //         {
        //             debugger
        //             var deleteuser = {};
        //             deleteuser.goodsReceiveIndex = $window.localStorage['MaxDelAssignKey'];
        //             scanReceiveFactory.deleteUserAssign(deleteuser).then(
        //                 function success(results) {
        //                     debugger
        //                     $window.localStorage.removeItem('MaxDelAssignKey');
        //                 },
        //                 function error(response) {

        //                 }
        //             );

        //         }
        // },1000);

        $scope.openMenu = function (param) {
            if (param == undefined || param == '')
                $scope.c = 'open';
            else
                $scope.c = '';

        }

        function initialize() {
            if ($scope.$parent.$stateParams != undefined) {
                var Username = $scope.$parent.$stateParams.Username;
                //userFactory.reset();
                $scope.userName = userFactory.getParam();
                $scope.userGroupName = $window.localStorage['userGroupName']
                $scope.component.userName = Username;
                $scope.userModel.user_name = $scope.userName;
                userFactory.checkStatusUser($scope.userModel).then(function (res) {
                    $window.localStorage['isBlock'] = true;
                    if (res.data.status_Id == 0) {
                        $scope.newuser = 1;
                        $scope.userModel = res.data;
                        $scope.userModel.formPage = "login";
                        userFactory.setParam2($scope.userModel)
                        $state.go('wms.user_form', { a: "" });
                    } else if (res.data.checkupdate == true) {
                        $scope.newuser = 1;
                        $scope.userModel = res.data;
                        $scope.userModel.formPage = "login";
                        userFactory.setParam2($scope.userModel)
                        $window.localStorage['isBlock'] = false;
                        $state.go('wms.user_form', { a: "" });

                    } else if (angular.fromJson($window.localStorage['isGoIndex'] == 1)) {
                        $window.localStorage['isGoIndex'] = 0;
                        $state.go('wms.index');
                    }
                    $scope.isBlock = angular.fromJson($window.localStorage['isBlock']);

                });
                $scope.m3n7 = angular.fromJson($window.localStorage['m3n7']);

            }
        }

    }
]);

app.controller('noHeaderConntroller', ['$scope', 'ngAuthSettings', '$state', 'pageLoading', '$timeout'/*, 'menuItemModel'*/,
    function ($scope, ngAuthSettings, $state, pageLoading, $timeout/*, menuItemModel*/) {


    }
]);
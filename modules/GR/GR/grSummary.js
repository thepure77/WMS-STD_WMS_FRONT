(function () {
    'use strict'

    app.component('grSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/GR/grSummary.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $window.localStorage['userGuidPlanReceive'] = getGuid();

            function getGuid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000);
                }
                return s4() + '' + s4() + '' + s4() + '' + s4() + '' +
                    s4();
            }

            function insertLogsUser()
            {
                var userLogin = JSON.parse(localStorage.userlogin);
                var logs = {};
                //logs.log_Index
                //logs.userGroup_Index
                //logs.userGroup_Id
                logs.userGroup_Name = localStorage['userGroupName'];
                logs.user_Index = userLogin.user_Index;
                logs.user_Id = userLogin.user_Id;
                logs.user_Name = userLogin.user_Name;
                logs.first_Name = userLogin.first_Name;
                logs.last_Name = userLogin.last_Name;
                logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "จัดการสินค้า ขาเข้า";
                logs.sub_Menu_Index = "D6184BDC-944E-4104-A825-80846094CA20"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "ใบรับสินค้า";
                logs.operations = "";
                //logs.ref_Document_Index
                //logs.ref_Document_No
                //logs.request_URL
                //logs.request_Body
                //logs.isActive
                //logs.isDelete
                //logs.isSystem
                logsFactory.SaveLogs(logs).then(function (res) {

                })
            };

            this.$onInit = function () {
                insertLogsUser();
            };
        }
    })
})();
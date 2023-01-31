(function () {
    'use strict'

    app.component('truckLoadSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/truckLoad/truckLoadSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };

            function insertLogsUser()
            {
                $scope.userLogin = JSON.parse($window.localStorage.userlogin);
                var logs = {};
                //logs.log_Index
                //logs.userGroup_Index
                //logs.userGroup_Id
                logs.userGroup_Name = $window.localStorage['userGroupName'];
                logs.user_Index = $scope.userLogin.user_Index;
                logs.user_Id = $scope.userLogin.user_Id;
                logs.user_Name = $scope.userLogin.user_Name;
                logs.first_Name = $scope.userLogin.first_Name;
                logs.last_Name = $scope.userLogin.last_Name;
                logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "จัดการสินค้า ขาออก";
                logs.sub_Menu_Index = "AEF7BF9F-D773-4992-BB0D-2267499CD84A";
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "การตรวจปล่อยสินค้า";
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
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                insertLogsUser();
            };

        }
    })
})();
(function () {
    'use strict'

    app.component('transferStatusLocationSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferStatusLocation/transferStatusLocationSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

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
                logs.menu_Index = "2244C514-9000-4362-A8EA-D1F80214DD0F";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "ระบบจัดการภายในคลังพัสดุ";
                logs.sub_Menu_Index = "36FD78BE-2B6E-49E2-9217-15F8FE7DDD5B"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "สแกน โอนย้ายตำแหน่งจัดเก็บ";
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
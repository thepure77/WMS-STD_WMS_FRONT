(function () {
    'use strict'

    app.component('skuSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/SKU/skuSummary.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 1,
                perPage: 30,
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
                logs.menu_Index = "EA215A7C-9666-48EC-831B-3AF22A7E39DA";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "จัดการตรวจสอบสินค้า";
                logs.sub_Menu_Index = "A74BC599-3B5F-485D-A7BC-0994080A6088"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "สรุปยอดสินค้า";
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
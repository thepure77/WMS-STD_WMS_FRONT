(function () {
    'use strict'

    app.component('stockOnRollcageSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs,  $window, commonService) {
            return "modules/Inquiry/StockOnRollcage/stockOnRollcageSummary.html";
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
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
                logs.sub_Menu_Index = "CB22523F-61E3-4646-ADE9-A3BAD17D7901"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "สรุปยอดสินค้าตามโซน";
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

            function init(){                
                $scope.setNavigation = $window.localStorage
                insertLogsUser();
            }
            //init();

        }
    })
})();
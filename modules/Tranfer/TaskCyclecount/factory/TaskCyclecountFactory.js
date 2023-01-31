(function () {
    'use strict';
    app.factory("taskcyclecountFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Cyclecount + "TaskCycleCount",
                urlDropdown: webServiceAPI.Cyclecount + "DropdownCyclecount",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                userfilter: function (model) {
                    var urlRequest = this.url + "/userfilter";
                    return clientService.post(urlRequest, model);
                },
                scanSearch: function (model) {
                    var urlRequest = this.url + "/scanSearch";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {   
                    
                    var urlRequest = this.url + "/find";
                    return clientService.post(urlRequest, model);
                },
                scanLoc: function (model) {
                    var urlRequest = this.url + "/ScanLoc";
                    return clientService.post(urlRequest, model);
                },
                scanLpn: function (model) {
                    var urlRequest = this.url + "/ScanLpn";
                    return clientService.post(urlRequest, model);
                },
                scanBarcode: function (model) {
                    var urlRequest = this.url + "/ScanBarcode";
                    return clientService.post(urlRequest, model);
                },
                scanCount: function (model) {
                    var urlRequest = this.url + "/ScanCount";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                confirmTask: function (model) {
                    var urlRequest = this.url + "/ConfirmTask";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                product: function (model) {
                    var urlRequest = this.url + "/product";
                    return clientService.post(urlRequest, model);
                },
                dropdownTaskGroup: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownTaskGroup";
                    return clientService.post(urlRequest, model);
                },
            }
        });

        function logsRequest(operations,urlRequest,model)
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
            logs.sub_Menu_Index = "0BACFDBF-4E58-4BFF-91E9-00354F0AA115"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "สแกน ตรวจนับสินค้า";
            logs.operations = operations;
            //logs.ref_Document_Index
            //logs.ref_Document_No
            logs.request_URL = urlRequest;
            logs.request_Body = JSON.stringify(model);
            //logs.isActive
            //logs.isDelete
            //logs.isSystem
            //logsFactory.SaveLogsRequest(logs).then(function (res) {

            //})
            return logs;
        };

})();
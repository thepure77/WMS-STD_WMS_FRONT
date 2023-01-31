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

                taskfilter: function (model) {
                    var urlRequest = this.url + "/taskfilter";
                    return clientService.post(urlRequest, model);
                },
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
                ScanLocation: function (model) {
                    var urlRequest = this.url + "/ScanLocation";
                    return clientService.post(urlRequest, model);
                },
                ScanBarcode: function (model) {
                    var urlRequest = this.url + "/ScanBarcode";
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
                savelogsRequest: function (model) {
                    // var urlRequest = this.url + "/createOrUpdate";
                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    
                    var resultModel = logsRequest(model.operations,"",model);
                    return clientService.post(this.urlLogsRequest, resultModel);
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
            logs.udf_1 = "Labor";
            if(model.log_udf_2 != undefined){
                logs.udf_2 = model.log_udf_2;
            }
            if(model.log_udf_3 != undefined){
                logs.udf_3 = model.log_udf_3;
            }
            if(model.log_udf_4 != undefined){
                logs.udf_4 = model.log_udf_4;
            }
            if(model.log_udf_5 != undefined){
                logs.udf_5 = model.log_udf_5;
            }
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
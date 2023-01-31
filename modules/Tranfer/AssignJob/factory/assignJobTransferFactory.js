(function () {
    'use strict';
    app.factory("assignJobTransferFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "AssignJob",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                assign: function (model){
                    var urlRequest = this.url+ "/assign";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },     
                taskfilter: function (model){
                    var urlRequest = this.url+ "/taskfilter";
                    return clientService.post(urlRequest, model);
                },   
                confirmTask: function (model){
                    var urlRequest = this.url+ "/confirmTask";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                }, 
                taskPopup: function (model){
                    var urlRequest = this.url+ "/taskPopup";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownUser: function (model){
                    var urlRequest = this.url+ "/dropdownUser";
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
            logs.sub_Menu_Index = "784F5867-1131-4B35-AB13-CE54AD56F2F3"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "มอบหมายงานโอนย้าย";
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
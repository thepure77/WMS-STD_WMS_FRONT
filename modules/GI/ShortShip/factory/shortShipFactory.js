(function () {
    'use strict';
    app.factory("ShortShipFactory",
        function (webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load + "ShortShip",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                filter: function (model) {
                    var urlRequest = this.url + "/filterV2" ;
                    return clientService.post(urlRequest, model);
                },  
                getId: function (model) {
                    var urlRequest = this.url + "/find";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                printShortShip: function (model) {
                    var urlRequest = this.url + "/printShortShip";
                    return clientService.popupReport(urlRequest, model);
                },
                approveStatus: function (model) {
                    var urlRequest = this.url + "/approveStatus";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url + "/createOrUpdate";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);
                    return clientService.post(urlRequest, model);
                },

                dropdownProcessStatus: function (model) {
                    var urlRequest = this.url + "/dropdownProcessStatus";
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
            logs.menu_Index = "8C70F353-5F5A-4325-8585-696FC4A17FAD";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาออก";
            logs.sub_Menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "ใบรายการ ShortShip";
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
(function () {
    'use strict';
    app.factory("scanPickStgToDockFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanPick",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                filter: function (model) {
                    var urlRequest = this.url + "/FilterTaskStgtodock";
                    return clientService.post(urlRequest, model);
                },
                ScanBarcode: function (model) {
                    var urlRequest = this.url + "/Scantag_Dock";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                GetTagOut: function (model) {
                    var urlRequest = this.url + "/GetTagOut";
                    return clientService.post(urlRequest, model);
                },
                ScanCarton: function (model) {
                    var urlRequest = this.url + "/ScanCarton";
                    return clientService.post(urlRequest, model);
                },
                ScanConfirm: function (model) {
                    var urlRequest = this.url + "/ScanConfirmforStgToDock";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                ScanLocaton: function (model) {
                    var urlRequest = this.url + "/ScanLocationstgtoDock";
                    return clientService.post(urlRequest, model);
                },
                ScanConfirmLocaton: function (model) {
                    var urlRequest = this.url + "/ScanConfirmLocaton";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                GetReasonCode: function (model) {
                    var urlRequest = this.url + "/GetReasonCode";
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
            logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาออก";
            logs.sub_Menu_Index = "A3CD17D5-1BE0-4F5D-9124-A39BB347DDF0"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "Move To Selecting on Ground";
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
(function () {
    'use strict';
    app.factory("putAwayFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getdata ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Putaway + "Putaway",
                urlLPN: webServiceAPI.GR + "LPNItem",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                scanLpn: function (model) {
                    var urlRequest = this.url + "/scanLpn";
                    return clientService.post(urlRequest, model);
                }, 
                scanLpnDockToStaging: function (model) {
                    var urlRequest = this.url + "/scanLpnDockToStaging";
                    return clientService.post(urlRequest, model);
                },   
                scanPutaway: function (model) {
                    var urlRequest = this.url + "/scanPutaway";
                    return clientService.post(urlRequest, model);
                },   
                scanSKU: function (model) {
                    var urlRequest = this.url + "/scanSKU";
                    return clientService.post(urlRequest, model);
                },
                suggestion: function (model) {
                    var urlRequest = this.url + "/suggestion";
                    return clientService.post(urlRequest, model);
                },   
                confirmLocation: function (model) {
                    var urlRequest = this.url + "/confirmLocation";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },  
                chkLocation: function (model) {
                    var urlRequest = this.url + "/chkLocation";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                chkLocationDockToStaging: function (model) {
                    var urlRequest = this.url + "/chkLocationDockToStaging";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },  
                SaveDockToStaging: function (model) {
                    var urlRequest = this.url + "/SaveDockToStaging";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                SavePutaway: function (model) {
                    var urlRequest = this.url + "/SavePutaway";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                filterTask: function (model) {
                    var urlRequest = this.url + "/filterTask";
                    return clientService.post(urlRequest, model);
                },
                filterTaskunPack: function (model) {
                    var urlRequest = this.url + "/filterTaskunPack";
                    return clientService.post(urlRequest, model);
                },
                filterTaskDockToStaging: function (model) {
                    var urlRequest = this.url + "/filterTaskDockToStaging";
                    return clientService.post(urlRequest, model);
                },
                sugesstionLocation: function(model) {
                    var urlRequest = this.urlLPN + "/SugesstionLocation";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                checkUserassign: function (model) {
                    var urlRequest = this.url + "/checkUserassign";
                    return clientService.post(urlRequest, model);
                },
                deleteUserassign: function (model) {
                    var urlRequest = this.url + "/deleteUserassign";
                    return clientService.post(urlRequest, model);
                },
                chkTagItem: function (model) {
                    var urlRequest = this.url + "/chkTagItem";
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
            logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาเข้า";
            logs.sub_Menu_Index = "2E52D04C-8F87-4D31-A33D-0307DA09F777"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "การจัดเก็บสินค้า";
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
(function () {
    'use strict';
    app.factory("configPiecepickItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var data
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Replenishment + "configPiecepickItem",
                url2: webServiceAPI.Replenishment + "replenishment",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                filter: function(model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                SaveChanges: function (model) {
                    var urlRequest = this.url+ "/SaveChanges";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                find: function(model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url2 + "/delete" ;
                    return clientService.post(urlRequest, model);
                },
                checkLocation: function (model) {
                    var urlRequest = this.url + "/checkLocation" ;
                    return clientService.post(urlRequest, model);
                },
                saveimport: function (model) {
                    var urlRequest = this.url + "/SaveImportList";
                    return clientService.post(urlRequest, model);
                },
                get: function () {
                    return data
                },
                savelogsRequest: function (model) {
                    var resultModel = logsRequest(model.operations,"",model);
                    return clientService.post(this.urlLogsRequest, resultModel);
                },
                Export: function (model) {
                    var urlRequest = this.url+ "/Export";
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
            logs.menu_Index = "5F8E703B-632D-4EA1-AF16-227E1090017C";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "configPiecepickItem";
            logs.sub_Menu_Index = "5F8E703B-632D-4EA1-AF16-227E1090017C"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "configPiecepickItem";
            logs.operations = operations;
            //logs.ref_Document_Index
            //logs.ref_Document_No
            logs.udf_1 = "Labor";
            // if(model.log_udf_1 != undefined){
            //     logs.udf_1 = model.log_udf_1;
            // }
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
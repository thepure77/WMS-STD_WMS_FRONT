(function () {
    'use strict';
    app.factory("rebuildIndexFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master_V2 + "Rebuild",
                urlReport: webServiceAPI.Report + "ReportRebuild",

                
                rebuildIndex: function (model) {
                    var urlRequest = this.url + "/RebuildIndex";
                    return clientService.post(urlRequest, model);
                },

                RebuildSearch: function (model) {
                    var urlRequest = this.url + "/RebuildSearch";
                    return clientService.post(urlRequest, model);
                },

                Export: function (model){
                    debugger
                    var urlRequest = this.urlReport+ "/ExportRebuild";
                    //return clientService.post(urlRequest, model);
                    return clientService.downloadExcel(urlRequest, model);
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
            logs.sub_Menu_Index = "DAC9CC95-A736-4C33-807C-6A655305408B"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "Run Wave";
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

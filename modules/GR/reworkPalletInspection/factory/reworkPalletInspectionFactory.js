(function () {
    'use strict';
    app.factory("reworkPalletInspectionFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getdata ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.WCS + "PalletInspection",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",


                checkReworkTag: function (model) {
                    var urlRequest = this.url + "/CHECK_REWORK";
                    return clientService.post(urlRequest, model);
                }, 
                createReworkTag: function (model) {
                    var urlRequest = this.url + "/REWORK_CREATE_WMS_TBL_IF_WMS_PALLET_INSPECTION";
                    return clientService.post(urlRequest, model);
                }, 
                savelogsRequest: function (model) {
                    // var urlRequest = this.urlScanReceive + "/saveReceive";
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
            logs.sub_Menu_Index = "4598A8FC-DA2A-4E18-8FC7-7BC89E45E09C"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "Rework Pallet Inspection";
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
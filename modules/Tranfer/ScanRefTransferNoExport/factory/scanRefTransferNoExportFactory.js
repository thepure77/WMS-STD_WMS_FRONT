(function () {
    'use strict';
    app.factory("scanRefTransferNoExportFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "ScanRefTransferNoExport",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlBinBalance: webServiceAPI.BinBalance,

                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },
                ScanRefTransferNo: function (model,user) {
                    var urlRequest = this.url + "/ScanTransfer/"+ model+"/"+user;
                    return clientService.get(urlRequest);
                },
                GetTransferItem: function (model,task) {
                    var urlRequest = this.url + "/GetTransferItem/"+ model+"/"+task;
                    return clientService.get(urlRequest);
                },
                Confirm: function (model) {
                    var urlRequest = this.url + "/Confirm";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                ConfirmTaskTransfer: function (model) {
                    var urlRequest = this.url + "/ConfirmTaskTransfer";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                checkLocation: function (model) {
                    var urlRequest = this.urlBinBalance + "Binbalance/checkLocation";
                    return clientService.post(urlRequest, model);
                },   
                UpdateRePutaway: function (model) {
                    var urlRequest = this.url + "/UpdateRePutaway";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
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
            logs.sub_Menu_Index = "1225F564-C41F-471B-87C3-48F6114D971E"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "โอนย้ายตำแหน่ง(อ้างอิงเอกสาร)";
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
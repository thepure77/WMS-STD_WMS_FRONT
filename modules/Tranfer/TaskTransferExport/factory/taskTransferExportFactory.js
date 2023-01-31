(function () {
    'use strict';
    app.factory("taskTransferExportFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData ;
            return {
                get: clientService.get,
                post: clientService.post,
                // url: webServiceAPI.GT + "Transfer",
                url: webServiceAPI.GT + "ScanRefTransferNoExport",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlBinBalance: webServiceAPI.BinBalance,

                filterTaskExport: function (model) {
                    // var urlRequest = this.url + "/filter";
                    var urlRequest = this.url + "/FilterGoodsTransferExport";
                    return clientService.post(urlRequest, model);
                },

                filterTaskUnpack: function (model) {
                    // var urlRequest = this.url + "/filter";
                    var urlRequest = this.url + "/FilterGoodsTransferUnPack";
                    return clientService.post(urlRequest, model);
                },

                setParam: function (model) {
                    getData = model;
                },
                getParam: function () {
                    return getData;
                },
                ScanRefTransferNo: function (model,user) {
                    var urlRequest = this.url + "/ScanTransfer/"+ model+"/"+user;
                    return clientService.get(urlRequest);
                },
                GetTransferItem: function (model) {
                    var urlRequest = this.url + "/GetTransferItem/"+ model;
                    return clientService.get(urlRequest);
                },
                Confirm: function (model) {
                    var urlRequest = this.url + "/Confirm";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                checkLocation: function (model) {
                    var urlRequest = this.urlBinBalance + "Binbalance/checkLocation";
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
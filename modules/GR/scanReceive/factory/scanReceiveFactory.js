(function () {
    'use strict';
    app.factory("scanReceiveFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR  + "goodsReceive",
                urlScanReceive: webServiceAPI.GR  + "ScanReceive",
                urlDropdown: webServiceAPI.GR + "DropdownGoodsReceive",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlScanReceive + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                scanDN: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanDN";
                    return clientService.post(urlRequest, model);
                },
                scanGR: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanGR";
                    return clientService.post(urlRequest, model);
                },
                scanUPC: function (model) {
                    var urlRequest = this.urlScanReceive + "/scanUPC";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                },
                saveReceive: function (model) {
                    var urlRequest = this.urlScanReceive + "/saveReceive";
                    return clientService.post(urlRequest, model);
                },
                filterGRItem: function (model) {
                    var urlRequest = this.urlScanReceive + "/filterGRItem";
                    return clientService.post(urlRequest, model);
                },
                deleteItem: function (model) {   
                    var urlRequest = this.urlScanReceive + "/deleteItem";
                    return clientService.post(urlRequest, model);
                },
                dropdownStorageLoc: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownStorageLoc";
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
            logs.menu_Name = "จัดการวัสดุสำรองคลัง ขาเข้า";
            logs.sub_Menu_Index = "D9EA75A3-2807-4E8F-91BF-5648A5D4BE97"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "ใบสั่งซื้อวัสดุสำรองคลัง";
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
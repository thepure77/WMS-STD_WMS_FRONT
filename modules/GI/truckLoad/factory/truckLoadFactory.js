(function () {
    'use strict';
    app.factory("truckLoadFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService,logsFactory) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Load + "TruckLoad",
                urlImg: webServiceAPI.Load + "Upload",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                filter: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                add: function (model) {   
                    var urlRequest = this.url + "/createOrUpdate";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                findImg: function (model) {   
                    var urlRequest = this.urlImg + "/findImg";
                    return clientService.post(urlRequest, model);
                },
                delete: function (model) {   
                    var urlRequest = this.url + "/delete";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                comfirmStatus: function (model) {   
                    var urlRequest = this.url + "/comfirmStatus";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                checkPlanGI: function (model) {   
                    var urlRequest = this.url + "/checkPlanGI";
                    return clientService.post(urlRequest, model);
                },
                listcomfirmStatus: function (model) {   
                    var urlRequest = this.url + "/listcomfirmStatus";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                scanLoadNo: function (model) {   
                    var urlRequest = this.url + "/scanLoadNo";
                    return clientService.post(urlRequest, model);
                },
                scanSoNo: function (model) {   
                    var urlRequest = this.url + "/scanSoNo";
                    return clientService.post(urlRequest, model);
                },
                scanProduct: function (model) {   
                    var urlRequest = this.url + "/scanProductId";
                    return clientService.post(urlRequest, model);
                },
                scanSN: function (model) {   
                    var urlRequest = this.url + "/scanSN";
                    return clientService.post(urlRequest, model);
                },
                filterPlanSN: function (model) {   
                    var urlRequest = this.url + "/filterPlanSN";
                    return clientService.post(urlRequest, model);
                },
                confirmScan: function (model) {   
                    var urlRequest = this.url + "/confirmScan";
                    return clientService.post(urlRequest, model);
                },
                deleteItem: function (model) {   
                    var urlRequest = this.url + "/deleteItem";
                    return clientService.post(urlRequest, model);
                },
                dropdownVehicleCompanyType: function (model) {   
                    var urlRequest = this.url + "/dropdownVehicleCompanyType";
                    return clientService.post(urlRequest, model);
                },
                dropdownVehicleCompany: function (model) {   
                    var urlRequest = this.url + "/dropdownVehicleCompany";
                    return clientService.post(urlRequest, model);
                },
                dropdownVehicleType: function (model) {   
                    var urlRequest = this.url + "/dropdownVehicleType";
                    return clientService.post(urlRequest, model);
                },
                findDetail: function (model) {
                    var urlRequest = this.url + "/findDetail/" + model;
                    return clientService.get(urlRequest);
                },
                ConfirmCutStock: function (model) {   
                    var urlRequest = this.url + "/ConfirmCutStock";
                    return clientService.post(urlRequest, model);
                },
                closeDocument: function (model) {   
                    var urlRequest = this.url + "/closeDocument";
                    return clientService.post(urlRequest, model);
                },
                PrintReportPrintOutShipment: function (model) {
                    var urlRequest = this.url + "/ReportPrintOutShipment";
                    return clientService.popupReport(urlRequest, model);
                },
                printOutTruckMenifest: function (model) {
                    var urlRequest = this.url + "/printOutTruckMenifest";
                    return clientService.popupReport(urlRequest, model);
                },
                printOutDeliveryNote: function (model) {
                    var urlRequest = this.url + "/printOutDeliveryNote";
                    return clientService.popupReport(urlRequest, model);
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
            logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาออก";
            logs.sub_Menu_Index = "AEF7BF9F-D773-4992-BB0D-2267499CD84A";
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "การตรวจปล่อยสินค้า";
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
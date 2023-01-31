(function () {
    'use strict';
    app.factory("goodIssueFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDataitem;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "GoodIssue",
                urlTO: webServiceAPI.GI + "MakeTagOut",
                urlExcel: webServiceAPI.GI + "PickingPlan",
                urlOMS: webServiceAPI.OMS + "MakeAMZ",
                urlDropdown: webServiceAPI.GI + "DropdownGoodsIssue",
                urlMaster: webServiceAPI.Master,
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlBom: webServiceAPI.BOM,
                urlRetail: webServiceAPI.OMS + "SHPReceive",

                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },
                setParamitem: function (model) {
                    getDataitem = model;
                },
                getParamitem: function () {
                    return getDataitem;
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                StartWave: function (model) {
                    var urlRequest = this.url + "/StartWave";
                    return clientService.post(urlRequest, model);
                },
                CloseWave: function (model) {
                    var urlRequest = this.url + "/CloseWave";
                    return clientService.post(urlRequest, model);
                },
                makeAMZ: function (model) {
                    var urlRequest = this.urlOMS + "/make";
                    return clientService.post(urlRequest, model);
                },
                Make_tagout_V3: function (model) {
                    var urlRequest = this.urlTO + "/maketagOut_no_V3";
                    return clientService.post(urlRequest, model);
                },
                Check_budget: function (model) {

                    var urlRequest = this.urlOMS + "/Check_Budget_A_W/" + model;
                    return clientService.get(urlRequest);
                },
                Check_Budget_Auto: function (model) {

                    var urlRequest = this.urlOMS + "/Check_Budget_Auto";
                    return clientService.post(urlRequest, model);
                },
                Cancel_GI: function (model) {

                    var urlRequest = this.urlOMS + "/Cancel_GI/" + model;
                    return clientService.get(urlRequest);
                },
                Cancel_GI_WB: function (model) {

                    var urlRequest = this.urlOMS + "/Cancel_GI_WB/" + model;
                    return clientService.get(urlRequest);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                goodsissueHeader: function (model) {
                    var urlRequest = this.url + "/goodsissueHeader";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                pickProduct: function (model) {
                    var urlRequest = this.url + "/pickProduct";
                    return clientService.post(urlRequest, model);
                },
                deletePickProduct: function (model) {
                    var urlRequest = this.url + "/deletePickProduct";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                ListdeletePickProduct: function (model) {
                    var urlRequest = this.url + "/ListdeletePickProduct";
                    return clientService.post(urlRequest, model);
                },
                runwave: function (model) {
                    var urlRequest = this.url + "/runwave";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                CutSlots: function (model) {
                    var urlRequest = this.url + "/CutSlots";
                    return clientService.post(urlRequest, model);
                },
                CloseDocument: function (model) {
                    var urlRequest = this.url + "/CloseDocument";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },

                dropdownCurrency: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCurrency";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentTypeWave: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentTypeWave";
                    return clientService.post(urlRequest, model);
                },
                dropdownWarehouse: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownWarehouse";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownOwner: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownOwner";
                    return clientService.post(urlRequest, model);
                },
                PopupGIRunWave: function (model) {
                    var urlRequest = this.url + "/PopupGIRunWave";
                    return clientService.post(urlRequest, model);
                },
                updateStatusAddData: function (model) {
                    var urlRequest = this.url + "/updateStatusAddData";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/ConfirmStatus";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                deleteDocument: function (model) {
                    var urlRequest = this.url + "/DeleteDocument";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, urlRequest);

                    return clientService.post(urlRequest, model);
                },
                CancelPGI: function (model) {
                    var urlRequest = this.url + "/CancelPGI";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },

                PrintGI: function (model) {
                    var urlRequest = this.url + "/PrintGI";

                    // var resultModel = logsRequest(model.operations, urlRequest, model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                findUser: function (model) {
                    var urlRequest = this.url + "/findUser";
                    return clientService.post(urlRequest, model);
                },
                SentToSap: function (model) {
                    var urlRequest = this.url + "/sendToSap";
                    return clientService.post(urlRequest, model);
                },
                Send_Retail: function (model) {
                    var urlRequest = this.urlRetail + "/Send_Retail/" + model;
                    return clientService.get(urlRequest);
                },
                //master
                getOwner: function (model) {
                    var urlRequest = this.urlMaster + "/Owner/ownerfilter";
                    return clientService.post(urlRequest, model);
                },
                runwaveandHeader: function (model) {
                    var urlRequest = this.url + "/runwaveandHeader";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                PopupBomRunWave: function (model) {
                    var urlRequest = this.urlBom + "/Bom/PopupBomRunWave";
                    return clientService.post(urlRequest, model);
                },
                runwaveandHeaderBom: function (model) {
                    var urlRequest = this.url + "/runwaveandHeaderBom";
                    return clientService.post(urlRequest, model);
                },
                PrintReportPrintOutGI: function (model) {
                    var urlRequest = this.url + "/ReportPrintOutGI";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                ExportExcel: function (model) {
                    var urlRequest = this.urlExcel + "/ExportExcel";
                    return clientService.downloadExcel(urlRequest, model);
                },
                // savelogsRequest: function (model) {
                //     // var urlRequest = this.url + "/createOrUpdate";
                //     // var resultModel = logsRequest(model.operations,urlRequest,model);
                    
                //     var resultModel = logsRequest(model.operations,"",model);
                //     return clientService.post(this.urlLogsRequest, resultModel);
                // }, 
            }
        });

    // function logsRequest(operations, urlRequest, model) {
    //     var userLogin = JSON.parse(localStorage.userlogin);
    //     var logs = {};
    //     //logs.log_Index
    //     //logs.userGroup_Index
    //     //logs.userGroup_Id
    //     logs.userGroup_Name = localStorage['userGroupName'];
    //     logs.user_Index = userLogin.user_Index;
    //     logs.user_Id = userLogin.user_Id;
    //     logs.user_Name = userLogin.user_Name;
    //     logs.first_Name = userLogin.first_Name;
    //     logs.last_Name = userLogin.last_Name;
    //     logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
    //     //logs.menuType_Index
    //     //logs.menu_Id
    //     logs.menu_Name = "จัดการสินค้า ขาออก";
    //     logs.sub_Menu_Index = "132BB45C-E436-44C4-A252-AAE6F3D11ADE"
    //     //logs.sub_MenuType_Index
    //     //logs.sub_Menu_Id
    //     logs.sub_Menu_Name = "ใบจ่ายสินค้า";
    //     logs.operations = operations;
    //     //logs.ref_Document_Index
    //     //logs.ref_Document_No
    //     logs.udf_1 = "Labor";
    //     if (model.log_udf_2 != undefined) {
    //         logs.udf_2 = model.log_udf_2;
    //     }
    //     if (model.log_udf_3 != undefined) {
    //         logs.udf_3 = model.log_udf_3;
    //     }
    //     if (model.log_udf_4 != undefined) {
    //         logs.udf_4 = model.log_udf_4;
    //     }
    //     if (model.log_udf_5 != undefined) {
    //         logs.udf_5 = model.log_udf_5;
    //     }
    //     logs.request_URL = urlRequest;
    //     logs.request_Body = JSON.stringify(model);
    //     //logs.isActive
    //     //logs.isDelete
    //     //logs.isSystem
    //     //logsFactory.SaveLogsRequest(logs).then(function (res) {

    //     //})
    //     return logs;
    // };

})();

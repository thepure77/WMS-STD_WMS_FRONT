(function () {
    'use strict';
    app.factory("planGoodsIssueFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PlanGI + "PlanGoodsIssue",
                urlOMS: webServiceAPI.OMS + "MakeAMZ" ,
                urlDropdown: webServiceAPI.PlanGI + "DropdownPlanGoodsIssue",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlTranfer: webServiceAPI.OMS + "OMStoAMZ",

                TransferGI: function (model) {
                    var urlRequest = this.urlTranfer + "/TranferGI";
                    return clientService.get(urlRequest);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url + "/createOrUpdate";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                find: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                Check_budget: function (model) {
                    var urlRequest = this.urlOMS + "/Check_Budget/"+model;
                    return clientService.get(urlRequest);
                },
                Cancel_GI: function (model) {
                    
                    var urlRequest = this.urlOMS + "/Cancel_GI/"+model;
                    return clientService.get(urlRequest);
                },
                Resend_WB: function (model) {
                    debugger
                    var urlRequest = this.urlOMS + "/Resend_WB/"+model;
                    return clientService.get(urlRequest);
                },
                Resend_E: function (model) {
                    debugger
                    var urlRequest = this.urlOMS + "/Resend_E/"+model;
                    return clientService.get(urlRequest);
                },
                Cancel_AMZ_08: function (model) {
                    debugger
                    var urlRequest = this.urlOMS + "/Cancel_AMZ_08";
                    return clientService.post(urlRequest, model);
                },
                AMZ_07: function (model) {
                    debugger
                    var urlRequest = this.urlOMS + "/AMZ_07";
                    return clientService.post(urlRequest, model);
                },
                AMZ_07_02: function (model) {
                    debugger
                    var urlRequest = this.urlOMS + "/AMZ_07_02";
                    return clientService.post(urlRequest, model);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/delete";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url + "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                comfirmPostDate: function (model) {
                    var urlRequest = this.url + "/comfirmPostDate";
                    return clientService.post(urlRequest, model);
                },
                closeDocument: function (model) {
                    var urlRequest = this.url + "/closeDocument" + "/";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                firstOrder: function (model) {
                    var urlRequest = this.url + "/confirmFirstOrder" + "/";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownwarehouse: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownwarehouse";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownTypeCar: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownTypeCar";
                    return clientService.post(urlRequest, model);
                },
                dropdownTransport: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownTransport";
                    return clientService.post(urlRequest, model);
                },
                PrintPlanGoodsIssue: function (model) {
                    var urlRequest = this.url + "/PrintPlanGoodsIssue";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                popupGI: function (model) {
                    var urlRequest = this.url + "/popupGI";
                    return clientService.post(urlRequest, model);
                },
                dropdownCostCenter: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCostCenter";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownStorageLoc: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownStorageLoc";
                    return clientService.post(urlRequest, model);
                }, 
                PrintOutPGI: function (model) {
                    var urlRequest = this.url+ "/PrintOutPGI";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                findUser: function (model) {
                    var urlRequest = this.url + "/findUser";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownWeight";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownVolume: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownCurrency: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCurrency";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownRoute: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRoute";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownSubRoute: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownSubRoute";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownRound: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownShippingMethod: function (model) {
                    var urlRequest = this.urlDropdown + "/shippingMethoddropdown";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownShippingTerms: function (model) {
                    var urlRequest = this.urlDropdown + "/shippingTermsdropdown";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownPaymentType: function (model) {
                    var urlRequest = this.urlDropdown + "/paymentTypedropdown";
                    return clientService.post(urlRequest, model);
                }, 
                PrintReportPrintOutGI: function (model) {
                    var urlRequest = this.url + "/printReportPO";
                    return clientService.popupReport(urlRequest, model);
                },
                printReportBilling: function (model) {
                    var urlRequest = this.url + "/printReportBilling";
                    return clientService.popupReport(urlRequest, model);
                },
                printOutDeliveryNote: function (model) {
                    var urlRequest = this.url + "/printOutDeliveryNote";
                    return clientService.popupReport(urlRequest, model);
                },
                printProductReturn: function (model) {
                    var urlRequest = this.url + "/printProductReturn";
                    return clientService.popupReport(urlRequest, model);
                },
                printOutDeliveryNoteemergency: function (model) {
                    var urlRequest = this.url + "/printOutDeliveryNoteemergency";
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
            logs.sub_Menu_Index = "DC483D7E-4ACE-4ECD-ACBA-A73E938C5536"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "ใบขอโอนสินค้า";
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
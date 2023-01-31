(function () {
    'use strict';
    app.factory("purchaseOrderFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.PO + "PurchaseOrder",
                urlDropdown: webServiceAPI.PO + "Dropdown",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                FilterSearch: function (model){
                    var urlRequest = this.url+ "/filter";
                    return clientService.post(urlRequest, model);
                }, 
                filterPopup: function (model) {  
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.post(urlRequest,model);                    
                },   
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {                    
                    var urlRequest = this.url + "/delete";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },
                add: function (model) {   
                    var urlRequest = this.url + "/createOrUpdate";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },             
                closeDocument: function (model) {    
                    var urlRequest = this.url + "/closeDocument" + "/";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                },    
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },        
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                CheckDocumentStatus: function (model) {
                    var urlRequest = this.url + "/checkDocumentStatus/";
                    return clientService.post(urlRequest, model);
                }, 
                PlanGoodsIssuePopup: function (model) {
                    var urlRequest = this.url + "/popupPlanGoodsIssuefilter";
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
                dropdownCostCenter: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCostCenter";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownWeight: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownWeight";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownCurrency: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCurrency";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownVolume: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownShipmentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownShipmentType";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownContainerType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownContainerType";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownDockDoor: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDockDoor";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownVehicleType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownVehicleType";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownCargoType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCargoType";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownDocumentPriority: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentPriority";
                    return clientService.post(urlRequest, model);
                }, 
                dropdownUnloadingType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownUnloadingType";
                    return clientService.post(urlRequest, model);
                }, 
                
                PrintPurchaseOrder: function (model) {
                    var urlRequest = this.url+ "/PrintPurchaseOrder";
                    return clientService.popupReport(urlRequest, model);
                },

                PrintReportDN: function (model) {
                    var urlRequest = this.url+ "/PrintReportDN";
                    return clientService.popupReport(urlRequest, model);
                },
                cancel: function (model) {    
                    var urlRequest = this.url + "/cancel" + "/";

                    var resultModel = logsRequest(model.operations,urlRequest,model);
                    clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest,model);
                }

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
(function () {
    'use strict';
    app.factory("transferExportFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getDefault;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GT + "TransferExport",
                urlPick: webServiceAPI.GT + "PickBinbalanceTransfer",

                urlSRTN: webServiceAPI.GT + "ScanRefTransferNoExport",
                urlOMS: webServiceAPI.OMS + "MakeAMZ",
                urlTest: webServiceAPI.GT + "DropdownGoodsTransfer",
                urlBinbalance: webServiceAPI.BinBalance + "PickBinbalance",
                urlWCSV2: webServiceAPI.WCSV2 + "ASRSIssuing",
                urlPGI: webServiceAPI.PlanGI,
                urlMaster: webServiceAPI.Master,
                
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",
                urlWCSBypass: webServiceAPI.WCSV2 + "WMS",

                FilterSearch: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },

                ConfirmDynamic: function (model) {
                    var urlRequest = this.urlWCSV2 + "/CREATE_WMS_TBL_IF_WMS_ASRS_SO_RELOCATION_DYNAMIC_SLOTTING";
                    return clientService.post(urlRequest, model);
                },

                WCSBypass: function (model) {
                    var urlRequest = this.urlWCSBypass + "/PREPARE_TRANSFER";
                    return clientService.post(urlRequest, model);
                },

                WCSRelocation: function (model) {
                    var urlRequest = this.urlWCSV2 + "/CREATE_WMS_TBL_IF_WMS_ASRS_SO_RELOCATION";
                    return clientService.post(urlRequest, model);
                },

                //bottom current is not use
                filterPopup: function (model) {
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/delete";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url + "/createOrUpdate";
                    return clientService.post(urlRequest, model);
                },
                makeAMZ: function (model) {
                    var urlRequest = this.urlOMS + "/make";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";
                    return clientService.post(urlRequest, model);
                },
                closeDocument: function (model) {

                    var urlRequest = this.url + "/closeDocument" + "/";
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
                CheckDocumentStatus: function (model) {
                    var urlRequest = this.url + "/checkDocumentStatus/";
                    return clientService.post(urlRequest, model);
                },
                PlanGoodsIssuePopup: function (model) {
                    var urlRequest = this.url + "/popupPlanGoodsIssuefilter";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {

                    var urlRequest = this.urlTest + "/dropdownStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownwarehouse: function (model) {
                    var urlRequest = this.urlTest + "/dropdownwarehouse";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.urlTest + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlTest + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.urlTest + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                dropdownTypeCar: function (model) {
                    var urlRequest = this.urlTest + "/dropdownTypeCar";
                    return clientService.post(urlRequest, model);
                },
                dropdownTransport: function (model) {
                    var urlRequest = this.urlTest + "/dropdownTransport";
                    return clientService.post(urlRequest, model);
                },
                dropdownWeight: function (model) {
                    var urlRequest = this.urlTest + "/dropdownWeight";
                    return clientService.post(urlRequest, model);
                },
                dropdownVolume: function (model) {
                    var urlRequest = this.urlTest + "/dropdownVolume";
                    return clientService.post(urlRequest, model);
                },


                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },

                setData: function (model){
                    getDefault = model;
                },
                getData: function (){
                    return getDefault;
                },

                // //binbalance
                // filterBinbalance: function (model) {
                //     var urlRequest = this.urlBinbalance + "/filter";
                //     return clientService.post(urlRequest, model);
                // },
                //PickBinbalanceTransfer
                filterBinbalance: function (model) {
                    var urlRequest = this.urlPick + "/filter";
                    return clientService.post(urlRequest, model);
                },

                filterBinbalanceAB03: function (model) {
                    var urlRequest = this.urlBinbalance + "/filterAB03";
                    return clientService.post(urlRequest, model);
                },
                pickProduct: function (model) {
                    var urlRequest = this.urlBinbalance + "/pickProduct";
                    return clientService.post(urlRequest, model);
                },
                ListPickProduct: function (model) {
                    var urlRequest = this.urlBinbalance + "/ListPickProduct";
                    return clientService.post(urlRequest, model);
                },
                dropdownWarehouse: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownWarehouse";
                    return clientService.post(urlRequest, model);
                },
                // dropdownItemStatus: function (model) {
                //     var urlRequest = this.urlBinbalance + "/dropdownItemStatus";
                //     return clientService.post(urlRequest, model);
                // },
                dropdownLocation: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownLocation";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductType: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownProductType";
                    return clientService.post(urlRequest, model);
                },
                dropdownZone: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownZone";
                    return clientService.post(urlRequest, model);
                },
                dropdownProductconversion: function (model) {
                    var urlRequest = this.urlBinbalance + "/dropdownProductconversion";
                    return clientService.post(urlRequest, model);
                },
                dropdownStorageLoc: function (model) {
                    var urlRequest = this.urlPGI + "DropdownPlanGoodsIssue/dropdownStorageLoc";
                    return clientService.post(urlRequest, model);
                }, 
                getsoloto: function (model) {
                    var urlRequest = this.urlPGI + "AutoPlanGoodIssue/autoSoldTofilter";
                    return clientService.post(urlRequest, model);
                }, 


                //Add new
                getId: function (model) {
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                createGoodsTransferHeader: function (model) {
                    var urlRequest = this.url + "/createGoodsTransferHeader";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                pickProduct: function (model) {
                    var urlRequest = this.url + "/pickProduct";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                ListPickProduct: function (model) {
                    var urlRequest = this.url + "/ListPickProduct";
                    return clientService.post(urlRequest, model);
                },
                deletePickProduct: function (model) {
                    var urlRequest = this.url + "/deletePickProduct";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                updateDocument: function (model) {
                    var urlRequest = this.url + "/updateDocument";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                updateDocumentReturnTransNo: function (model) {
                    var urlRequest = this.url + "/updateDocumentReturnTransNo";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                confirmDocument: function (model) {
                    var urlRequest = this.url + "/confirmDocument";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                AutoTranfer: function (model) {
                    var urlRequest = this.urlSRTN + "/Bypass_confirmTaskTransfer";

                    return clientService.post(urlRequest, model);
                },
                confirmTransfer: function (model) {
                    var urlRequest = this.url + "/confirmTransfer";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                deleteDocument: function (model) {
                    var urlRequest = this.url + "/deleteDocument";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                deletePickProductQI: function (model) {
                    var urlRequest = this.url + "/deletePickProductQI";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                GetReport: function (model) {
                    var urlRequest = this.url + "/GetReport";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);
                    
                    return clientService.popupReport(urlRequest, model);
                },
                SentToSap: function (model) {
                    var urlRequest = this.url + "/sendToSap";
                    return clientService.post(urlRequest, model);
                },

                //master
                getOwner: function (model) {
                    var urlRequest = this.urlMaster + "/Owner/ownerfilter";
                    return clientService.post(urlRequest, model);
                },
                ListdeletePickProduct: function (model) {
                    var urlRequest = this.url + "/ListdeletePickProduct";
                    return clientService.post(urlRequest, model);
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
            logs.menu_Index = "2244C514-9000-4362-A8EA-D1F80214DD0F";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "ระบบจัดการภายในคลังพัสดุ";
            logs.sub_Menu_Index = "C6F77105-4E5C-479D-8989-B90B3C5A058B"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "การโอนย้ายสินค้า";
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
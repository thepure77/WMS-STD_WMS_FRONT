(function () {
    'use strict';
    app.factory("goodsReceiveFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData;
            var getDefault;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "goodsReceive",
                urlOMS: webServiceAPI.OMS + "MakeAMZ",

                urlDropdown: webServiceAPI.GR + "DropdownGoodsReceive",
                urlPutaway: webServiceAPI.Putaway + "Putaway",
                urlLogsRequest: webServiceAPI.LogsUser + "Logs/insertLogsRequest",

                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                getDeletePGR: function (model) {
                    var urlRequest = this.url + "/DeletePGR";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url + "/Create";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                makeAMZ: function (model) {
                    var urlRequest = this.urlOMS + "/make";
                    return clientService.post(urlRequest, model);
                },
                Sales_return: function (model) {
                    var urlRequest = this.urlOMS + "/Sales_return";
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url;

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                grSearch: function (model) {
                    var urlRequest = this.url + "/filter" + "/";
                    return clientService.post(urlRequest, model);
                },
                GoodsReceiveConfirm: function (model) {
                    var urlRequest = this.url + "/GoodsReceiveConfirmV3";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                GoodsReceiveConfirmUnPack: function (model) {
                    var urlRequest = this.url + "/GoodsReceiveConfirmUnPack";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/Confirm";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                AutoScanReceive: function (model) {
                    var urlRequest = this.url + "/AutoScanReceive";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url + "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                po_sub: function (model) {
                    var urlRequest = this.url + "/get_Pocontrack";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssign: function (model) {
                    var urlRequest = this.url + "/checkUserAssign";
                    return clientService.post(urlRequest, model);
                },
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssignKey: function (model) {
                    var urlRequest = this.url + "/updateUserAssignKey";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownProcessStatus: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownProcessStatus";
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
                dropdownCostCenter: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCostCenter";
                    return clientService.post(urlRequest, model);
                },
                ProductBarcode: function (model) {
                    var urlRequest = this.url + "/GetProductBarcode";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    getData = model;
                },
                setDate: function (model){
                    getDefault = model;
                },
                getParam: function (){
                    return getData;
                },
                getData: function (){
                    return getDefault;
                },
                PrintGR: function (model) {
                    var urlRequest = this.url+ "/PrintGR";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                PrintGRPutaway: function (model) {
                    var urlRequest = this.url+ "/PrintGRPutaway";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);
                    
                    return clientService.popupReport(urlRequest, model);
                },
                PrintReceipt: function (model) {
                    var urlRequest = this.url+ "/PrintReceipt";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                PrintReportPutawayGR: function (model) {
                    var urlRequest = this.urlPutaway+ "/ReportPutawayGR";

                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);

                    return clientService.popupReport(urlRequest, model);
                },
                SentToSap: function (model) {    
                    var urlRequest = this.url + "/SentToSap" + "/";
                    return clientService.post(urlRequest,model);
                },
                
                dropdownDocumentPriority: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownDocumentPriority";
                    return clientService.post(urlRequest, model);
                },
                dropdownwarehouse: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownWarehouse";
                    return clientService.post(urlRequest, model);
                },
                dropdownShipmentType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownShipmentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownCargoType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownCargoType";
                    return clientService.post(urlRequest, model);
                },
                dropdownUnloadingType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownUnloadingType";
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
                dropdownContainerType: function (model) {
                    var urlRequest = this.urlDropdown + "/dropdownContainerType";
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
                PrintReportPrintOutGR: function (model) {
                    var urlRequest = this.url + "/ReportPrintOutGR";
                
                    // var resultModel = logsRequest(model.operations,urlRequest,model);
                    // clientService.post(this.urlLogsRequest, resultModel);
                
                    return clientService.popupReport(urlRequest, model);
                },
                SearchTagPutaway: function (model) {
                    var urlRequest = this.url + "/SearchTagPutaway";
                    return clientService.post(urlRequest, model);
                },
                popupBomIfilter: function (model) {
                    var urlRequest = this.url + "/popupBomIfilter";
                    return clientService.post(urlRequest, model);
                },
                updateStatusBom: function (model) {
                    var urlRequest = this.url + "/updateStatusBom";
                    return clientService.post(urlRequest, model);
                },
                makeAllGr: function (model) {
                    var urlRequest = this.url + "/makeAllGr";
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
            logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
            //logs.menuType_Index
            //logs.menu_Id
            logs.menu_Name = "จัดการสินค้า ขาเข้า";
            logs.sub_Menu_Index = "D6184BDC-944E-4104-A825-80846094CA20"
            //logs.sub_MenuType_Index
            //logs.sub_Menu_Id
            logs.sub_Menu_Name = "ใบรับสินค้า";
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